import { Component, OnInit } from '@angular/core';
import { StateService } from './state.service';
import { SasService } from './sas.service';

import { SASjsConfig } from '@sasjs/adapter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = true;
  public requestModal: boolean = false;
  public sasjsConfig: SASjsConfig = new SASjsConfig();
  public username: string = '';

  constructor(
    private stateService: StateService,
    private sasService: SasService,
    private router: Router
  ) {
    sasService.fetchStartupData();
  }

  ngOnInit() {
    this.getSasjsConfig();

    this.stateService.isUserLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.stateService.username.subscribe((username: string) => {
      this.username = username;
    });
  }

  public openDocs() {
    window.location.replace(`${window.location.pathname}/docs`)
  }

  public debugChanged() {
    if (this.sasjsConfig) {
      this.sasService.setDebugState(this.sasjsConfig.debug);
    }
  }

  public getSasjsConfig() {
    this.sasjsConfig = this.sasService.getSasjsConfig();
  }

  public logout() {
    this.sasService.logout();
  }
}
