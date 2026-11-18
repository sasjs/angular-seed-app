const test = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

test('browser harness reports a signal-terminated Chromium without hanging', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'browser-signal-test-'))
  try {
    const browser = path.join(dir, 'chromium')
    fs.writeFileSync(browser, '#!/bin/sh\nkill -TRAP $$\n', { mode: 0o700 })
    const result = spawnSync(
      process.execPath,
      ['scripts/check-mock-browser.js'],
      {
        env: { ...process.env, CHROMIUM_PATH: browser },
        encoding: 'utf8',
        timeout: 14000
      }
    )
    assert.equal(result.error, undefined, `harness hung: ${result.error}`)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /Chromium.*SIGTRAP/)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
