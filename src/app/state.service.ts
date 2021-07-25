import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppState {
  isUserLoggedIn: boolean;
  startupData: any;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private isUserLoggedIn$ = new BehaviorSubject(true);
  public isUserLoggedIn = this.isUserLoggedIn$.asObservable();

  private startupData$ = new BehaviorSubject([]);
  public startupData = this.startupData$.asObservable();

  public username = new BehaviorSubject('');

  public setIsLoggedIn(value: boolean) {
    this.isUserLoggedIn$.next(value);
  }

  public setStartupData(data: any) {
    this.startupData$.next(data);
  }
}
