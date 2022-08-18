import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { SASjsConfig, SASjsRequest } from '@sasjs/adapter'
import { NavLink, UserDropdownItem } from '@sasjs/ngx-sasjs'
import { SasService } from '../sas.service'
import { StateService } from '../state.service'

@Component({
  selector: 'app-sasjs-ui',
  templateUrl: './sasjs-ui.component.html',
  styleUrls: ['./sasjs-ui.component.scss']
})
export class SasjsUiComponent implements OnInit {
  public isLoggedIn: boolean = true
  public requestModal: boolean = false
  public sasjsConfig: SASjsConfig = new SASjsConfig()
  public sasjsRequests: SASjsRequest[] = []
  public username: string = ''
  public loginLoading: boolean = false
  public logo: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABVCAYAAAA49ahaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF3mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDItMTZUMDk6Mjk6MDhaIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xNlQxMDowMTowMloiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDItMTZUMTA6MDE6MDJaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg4NzQ1M2JkLWRjZWEtNGZkYi1hZWY5LTJjOTcwYzBmYTQ3OCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjAyYzZhMWNiLTY1MzYtMWU0ZC04MWE2LTY0ODk5MzRjNWM4YSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjc2ZjNhNzIwLTU4MWQtNDU0YS1hYmIyLTE4OTg4NjgyYzkwZSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NzZmM2E3MjAtNTgxZC00NTRhLWFiYjItMTg5ODg2ODJjOTBlIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTE2VDA5OjI5OjA4WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg4NzQ1M2JkLWRjZWEtNGZkYi1hZWY5LTJjOTcwYzBmYTQ3OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0xNlQxMDowMTowMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgU8a6AAAAmVSURBVHic7ZxbrFxVGcd/38w5pxeLVGg1tSQUbCIEHjRGIybiBfACKF5qohZNQEmjGEJCNEajDyWxmuiDhhDevMR6aTQlXtoQk6ImQowKqbRoVQIoF6laK5RyLjPz92GtdfY3++yZM6ez98xQ9j/ZWfusy15r//e31ndZa45Joka5aIx7AKcjalIrQE1qBahJrQA1qRWgJrUC1KRWgJrUClCTWgFqUitATWoFqEmtADWpFaAmtQJMDdPYzMoax0rRAPKdy12nhLLCoEOROgYYgdB2j/LGMuUjwfOJ1Kakjpm1ASTN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'

  public navLinks: NavLink[] = [
    { label: 'Homepage', routerLink: '/homepage' },
    { label: 'Data', routerLink: '/data' },
    { label: 'File upload', routerLink: '/uploader' }
  ]
  public userDropdownItems: UserDropdownItem[] = [
    { label: 'SAS Logs', clickCallback: () => this.openSasLogs() },
    { label: 'Documentation', clickCallback: () => this.openDocs() },
    { label: 'Log out', clickCallback: () => this.logout() }
  ]

  constructor(
    private stateService: StateService,
    private sasService: SasService,
    private router: Router
  ) {
    sasService.fetchStartupData()
  }

  ngOnInit() {
    this.getSasjsConfig()

    this.stateService.isUserLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn
    })

    this.stateService.username.subscribe((username: string) => {
      this.username = username
    })
  }

  public openSasLogs() {
    this.requestModal = true
  }

  public openChange(open: boolean) {
    if (open) this.sasjsRequests = this.sasService.getSasRequests()
  }

  public openDocs() {
    window.location.replace(`${window.location.pathname}/docs`)
  }

  public debugChanged() {
    if (this.sasjsConfig) {
      this.sasService.setDebugState(this.sasjsConfig.debug)
    }
  }

  public getSasjsConfig() {
    this.sasjsConfig = this.sasService.getSasjsConfig()
  }

  public login(credentials: { username: string; password: string }) {
    this.loginLoading = true

    this.sasService.login(credentials.username, credentials.password).then(
      (success: any) => {
        this.loginLoading = false

        if (!success) {
          alert('Wrong username or password, please try again.')
        }
      },
      (err: any) => {
        this.loginLoading = false
      }
    )
  }

  public logout() {
    this.sasService.logout()
  }
}
