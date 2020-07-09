import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { DataComponent } from './data/data.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ClarityModule } from '@clr/angular';
import { RequestsModalComponent } from './components/requests-modal/requests-modal.component';

@NgModule({
  declarations: [AppComponent, LoginModalComponent, DataComponent, HomePageComponent, RequestsModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LoginModalComponent]
})
export class AppModule {}
