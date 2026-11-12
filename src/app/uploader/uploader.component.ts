import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UploadFile } from '@sasjs/adapter'
import { parseLog } from '@sasjs/utils/logs'
import { SasService } from '../sas.service'
import { StateService } from '../state.service'

/** What the service said is now in the folder. */
interface Uploaded {
  path: string
  files: string[]
}

/** What `%mp_abort` reported: the reason, the program that raised it, SAS's text. */
interface AbortDetails {
  message: string
  macro: string
  detail: string
}

/**
 * Posts a file to a folder on the server, and shows what came back.
 *
 * A successful upload answers with a directory listing; a refused one answers
 * with an abort payload - where the file went, or why it did not. The abort is
 * shown as a dialog of its own, with a way through to the SAS Logs panel,
 * because the log is where the rest of the story is.
 */
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class UploaderComponent {
  public uploadUrl = 'services/files/upload'
  public uploadPath = ''
  public selectedName = ''
  public uploadLoading = false
  public uploaded: Uploaded | null = null
  public abort: AbortDetails | null = null

  private selectedFiles: File[] = []

  constructor(
    private sasService: SasService,
    private stateService: StateService
  ) {}

  public onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    this.selectedFiles = input.files ? Array.from(input.files) : []
    this.selectedName = this.selectedFiles.map((file) => file.name).join(', ')
    this.uploaded = null
    this.abort = null
  }

  public submit() {
    if (this.selectedFiles.length < 1 || this.uploadPath.length < 1) return

    this.uploadLoading = true
    this.uploaded = null
    this.abort = null

    const files: UploadFile[] = this.selectedFiles.map((file) => ({
      file,
      fileName: file.name
    }))

    this.sasService
      .uploadFile(this.uploadUrl, files, { path: this.uploadPath })
      .then(
        (response: any) => {
          this.uploadLoading = false
          this.read(response)
        },
        (error: any) => {
          this.uploadLoading = false
          this.abort = {
            message:
              this.text(this.find(error, 'message')) ||
              'The upload request failed.',
            macro: '',
            detail: ''
          }
        }
      )
  }

  /** Opens the SAS Logs panel in the shell and dismisses the dialog. */
  public showLogs() {
    this.abort = null
    this.stateService.requestSasLogs()
  }

  public dismissAbort() {
    this.abort = null
  }

  /**
   * Reads the answer: a directory listing, or the abort payload `%mp_abort`
   * produces (`{ sasjsAbort: [{ MSG, MAC }], SYSERRORTEXT }`).
   *
   * An abort arrives as a *resolved* response, so a refused upload is an answer
   * with a message in it rather than an exception - and when the adapter hands
   * on nothing usable, the reason is read from the log of the request that
   * failed, which is the same log the SAS Logs panel shows.
   */
  private read(response: any) {
    const abort = this.find(response, 'sasjsabort')

    if (abort) {
      const first = (Array.isArray(abort) ? abort[0] : abort) || {}

      this.abort = {
        message:
          this.text(this.find(first, 'msg')) ||
          'The service aborted the upload.',
        macro: this.text(this.find(first, 'mac')),
        detail:
          this.text(this.find(response, 'syserrortext')) ||
          this.text(this.find(response, 'syswarningtext'))
      }

      return
    }

    const rows = Array.isArray(response)
      ? response
      : response && Array.isArray(response.dirlist)
      ? response.dirlist
      : []

    const files = rows
      .map((row: any) => row && (row.FILEPATH || row.filepath))
      .filter((path: any) => typeof path === 'string' && path.length > 0)

    if (files.length > 0) {
      this.uploaded = { path: this.uploadPath, files }
      return
    }

    this.abort = { message: this.reasonFromLog(), macro: '', detail: '' }
  }

  /** The reason, taken from the log of the request that just failed. */
  private reasonFromLog(): string {
    const requests = this.sasService.getSasRequests() || []
    const last = requests.length ? requests[requests.length - 1] : undefined
    const errors = parseLog((last && last.logFile) || '').filter(
      (issue) => issue.severity === 'error'
    )

    return errors.length
      ? `${errors[0].message.trim()} (line ${errors[0].line + 1})`
      : 'The service answered without a directory listing.'
  }

  /** A key from a webout, whatever case the adapter left it in. */
  private find(source: any, name: string): any {
    if (!source || typeof source !== 'object') return undefined

    const key = Object.keys(source).find(
      (candidate) => candidate.toLowerCase() === name
    )

    return key === undefined ? undefined : source[key]
  }

  private text(value: any): string {
    return typeof value === 'string' ? value.trim() : ''
  }
}
