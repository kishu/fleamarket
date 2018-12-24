import { Component, OnInit } from '@angular/core';
import { AuthMailData } from '../../../shared/models';

enum Phase { mail, code, nick }

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  Phase: typeof Phase = Phase;
  phase = Phase.mail;
  private authMailData: AuthMailData;

  constructor() { }

  ngOnInit() {
  }

  onReset() {
    this.phase = Phase.mail;
  }

  onSubmittedMail(authMailData: AuthMailData) {
    this.authMailData = authMailData;
    this.phase = Phase.code;
  }

  onSubmittedCode() {
    this.phase = Phase.nick;
  }

}
