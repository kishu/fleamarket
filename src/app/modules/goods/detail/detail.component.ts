import * as $ from 'jquery';
import 'slick-carousel';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {map, pluck, tap} from 'rxjs/operators';
import {Goods, Market, User} from '../../../shared/models';
import {GoodsService} from '../../../core/http';
import {Observable} from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  group: string;
  market: Market;
  goods: Goods;
  imageURL = environment.cloudinary.imageURL;
  user$: Observable<User>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private goodsService: GoodsService
  ) {
    const { user, group } = this.route.snapshot.data.loginInfo;
    this.goods = this.route.snapshot.data.goods;
    this.user$ = this.goodsService.getGoodsUser(this.goods.userRef);

    this.route.params.pipe(
      pluck('market'),
      map((market: string) => market.toUpperCase()),
      tap(market => {
        this.market = <Market>market;
        switch (market) {
          case Market.Group:
            this.group = group.name;
            break;
          case Market.Lounge:
            this.group = '2nd Lounge';
            break;
        }
      })
    ).subscribe();
  }

  ngOnInit() {
    $(document).ready(function() {
      $('.single-item').slick({
        arrows: false,
        dots: true
      });
    });
  }

}
