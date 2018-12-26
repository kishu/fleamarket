import * as $ from 'jquery';
import 'slick-carousel';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function() {
      $('.intro').slick({
        infinite: false,
        arrows: true,
        dots: false
      });
    });
  }

}
