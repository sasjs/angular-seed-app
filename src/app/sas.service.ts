import { Injectable } from '@angular/core'

import SASjs, { UploadFile } from '@sasjs/adapter'
import { StateService } from './state.service'

@Injectable({
  providedIn: 'root'
})
export class SasService {
  private adapter: SASjs

  constructor(private stateService: StateService) {
    /* The configuration lives in the `<sasjs>` element in index.html - the tag
     * `sasjs build -t <target>` rewrites, which is how one repo serves a Viya,
     * a SAS 9, a SASjs Server and a browser-hosted mock build. Reading it here
     * is what makes the deployed app agree with the target it was built for. */
    const element = document.querySelector('sasjs')
    const attribute = (name: string) => element?.getAttribute(name) || undefined

    this.adapter = new SASjs({
      appLoc: attribute('appLoc'),
      serverType: attribute('serverType') as any,
      serverUrl: attribute('serverUrl'),
      loginMechanism: attribute('loginMechanism') as any,
      debug: attribute('debug') === 'true',
      useComputeApi: attribute('useComputeApi') === 'true',
      contextName: attribute('contextName')
    })
  }

  public fetchStartupData() {
    this.request('common/appinit', null).then((response: any) => {
      console.log(response)
      this.stateService.setStartupData(response)
    })
  }

  public request(url: string, data: any, config?: any) {
    url = 'services/' + url

    return new Promise((resolve, reject) => {
      this.adapter
        .request(url, data, config, () => {
          this.stateService.setIsLoggedIn(false)
        })
        .then(
          (res: any) => {
            if (res.login === false) {
              this.stateService.setIsLoggedIn(false)
              this.stateService.username.next('')
              reject(false)
            }

            // SSO (eg `loginMechanism: 'Redirected'` on SAS 9) means there is
            // no username to begin with, and a session can change under the app.
            // Every response that carries MF_GETUSER updates it, so the header
            // follows the session rather than the login form.
            if (res.MF_GETUSER) {
              this.stateService.username.next(res.MF_GETUSER)
            }

            if (res.status === 404) {
              reject({ MESSAGE: res.body || 'SAS responded with an error' })
            }

            resolve(res)
          },
          (err: any) => {
            reject(err)
          }
        )
    })
  }

  public async login(username: string, password: string) {
    return this.adapter
      .logIn(username, password)
      .then(
        (res: { isLoggedIn: boolean; userName: string }) => {
          console.log(res)
          this.stateService.setIsLoggedIn(res.isLoggedIn)

          this.stateService.username.next(res.userName)

          return res.isLoggedIn
        },
        (err: any) => {
          console.error(err)
          this.stateService.setIsLoggedIn(false)
          return false
        }
      )
      .catch((e: any) => {
        if (e === 403) {
          console.error('Invalid host')
        }
        return false
      })
  }

  public uploadFile(sasService: string, files: UploadFile[], params?: any) {
    return this.adapter.uploadFile(sasService, files, params)
  }

  public logout() {
    this.adapter.logOut().then(() => {
      this.stateService.setIsLoggedIn(false)
      this.stateService.username.next('')
    })
  }

  public getSasjsConfig() {
    return this.adapter.getSasjsConfig()
  }

  public getSasRequests() {
    return this.adapter.getSasRequests()
  }

  public setDebugState(state: boolean) {
    this.adapter.setDebugState(state)
  }
}
