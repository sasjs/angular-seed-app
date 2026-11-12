import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

export interface AppState {
  isUserLoggedIn: boolean
  startupData: any
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private isUserLoggedIn$ = new BehaviorSubject(true)
  public isUserLoggedIn = this.isUserLoggedIn$.asObservable()

  private startupData$ = new BehaviorSubject([])
  public startupData = this.startupData$.asObservable()

  public username = new BehaviorSubject('')

  /**
   * A page asking the shell to open the SAS Logs panel - the panel belongs to
   * the shell, and a page that has just failed a request is the one that knows
   * the reader wants to see why.
   */
  private openSasLogs$ = new Subject<void>()
  public openSasLogs = this.openSasLogs$.asObservable()

  public requestSasLogs() {
    this.openSasLogs$.next()
  }

  public setIsLoggedIn(value: boolean) {
    this.isUserLoggedIn$.next(value)
  }

  public setStartupData(data: any) {
    this.startupData$.next(data)
  }
}
