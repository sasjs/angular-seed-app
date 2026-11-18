/* Angular Seed App mock: services/files/upload
 *
 * The JavaScript twin of upload.sas. The SAS service copies an uploaded file
 * into a directory on the server and answers with a directory listing; here the
 * directory is a folder in the browser's drive, which is the only filesystem a
 * mock build has.
 *
 * The first _WEBIN_ entry names a staged file; read it without an encoding to
 * preserve its bytes. `path` is a request parameter bound by the host.
 */

const pathNode = require('path')

const DRIVE_FILES = pathNode.resolve(
  weboutPath,
  '..',
  '..',
  '..',
  'drive',
  'files'
)
const APP_LOC = String(_program).replace(/\/(services|jobs|tests)\/.*$/, '')

const folder = String(path || '/').replace(/\/+$/, '') || '/'
// Browser uploads use the virtual drive's absolute prefix; Server callers use
// drive-relative paths. Both must resolve beneath the mock drive root.
const virtualPrefix = '/sasjs/drive/files'
const drivePath =
  folder === virtualPrefix || folder.startsWith(virtualPrefix + '/')
    ? folder.slice(virtualPrefix.length) || '/'
    : folder
const mounted = pathNode.resolve(DRIVE_FILES, '.' + drivePath)
const insideDrive = (value) =>
  value === DRIVE_FILES || value.startsWith(DRIVE_FILES + pathNode.sep)
const invalidPath =
  !folder.startsWith('/') ||
  /[\\\0]/.test(folder) ||
  folder.split('/').some((part) => part === '..') ||
  !insideDrive(mounted)

/* the _WEBIN_ vars are module-scope consts of the generated program, not
 * properties of globalThis, so they are read by eval with the index inlined */
const webin = (prefix) =>
  eval('typeof ' + prefix + "1 === 'undefined' ? '' : " + prefix + '1')

const filename =
  typeof _WEBIN_FILE_COUNT === 'undefined'
    ? ''
    : String(webin('_WEBIN_FILENAME'))
const invalidFilename =
  filename === '.' || filename === '..' || /[/\\\0]/.test(filename)

// Browser mock fs has no symlinks. On Node, refuse existing symlinks at each
// component and destination; this check is not atomic against local races.
const hasSymlink = (target) => {
  if (typeof fs.lstatSync !== 'function') return false
  const relative = pathNode.relative(DRIVE_FILES, target)
  let current = DRIVE_FILES
  for (const part of ['', ...relative.split(pathNode.sep).filter(Boolean)]) {
    if (part) current = pathNode.join(current, part)
    try {
      if (fs.lstatSync(current).isSymbolicLink()) return true
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      break
    }
  }
  return false
}

/* A mocked run reports a log, because the SAS Logs panel is part of what this
 * seed demonstrates and a JavaScript twin that wrote nothing leaves it empty.
 * The text is a fixture shared by the three twins (mock-sas-log.json); a run
 * reports the failure-shaped one half the time and a clean one the rest, so the
 * panel shows a log with something in it as well as a log with nothing. */
const reportMockLog = () => {
  const file = pathNode.join(
    DRIVE_FILES,
    APP_LOC,
    'services',
    'common',
    'mock-sas-log.json'
  )
  const { noisy, clean } = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const lines = Math.random() < 0.5 ? noisy : clean

  lines.forEach((line) =>
    console.log(line.replaceAll('{{program}}', () => String(_program)))
  )
}

reportMockLog()

let failure
let dirlist
try {
  if (
    invalidPath ||
    invalidFilename ||
    hasSymlink(mounted) ||
    (filename && hasSymlink(pathNode.join(mounted, filename)))
  ) {
    failure = 'Invalid upload path or filename'
  }
} catch (error) {
  failure = 'Unable to validate upload path'
}
if (!failure && filename) {
  let contents
  try {
    contents = fs.readFileSync(webin('_WEBIN_FILEREF'))
  } catch (error) {
    failure =
      'Unable to read staged file; check the upload and use a compatible CLI mock host or SASjs Server'
  }
  if (!failure) {
    try {
      // recursive: an upload into a new multi-level folder must create every
      // level, not fail as a write error on the first missing parent.
      if (!fs.existsSync(mounted)) fs.mkdirSync(mounted, { recursive: true })
      fs.writeFileSync(pathNode.join(mounted, filename), contents)
    } catch (error) {
      failure = 'Unable to write uploaded file'
    }
  }
} else if (!failure) {
  try {
    if (!fs.existsSync(mounted)) fs.mkdirSync(mounted, { recursive: true })
  } catch (error) {
    failure = 'Unable to create upload directory'
  }
}
if (!failure) {
  try {
    dirlist = fs.readdirSync(mounted).map((name) => ({
      FILEPATH: `${folder === '/' ? '' : folder}/${name}`
    }))
  } catch (error) {
    failure = 'Unable to list directory'
  }
}
webout('OPEN')
if (failure) webout('OBJ', 'sasjsAbort', [{ MSG: failure, MAC: _program }])
else webout('OBJ', 'dirlist', dirlist)
webout('CLOSE')
