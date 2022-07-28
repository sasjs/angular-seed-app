import { Component, OnInit } from '@angular/core'
import { StateService } from '../state.service'
import { SasService } from '../sas.service'

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  public areas: any[] = []
  public selectedArea: any = null
  public springs: any[] = []
  public springsLoading: boolean = false
  public noData: boolean = false

  public displayedColumns: string[] = [
    'LATITUDE',
    'LONGITUDE',
    'NAME',
    'AREA',
    'TYPE',
    'FARENHEIT',
    'CELSIUS'
  ]

  constructor(
    private stateService: StateService,
    private sasService: SasService
  ) {}

  ngOnInit(): void {
    this.stateService.startupData.subscribe((data: any) => {
      this.areas = data.areas
      // Example to access another table from same response:
      // data.secondTable
    })
  }

  public submitData() {
    this.springsLoading = true
    let data = { areas: [{ area: this.selectedArea }] }

    this.sasService.request('common/getdata', data).then((res: any) => {
      this.springs = res['springs']
      this.springsLoading = false

      if (!res || !res['springs'] || res['spring']?.length < 1) {
        this.noData = true
      } else {
        this.noData = false
      }
    })
  }
}
