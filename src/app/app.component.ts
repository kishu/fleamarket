import { Component } from '@angular/core';
import { GlobalToggleService, HtmlClassService } from '@app/shared/services';
import { AuthService } from '@app/core/http';
import { User } from '@app/core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '2nd Market';
  isShowNotification = false;
  readonly user: User;

  constructor(
    private globalToggleService: GlobalToggleService,
    private authService: AuthService,
    private htmlClassService: HtmlClassService,
  ) {
    this.user = this.authService.user;
    this.globalToggleService.notification$.asObservable().subscribe(isShow => {
      if (isShow === undefined) {
        this.isShowNotification = !this.isShowNotification;
        this.htmlClassService.toggle('no-scroll');
      } else {
        this.isShowNotification = isShow;
        this.htmlClassService.toggle('no-scroll');
      }
    });
  }

  onClickNotification() {
    this.globalToggleService.notification$.next();
  }
}
