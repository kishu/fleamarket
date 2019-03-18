import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, NotificationService } from '@app/core/http';
import { HtmlClassService, LocationService } from '@app/shared/services';
import { Notification } from '@app/core/models';

@Component({
  selector: 'app-notification',
  templateUrl: './preference-notification.component.html',
  styleUrls: ['./preference-notification.component.scss']
})
export class PreferenceNotificationComponent implements OnInit {
  readonly user: any;
  notifications$: Observable<Notification[]>;

  constructor(
    private auth: AuthService,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private htmlClassService: HtmlClassService
  ) {
    const user = this.auth.user;
    this.user = {
      photoURL: user.photoURL,
      displayName: user.displayName,
      desc: user.desc
    };
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnInit() {
    this.htmlClassService.set('preference-notification');
  }

  goBack(e: any) {
    e.preventDefault();
    this.locationService.goBack();
  }

}
