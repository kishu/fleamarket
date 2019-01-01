import * as $ from 'jquery';
import 'slick-carousel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayName: string;
  // todo fetch group data for login user
  corpDisplayName: string;

  constructor(
    private route: ActivatedRoute) { }

  ngOnInit() {
    const user: User = this.route.snapshot.data.user;
    this.displayName = user.displayName;
    // this.corpDisplayName = user.corp.displayName;

    $(document).ready(function() {
      $('.welcome .button').on('click', function(e) {
        e.preventDefault();
        $('.welcome').hide();
        $('.dimmed').hide();
      });

      $('.single-item').slick({
        arrows: false,
        dots: true
      });
    });
  }

}
