import { Component, OnInit } from '@angular/core';
import { PersistanceService } from '../../shared/services';

declare var $: any;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  constructor(private persistanceService: PersistanceService ) { }

  ngOnInit() {
    $(document).ready(function() {
      $('.intro').slick({
        infinite: false,
        arrows: true,
        dots: false
      });
    });
  }

  start() {
    this.persistanceService.set('viewIntro', true);
  }

}
