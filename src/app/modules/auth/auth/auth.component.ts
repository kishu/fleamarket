import { Component, OnInit } from '@angular/core';
import { AuthData } from '@app/shared/models';

enum Phase { mail, code, nick }

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  Phase: typeof Phase = Phase;
  phase = Phase.mail;
  private authData: AuthData;

  constructor() { }

  ngOnInit() {
  }

  onReset() {
    this.phase = Phase.mail;
  }

  onSubmittedMail(authData: AuthData) {
    this.authData = authData;
    this.phase = Phase.code;
  }

  onSubmittedCode() {
    this.phase = Phase.nick;
  }

}
