import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core'
import { Router } from '@angular/router'
import { SASjsConfig } from '@sasjs/adapter'
import { LogEntry, LogIssueView, summariseRequests } from '../sas-logs'
import { SasService } from '../sas.service'
import { StateService } from '../state.service'

interface NavLink {
  label: string
  path: string
}

/**
 * The application shell: navigation, sign-in, and the SAS logs panel.
 *
 * Plain Angular and a small stylesheet on purpose - this is the file a reader
 * copies, and every component library the seed carried was a version to keep in
 * step with Angular before anyone had written a line of their own.
 */
@Component({
  selector: 'app-sasjs-ui',
  templateUrl: './sasjs-ui.component.html',
  styleUrls: ['./sasjs-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SasjsUiComponent implements OnInit {
  public isLoggedIn = true
  public requestLogs = false
  public menuOpen = false
  public sasjsConfig: SASjsConfig = new SASjsConfig()
  public username = ''
  public loginLoading = false
  public loginError = ''
  public credentials = { username: '', password: '' }
  public entries: LogEntry[] = []

  public navLinks: NavLink[] = [
    { label: 'Homepage', path: '/homepage' },
    { label: 'Data', path: '/data' },
    { label: 'File upload', path: '/uploader' }
  ]

  constructor(
    private stateService: StateService,
    private sasService: SasService,
    private router: Router
  ) {
    sasService.fetchStartupData()
  }

  ngOnInit() {
    this.sasjsConfig = this.sasService.getSasjsConfig()

    this.stateService.isUserLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn
    })

    this.stateService.username.subscribe((username: string) => {
      this.username = username
    })

    /* a page that just failed a request can ask for the log */
    this.stateService.openSasLogs.subscribe(() => this.openLogs())
  }

  /** Read once on open, so the panel shows what was captured up to that point. */
  public openLogs() {
    this.menuOpen = false
    this.requestLogs = true
    this.entries = summariseRequests(this.sasService.getSasRequests() || [])
  }

  public closeLogs() {
    this.requestLogs = false
  }

  /**
   * Scrolls the log to the line a message points at, and flashes it.
   *
   * The message carries the line index `parseLog` reported, and the log is
   * rendered one element per line, so this is a lookup rather than a search of
   * the text - a log with the same message twice still lands on the right one.
   */
  public jumpTo(entry: LogEntry, issue: LogIssueView, event: Event) {
    const entryElement = (event.target as HTMLElement).closest('.entry')
    const pane = entryElement?.querySelector('.log-pane')
    const line = pane?.querySelector(`[data-line="${issue.line}"]`)

    if (line) line.scrollIntoView({ block: 'center' })

    entry.flashLine = issue.line
    window.setTimeout(() => (entry.flashLine = undefined), 1600)
  }

  /** Escape closes the panel, the way a dialog is expected to behave. */
  @HostListener('document:keydown.escape')
  public onEscape() {
    if (this.requestLogs) this.closeLogs()
  }

  public openDocs() {
    this.menuOpen = false
    window.location.replace(`${window.location.pathname}/docs`)
  }

  public login() {
    this.loginLoading = true
    this.loginError = ''

    this.sasService
      .login(this.credentials.username, this.credentials.password)
      .then(
        (success: any) => {
          this.loginLoading = false

          if (!success)
            this.loginError = 'Wrong username or password, please try again.'
          if (success) this.credentials = { username: '', password: '' }
        },
        () => {
          this.loginLoading = false
          this.loginError = 'The sign-in request failed.'
        }
      )
  }

  public logout() {
    this.menuOpen = false
    this.sasService.logout()
  }
}
