import { Component } from '@angular/core';
import { HtmlClassService } from '@app/shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '세컨드마켓';
  popup: boolean;

  constructor(
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
}
