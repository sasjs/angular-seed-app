import { Injectable } from '@angular/core'

import SASjs, { UploadFile } from '@sasjs/adapter'
import { StateService } from './state.service'

@Injectable({
  providedIn: 'root'
})
export class SasService {
  private sasService: any

  constructor(private stateService: StateService) {
    let sasjsConfigInput = (window as any).sasjsConfigInput || {}

    this.sasService = new SASjs(sasjsConfigInput)
  }

  public fetchStartupData() {
    this.request('common/appinit', null).then((response: any) => {
      console.log(response)
      this.stateService.setStartupData(response.areas)
    })
  }

  public request(url: string, data: any, config?: any) {
    url = 'services/' + url

    return new Promise((resolve, reject) => {
      this.sasService
        .request(url, data, config, (loginRequired: boolean) => {
          this.stateService.setIsLoggedIn(false)
        })
        .then(
          (res: any) => {
            if (res.login === false) {
              this.stateService.setIsLoggedIn(false)
              this.stateService.username.next('')
              reject(false)
            }

            if (
              this.stateService.username.getValue().length < 1 &&
              res.MF_GETUSER
            ) {
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
    return this.sasService
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
    return this.sasService.uploadFile(sasService, files, params)
  }

  public logout() {
    this.sasService.logOut().then(() => {
      this.stateService.setIsLoggedIn(false)
      this.stateService.username.next('')
    })
  }

  public getSasjsConfig() {
    return this.sasService.getSasjsConfig()
  }

  public getSasRequests() {
    return this.sasService.getSasRequests()
  }

  public setDebugState(state: boolean) {
    this.sasService.setDebugState(state)
  }
}
