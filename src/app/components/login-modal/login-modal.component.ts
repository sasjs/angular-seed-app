import { Component, OnInit } from '@angular/core'
import { SasService } from '../../sas.service'

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  userName = ''
  password = ''

  loginLoading: boolean = false

  constructor(public sasService: SasService) {}

  ngOnInit() {}

  signIn() {
    this.loginLoading = true

    this.sasService.login(this.userName, this.password).then(
      (success: any) => {
        this.loginLoading = false
        if (success) {
        } else {
          alert('Wrong username or password, please try again.')
        }
      },
      (err: any) => {
        this.loginLoading = false
      }
    )
  }
}
