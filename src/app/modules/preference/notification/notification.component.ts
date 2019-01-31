import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggedIn } from '../../../core/logged-in.service';
import { NotificationService } from '../../../core/http';
import { Notification } from '../../../shared/models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  readonly user: any;
  notifications$: Observable<Notification[]>;

  constructor(
    private loggedIn: LoggedIn,
    private notificationService: NotificationService
  ) {
    const user = this.loggedIn.user;
    this.user = {
      photoURL: user.photoURL,
      displayName: user.displayName,
      desc: user.desc
    };
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnInit() {
  }

}
