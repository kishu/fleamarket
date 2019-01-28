import { Component, OnInit } from '@angular/core';
import { LoggedIn } from '../../../core/logged-in.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  readonly user: any;

  constructor(
    private loggedIn: LoggedIn,
  ) {
    const user = this.loggedIn.user;
    this.user = {
      photoURL: user.photoURL,
      displayName: user.displayName,
      desc: user.desc
    };
  }

  ngOnInit() {
  }

}
