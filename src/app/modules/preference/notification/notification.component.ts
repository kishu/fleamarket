import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggedIn } from '@app/core/logged-in.service';
import { NotificationService } from '@app/core/http';
import { LocationService } from '@app/shared/services';
import { Notification } from '@app/shared/models';

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
    private locationService: LocationService,
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

  goBack(e: any) {
    e.preventDefault();
    this.locationService.goBack();
  }

}
