import { Component, OnInit } from '@angular/core';
import { UploadFile } from '@sasjs/adapter';
import { SasService } from '../sas.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  public selectedFile: File | null = null
  public uploadUrl: string = 'services/loadfile'

  constructor(
    private sasService: SasService
  ) { }

  ngOnInit(): void {
  }

  uploadFiles() {
    let filesToUpload: UploadFile[] = []

    this.sasService
      .uploadFile(this.uploadUrl, filesToUpload)
      .then(
        (res: any) => {
          console.log('res', res)
          alert(res)
        },
        (err: any) => {
          console.error(err)
        }
      )
  }
}
