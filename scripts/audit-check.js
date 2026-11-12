#!/usr/bin/env node
/*
 * The `npm audit` gate.
 *
 * Two rules, both of them strict:
 *
 *   1. Anything that would ship - the `dependencies` tree - must have no
 *      advisory at any severity. Not "no high", not "no critical": any, because
 *      a shipped advisory is a shipped advisory.
 *   2. Nothing in our own tree may be flagged, at any severity, dev included.
 *
 * The one tolerated class is npm's own vendored CLI. `@semantic-release/npm`
 * vendors the whole `npm` package to do its publishing, so `npm audit` walks a
 * copy of npm's dependency tree and reports advisories in it - 33 of them at the
 * time of writing. We cannot patch those without forking npm, and they are not
 * code this app runs: nothing in the built site imports them. So they are
 * reported as a note and do not gate, and every other finding does.
 *
 * Set AUDIT_TOLERATE=none to see what a no-tolerance rule would say - the CI job
 * does exactly that on one run, which is how we know the gate can fail at all.
 *
 * Usage: node scripts/audit-check.js [--json]
 *        AUDIT_FIXTURE=<file> to read audit output from a fixture (tests only)
 */

const fs = require('fs')
const { execSync } = require('child_process')

const TOLERATE = (process.env.AUDIT_TOLERATE || 'vendored-npm').toLowerCase()
const MACHINE = process.argv.includes('--json')

/* Packages that exist only because semantic-release vendors npm, plus the
 * wrapper packages themselves: an advisory in these is an advisory in npm's own
 * tree, reached through the release tooling. */
const RELEASE_TOOLING = new Set([
  'npm',
  'semantic-release',
  '@semantic-release/npm'
])

const isVendoredNpm = (name, finding) => {
  if (TOLERATE !== 'vendored-npm') return false
  if (RELEASE_TOOLING.has(name)) return true

  const nodes = finding.nodes || []
  return (
    nodes.length > 0 &&
    nodes.every((node) => /(^|\/)node_modules\/npm(\/|$)/.test(node))
  )
}

const runAudit = (omitDev) => {
  const args = ['audit', '--json', '--audit-level', 'low']
  if (omitDev) args.push('--omit=dev')

  try {
    return JSON.parse(
      execSync(`npm ${args.join(' ')}`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore']
      })
    )
  } catch (error) {
    // `npm audit` exits non-zero when it finds something, and still prints JSON
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout)
      } catch {}
    }
    throw new Error(`npm audit could not run: ${error.message}`)
  }
}

const summarise = (advisories) =>
  Object.entries(advisories).map(([name, finding]) => ({
    name,
    severity: finding.severity,
    direct: !!finding.isDirect,
    via: (finding.via || [])
      .map((entry) =>
        typeof entry === 'string' ? entry : entry.title || entry.name
      )
      .slice(0, 3)
  }))

/* A fixture lets the failure path be tested without waiting for an advisory to
 * appear: CI feeds one that carries a shipped advisory and requires exit 1. */
const FIXTURE = process.env.AUDIT_FIXTURE
const load = (which) =>
  FIXTURE
    ? JSON.parse(fs.readFileSync(FIXTURE, 'utf-8'))[which]
    : runAudit(which === 'prod')

const prod = load('prod')
const all = load('all')

const prodFindings = summarise(prod.vulnerabilities || {})
const devOnly = summarise(all.vulnerabilities || {}).filter(
  (finding) => !prodFindings.some((p) => p.name === finding.name)
)
const tolerated = devOnly.filter((finding) =>
  isVendoredNpm(finding.name, all.vulnerabilities[finding.name])
)
const ours = devOnly.filter(
  (finding) => !isVendoredNpm(finding.name, all.vulnerabilities[finding.name])
)

const report = {
  prod: { count: prodFindings.length, findings: prodFindings },
  ours: { count: ours.length, findings: ours },
  tolerated: { count: tolerated.length }
}

if (MACHINE) {
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log(
    `shipped dependencies: ${prod.metadata.dependencies.prod} packages, ${prodFindings.length} advisories`
  )
  console.log(`our own tree: ${ours.length} advisories at any severity`)

  if (tolerated.length) {
    console.log(
      `tolerated: ${tolerated.length} advisories inside the npm CLI that @semantic-release/npm vendors ` +
        `(dev only, not in the built site)${
          TOLERATE === 'vendored-npm' ? '' : ' - tolerance disabled'
        }`
    )
  }

  for (const finding of [...prodFindings, ...ours]) {
    console.log(
      `  ${finding.severity.toUpperCase()} ${finding.name}${
        finding.direct ? ' (direct)' : ''
      }: ${finding.via.join('; ')}`
    )
  }
}

if (prodFindings.length || ours.length) {
  console.error(
    `\naudit failed: ${prodFindings.length} advisory(ies) in shipped dependencies, ${ours.length} in our own tree`
  )
  process.exit(1)
}

console.log('\naudit passed')
