import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService, NotificationService } from '@app/core/http';
import { LocationService } from '@app/shared/services';
import { Notification } from '@app/core/models';

@Component({
  selector: 'app-preference-notification',
  templateUrl: './preference-notification.component.html',
  styleUrls: ['./preference-notification.component.scss']
})
export class PreferenceNotificationComponent implements OnInit {
  readonly user: any;
  show = false;
  notifications$: Observable<Notification[]>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private locationService: LocationService,
    private notificationService: NotificationService,
  ) {
    const user = this.auth.user;
    this.user = {
      photoURL: user.photoURL,
      displayName: user.displayName,
      desc: user.desc
    };
    this.notifications$ = this.notificationService
      .notificationList$.asObservable().pipe(filter(n => !!n));
  }

  ngOnInit() { }

  onClose(e: Event) {
    e.preventDefault();
    this.router.navigate([{outlets: {popup: null}}]);
  }

}
