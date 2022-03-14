import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { SasService } from '../../sas.service'
import * as moment from 'moment'
import { HelperService } from 'src/app/helper.service'

@Component({
  selector: 'app-requests-modal',
  templateUrl: './requests-modal.component.html',
  styleUrls: ['./requests-modal.component.scss']
})
export class RequestsModalComponent implements OnInit {
  private _opened: boolean = false
  get opened(): boolean {
    return this._opened
  }
  @Input()
  set opened(value: boolean) {
    this._opened = value
    if (value) this.modalOpened()
  }

  @Output() openedChange = new EventEmitter()

  public sasLogActive: boolean = true
  public sasSourceCodeActive: boolean = false
  public sasGeneratedCodeActive: boolean = false
  public tablesActive: boolean = false

  public sasjsConfig: any
  public sasjsRequests: any[] = []
  public workTables: any

  constructor(
    private sasService: SasService,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {}

  public parseLogTimestamp(timestamp: any) {
    return `${this.formatTimestamp(timestamp)} ${this.timestampFromNow(
      timestamp
    )}`
  }

  public formatTimestamp(timestamp: any) {
    return moment(timestamp).format
      ? moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
      : timestamp
  }

  public timestampFromNow(timestamp: any) {
    return ` (${moment(timestamp).fromNow()})`
  }

  public modalOpenChange(state: any) {
    this.opened = state
    this.openedChange.emit(this.opened)
  }

  public modalOpened() {
    this.sasjsConfig = this.sasService.getSasjsConfig()
    this.sasjsRequests = this.sasService.getSasRequests()

    for (let req of this.sasjsRequests) {
      this.parseErrorsAndWarnings(req)

      req['appLoc'] = this.cutAppLoc(req.serviceLink)
      req['parsedTimestamp'] = this.parseLogTimestamp(req.timestamp)
    }
  }

  public cutAppLoc(link: string) {
    return link.replace(this.sasjsConfig.appLoc + '/', '')
  }

  public goToLogLine(
    linkingLine: string,
    requestStackId: string,
    type: string
  ) {
    let allLines: any = document.querySelectorAll(
      `#${requestStackId} .log-wrapper.saslog font`
    )
    let logWrapper: any = document.querySelector(
      `#${requestStackId} .log-wrapper.saslog`
    )

    for (let line of allLines) {
      if (line.textContent.includes(linkingLine)) {
        logWrapper.scrollTop = line.offsetTop - logWrapper.offsetTop
        line.style.backgroundColor = '#61a2202b'

        setTimeout(() => {
          line.style = ''
        }, 3000)
      }
    }
  }

  public async parseErrorsAndWarnings(req: any) {
    if (!req || !req.logFile) return
    if (req['logErrors'] !== undefined || req['logWarnings'] !== undefined)
      return

    let errorLines = []
    let warningLines = []

    let logLines = req.logFile.split('\n')

    for (let i = 0; i < logLines.length; i++) {
      if (/<.*>ERROR/gm.test(logLines[i])) {
        let errorLine = logLines[i].substring(
          logLines[i].indexOf('E'),
          logLines[i].length - 1
        )
        errorLines.push(errorLine)
      } else if (/^ERROR/gm.test(logLines[i])) {
        errorLines.push(logLines[i])

        logLines[i] = '<font>' + logLines[i] + '</font>'
      }

      if (/<.*>WARNING/gm.test(logLines[i])) {
        let warningLine = logLines[i].substring(
          logLines[i].indexOf('W'),
          logLines[i].length - 1
        )
        warningLines.push(warningLine)
      } else if (/^WARNING/gm.test(logLines[i])) {
        warningLines.push(logLines[i])

        logLines[i] = '<font>' + logLines[i] + '</font>'
      }
    }

    console.log(warningLines)
    req.logFile = logLines.join('\n')
    req['logErrors'] = errorLines
    req['logWarnings'] = warningLines
  }

  downloadLog(logFile: string) {
    const timestamp = new Date().valueOf()
    this.helperService.downloadTextFile(`logFile-${timestamp}`, logFile)
  }

  downloadSourceCode(sourceCode: string) {
    const timestamp = new Date().valueOf()
    this.helperService.downloadTextFile(`sourceCode-${timestamp}`, sourceCode)
  }

  downloadGeneratedCode(generatedCode: string) {
    const timestamp = new Date().valueOf()
    this.helperService.downloadTextFile(
      `generatedCode-${timestamp}`,
      generatedCode
    )
  }
}
