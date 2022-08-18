import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { DataComponent } from './data/data.component'
import { HomePageComponent } from './home-page/home-page.component'
import { ClarityModule } from '@clr/angular'
import { UploaderComponent } from './uploader/uploader.component'
import { NgxSasjsModule } from '@sasjs/ngx-sasjs';
import { SasjsUiComponent } from './sasjs-ui/sasjs-ui.component'

@NgModule({
  declarations: [
    AppComponent,
    DataComponent,
    HomePageComponent,
    UploaderComponent,
    SasjsUiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxSasjsModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
