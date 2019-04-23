import { Component } from '@angular/core';
import { HtmlClassService } from '@app/shared/services';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { PreferenceNotificationComponent } from './modules/preference/notification/preference-notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({ transform: 'translateY(0)' })),
      state('false', style({ transform: 'translateY(120%)' })),
      transition('false <=> true', animate(200))
    ])
  ]
})
export class AppComponent {
  title = '세컨드마켓';
  popup: boolean;

  private popupComponent: any;

  constructor(
    private htmlClassService: HtmlClassService
  ) { }

  onActivatePopup(e: Component) {
    this.popup = true;
    this.htmlClassService.disableScroll();
    this.popupComponent = e;
  }

  onDeactivatePopup() {
    this.popup = false;
    this.htmlClassService.enableScroll();
    this.popupComponent = null;
  }

  onPopupAnimationDone() {
    if (this.popup && this.popupComponent && this.popupComponent.ready$) {
      this.popupComponent.ready$.next(true);
    }
  }
}
