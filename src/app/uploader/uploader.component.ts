import { Component, OnInit } from '@angular/core'
import { UploadFile } from '@sasjs/adapter'
import { SasService } from '../sas.service'

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  public selectedFiles: any[] = []
  public uploadUrl: string = 'services/files/upload'
  public uploadPath: string = ''
  public responseModalMessage: string | null = null
  public uploadLoading: boolean = false

  constructor(private sasService: SasService) {}

  ngOnInit(): void {}

  submit() {
    console.log('change')

    if (this.selectedFiles.length < 1) return

    this.uploadFiles()
  }

  onFileChange(event: any) {
    this.selectedFiles = event.target.files
  }

  uploadFiles() {
    this.uploadLoading = true

    let filesToUpload: UploadFile[] = []

    for (let file of this.selectedFiles) {
      filesToUpload.push({
        file: file,
        fileName: file.name
      })
    }
    console.log('this.uploadPath', this.uploadPath)
    this.sasService
      .uploadFile(this.uploadUrl, filesToUpload, { path: this.uploadPath })
      .then(
        (res: any) => {
          console.log('res', res)
          ;(this.responseModalMessage = res), (this.uploadLoading = false)
        },
        (err: any) => {
          console.error(err)
          ;(this.responseModalMessage = err), (this.uploadLoading = false)
        }
      )
  }

  typeof(item: any) {
    return typeof item
  }
}
