import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NotificationService } from '@app/core/http';
import { HtmlClassService } from '@app/shared/services';

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

  constructor(
    private notificationService: NotificationService,
    private htmlClassService: HtmlClassService
  ) { }

  onActivatePopup() {
    this.popup = true;
    this.htmlClassService.disableScroll();
  }

  onDeactivatePopup() {
    this.popup = false;
    this.htmlClassService.enableScroll();
  }

  onPopupAnimationDone() {
  }
}
