import * as $ from 'jquery';
import 'slick-carousel';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsService } from '../../../core/http';
import { Goods, Market } from '../../../shared/models';
import { Observable} from 'rxjs';
import {map, pluck, switchMap, tap} from 'rxjs/operators';
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string;
  groupName: string;
  market =  Market.Group;
  imageURL = environment.cloudinary.imageURL;

  goods$: Observable<Goods[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private goodsService: GoodsService) {
    const { user, group } = this.route.snapshot.data.loginInfo;
    this.userName = user.displayName;
    this.groupName = group.name;

    // console.log(user);

    this.goods$ = this.route.queryParams.pipe(
      pluck('market'),
      map(market => (!market) ? 'group' : market),
      map((market: string) => market && market.toUpperCase()),
      tap(market => {
        this.market = <Market>market;
        this.cd.detectChanges();
      }),
      switchMap(market => {
        switch (market) {
          case Market.Lounge:
            return this.goodsService.getGoodsByLounge();
          default:
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

  showGoodsBy(market: string) {
    switch (market as Market) {
      case Market.Group:
        this.router.navigate(['/'], { queryParams: { market: 'group' } });
        break;
      case Market.Lounge:
        this.router.navigate(['/'], { queryParams: { market: 'lounge' } });
        break;
    }
  }
}
