import { Component, OnInit } from '@angular/core'
import { StateService } from './state.service'
import { SasService } from './sas.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private sasService: SasService
  ) {
    sasService.fetchStartupData()
  }

  ngOnInit() {
    
  }
}
