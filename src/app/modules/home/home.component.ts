import * as $ from 'jquery';
import 'slick-carousel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoodsService } from '../../core/http';
import { Goods } from '../../shared/models';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string;
  groupName: string;

  goods$: Observable<Goods[]>;

  constructor(
    private route: ActivatedRoute,
    private goodsService: GoodsService) {

    const { user, group } = this.route.snapshot.data.loginInfo;
    this.userName = user.displayName;
    this.groupName = group.name;

    // console.log(user);

    this.goods$ = this.goodsService.getGoodsByGroup(user.groupRef);
  }

  ngOnInit() {
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
