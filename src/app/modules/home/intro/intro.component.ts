import * as $ from 'jquery';
import 'slick-carousel';
import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '../../../shared/services';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  constructor(private persistenceService: PersistenceService ) { }

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
    this.persistenceService.set('viewIntro', true);
  }

}
