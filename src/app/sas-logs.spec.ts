import { describe, expect, it } from 'vitest'
import { summariseRequests } from './sas-logs'

/* A log as SAS writes one: a note on the log itself, an error from the abort,
 * a warning of the converted-values kind that `parseLog` counts as notable. */
const LOG = [
  'NOTE: Copyright (c) 2016 by SAS Institute Inc., Cary, NC, USA.',
  'NOTE: SAS (r) Proprietary Software 9.4',
  '',
  '1    %mp_abort(iftrue= (%mf_isdir(&path) = 0)',
  'ERROR: Execution canceled by an %ABORT CANCEL statement.',
  'ERROR: Errors printed on page 1.',
  'WARNING: Character values have been converted to numeric values.',
  'NOTE: The SAS System stopped processing this step because of errors.'
].join('\n')

describe('summariseRequests', () => {
  it('counts what the parser reported, not what looks like a keyword', () => {
    const [entry] = summariseRequests([
      {
        serviceLink: 'services/files/upload',
        timestamp: '2026-11-12T18:00:00Z',
        logFile: LOG
      }
    ])

    expect(entry.service).toBe('services/files/upload')
    expect(entry.errors).toBe(2)
    expect(entry.warnings).toBe(1)
    // the copyright and version notes are SAS saying hello, not something to read
    expect(entry.notes).toBeLessThan(3)
    expect(entry.log).toBe(LOG)
  })

  it('keeps a request with no log, and names one with no service', () => {
    const [entry] = summariseRequests([{ logFile: '' }])

    expect(entry.service).toBe('(no service)')
    expect(entry.errors).toBe(0)
    expect(entry.warnings).toBe(0)
    expect(entry.notes).toBe(0)
    expect(entry.log).toBe('')
  })

  it('answers an empty history with an empty list', () => {
    expect(summariseRequests([])).toEqual([])
  })
})
