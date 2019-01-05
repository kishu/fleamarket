import * as $ from 'jquery';
import 'slick-carousel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsService } from '../../core/http';
import { Goods } from '../../shared/models';
import {merge, Observable} from 'rxjs';
import {filter, map, pluck, switchMap, switchMapTo, tap} from 'rxjs/operators';

const enum GoodsBy {
  Group = 'GROUP',
  Lounge = 'LOUNGE'
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string;
  groupName: string;
  goodsBy: GoodsBy;

  goods$: Observable<Goods[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goodsService: GoodsService) {

    const { user, group } = this.route.snapshot.data.loginInfo;
    this.userName = user.displayName;
    this.groupName = group.name;

    // console.log(user);

    this.goods$ = this.route.params.pipe(
      pluck('goodsBy'),
      map((goodsBy: string) => goodsBy && goodsBy.toUpperCase()),
      switchMap(goodsBy => {
        switch (goodsBy) {
          case GoodsBy.Lounge:
            this.goodsBy = GoodsBy.Lounge;
            return this.goodsService.getGoodsByLounge();
          default:
            this.goodsBy = GoodsBy.Group;
            return this.goodsService.getGoodsByGroup(user.groupRef);
        }
      })
    );
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

  showGoodsBy(goodsBy: GoodsBy) {
    switch (goodsBy) {
      case GoodsBy.Group:
        this.router.navigate(['/home']);
        break;
      case GoodsBy.Lounge:
        this.router.navigate(['/home', goodsBy.toLowerCase()]);
        break;
    }
  }
}
