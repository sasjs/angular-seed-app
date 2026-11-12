import { parseLog } from '@sasjs/utils/logs'

/** One request as the adapter recorded it, narrowed to what the panel shows. */
export interface RequestLike {
  serviceLink?: string
  timestamp?: Date | string
  logFile?: string
}

/** One row of the SAS logs panel. */
export interface LogEntry {
  service: string
  when: Date | string | undefined
  errors: number
  warnings: number
  notes: number
  log: string
}

/**
 * Summarises the adapter's request history for the SAS logs panel.
 *
 * A pure function, so the counting is testable without a component, a template
 * or a browser - and so the panel and any future caller share one rule for what
 * counts as an error. `parseLog` is the parser Data Controller uses, which is
 * why the counts here agree with the ones in that app.
 */
export const summariseRequests = (requests: RequestLike[]): LogEntry[] =>
  (requests || []).map((request) => {
    const log = request.logFile || ''
    const issues = parseLog(log)
    const count = (severity: 'error' | 'warning' | 'note') =>
      issues.filter((issue) => issue.severity === severity).length

    return {
      service: request.serviceLink || '(no service)',
      when: request.timestamp,
      errors: count('error'),
      warnings: count('warning'),
      notes: count('note'),
      log
    }
  })
