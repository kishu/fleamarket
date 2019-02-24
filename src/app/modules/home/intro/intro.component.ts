import { tns } from 'tiny-slider/src/tiny-slider';
import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '@app/shared/services';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  constructor(private persistenceService: PersistenceService ) { }

  ngOnInit() {
    const slider = tns({
      loop: false,
      nav: false,
      controlsPosition: 'bottom',
      prevButton: false
    } as any);

    slider.events.on('transitionEnd', (info: any) => {
      if (info.displayIndex  === info.slideCount ) {
        info.controlsContainer.style.display = 'none';
      }
    });
  }

  start() {
    this.persistenceService.set('viewIntro', true);
  }

}
