const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const source = fs.readFileSync('sasjs/mocks/services/files/upload.js', 'utf8')

function run(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-upload-'))
  try {
    const drive = path.join(root, 'drive/files')
    const log = path.join(
      drive,
      'Public/app/seed/services/common/mock-sas-log.json'
    )
    fs.mkdirSync(path.dirname(log), { recursive: true })
    fs.writeFileSync(log, JSON.stringify({ clean: [], noisy: [] }))
    fs.mkdirSync(path.join(drive, 'Public/uploads'), { recursive: true })
    const staged = path.join(root, 'staged.bin')
    if (options.bytes !== undefined) fs.writeFileSync(staged, options.bytes)
    const outside = path.join(root, 'outside')
    fs.mkdirSync(outside)
    if (options.symlink)
      fs.symlinkSync(outside, path.join(drive, 'Public/link'))
    if (options.fileSymlink)
      fs.symlinkSync(
        path.join(outside, 'victim'),
        path.join(drive, 'Public/uploads/payload.bin')
      )
    const mockFs = options.failMethod
      ? new Proxy(fs, {
          get(target, key) {
            if (key === options.failMethod)
              return () => {
                throw new Error('injected I/O failure')
              }
            return target[key]
          }
        })
      : fs
    const output = {}
    const context = {
      fs: mockFs,
      require,
      console,
      weboutPath: path.join(root, 'sessions/id/webout'),
      _program: '/Public/app/seed/services/files/upload',
      path: options.escapeRoot
        ? path.join(root, 'new-folder')
        : options.folder || '/Public/uploads',
      _WEBIN_FILE_COUNT: options.noUpload ? 0 : 1,
      _WEBIN_FILENAME1: options.noUpload
        ? ''
        : options.filename || 'payload.bin',
      _WEBIN_FILEREF1:
        options.legacyText === undefined ? staged : options.legacyText,
      webout: (action, name, value) => {
        if (action === 'OBJ') output[name] = value
      }
    }
    vm.runInNewContext(source, context)
    return {
      output,
      saved: fs.existsSync(path.join(drive, 'Public/uploads/payload.bin'))
        ? fs.readFileSync(path.join(drive, 'Public/uploads/payload.bin'))
        : undefined,
      outside: fs.readdirSync(outside),
      created: fs.existsSync(path.join(drive, 'Public/new')),
      escaped: fs.existsSync(path.join(root, 'new-folder/payload.bin'))
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
}

test('copies exact staged bytes and lists the uploaded file inside the drive', () => {
  const bytes = Buffer.from([0xef, 0xbb, 0xbf, 0x41, 0, 0xff, 0xfe])
  const result = run({ bytes })
  assert.deepEqual(result.saved, bytes)
  assert.equal(result.output.dirlist[0].FILEPATH, '/Public/uploads/payload.bin')
})

test('lists the empty folder without an upload', () => {
  assert.equal(run({ noUpload: true }).output.dirlist.length, 0)
})

test('copies an empty uploaded file', () => {
  assert.deepEqual(run({ bytes: Buffer.alloc(0) }).saved, Buffer.alloc(0))
})

test('rejects a host absolute path outside the drive', () => {
  const result = run({ bytes: Buffer.from('x'), escapeRoot: true })
  assert.ok(result.output.sasjsAbort)
  assert.equal(result.escaped, false)
})

test('rejects traversal in path and filename without writing outside the drive', () => {
  for (const options of [
    { folder: '/../../outside' },
    { folder: '/Public/../../outside' },
    { filename: '../../outside/victim' },
    { filename: '..\\outside\\victim' }
  ]) {
    const result = run({ bytes: Buffer.from('x'), ...options })
    assert.ok(result.output.sasjsAbort)
    assert.deepEqual(result.outside, [])
  }
})

test('rejects an existing symlink to outside the drive', () => {
  const result = run({
    bytes: Buffer.from('x'),
    folder: '/Public/link',
    symlink: true
  })
  assert.ok(result.output.sasjsAbort)
  assert.deepEqual(result.outside, [])
})

test('rejects a destination symlink', () => {
  const result = run({ bytes: Buffer.from('x'), fileSymlink: true })
  assert.ok(result.output.sasjsAbort)
  assert.deepEqual(result.outside, [])
})

test('reports write and listing failures as sasjsAbort', () => {
  for (const [failMethod, message] of [
    ['writeFileSync', /Unable to write uploaded file/],
    ['readdirSync', /Unable to list directory/]
  ]) {
    const result = run({ bytes: Buffer.from('x'), failMethod })
    assert.match(result.output.sasjsAbort[0].MSG, message)
  }
})

test('legacy inline file content receives a safe compatibility hint', () => {
  const secret = 'private legacy content that is not a path'
  const result = run({ legacyText: secret })
  const message = result.output.sasjsAbort[0].MSG
  assert.match(message, /Unable to read staged file.*CLI.*Server/)
  assert.doesNotMatch(message, /private legacy/)
  assert.equal(result.saved, undefined)
})

test('reports missing staged file as sasjsAbort', () => {
  const result = run()
  assert.match(result.output.sasjsAbort[0].MSG, /Unable to read staged file/)
})

test('creates a missing single-level folder under the drive', () => {
  const result = run({ noUpload: true, folder: '/Public/new' })
  assert.equal(result.created, true)
  assert.equal(result.output.dirlist.length, 0)
})
