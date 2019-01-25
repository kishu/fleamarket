import * as $ from 'jquery';
import Slideout from 'slideout';
import 'slick-carousel';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase';
import { LoggedIn } from '../../../core/logged-in.service';
import { AuthService, GoodsService } from '../../../core/http';
import { Goods, Market } from '../../../shared/models';
import { Observable} from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string;
  userPhotoURL: string;
  userDesc: string;

  groupName: string;
  market =  Market.Group;
  marketName: string;

  goods$: Observable<Goods[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private loggedIn: LoggedIn,
    private authService: AuthService,
    private goodsService: GoodsService) {
    const user = this.authService.user;

    this.userName = user.displayName;
    this.userPhotoURL = user.photoURL;
    this.userDesc = user.desc;

    this.groupName = this.loggedIn.group.name;
    this.marketName = this.loggedIn.group.market;

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
            return this.goodsService.getGoodsByGroup(user.groupRef as firestore.DocumentReference);
        }
      })
    );
  }

  ngOnInit() {
    $(document).ready(function() {
      const slideout = new Slideout({
        'panel': document.getElementById('main'),
        'menu': document.getElementById('menu'),
        'padding': 250,
        'tolerance': 70,
        'touch': false
      });

      function close(eve) {
        eve.preventDefault();
        slideout.close();
      }

      slideout
        .on('beforeopen', function() {
          this.panel.classList.add('panel-open');
        })
        .on('open', function() {
          this.panel.addEventListener('click', close);
        })
        .on('beforeclose', function() {
          this.panel.classList.remove('panel-open');
          this.panel.removeEventListener('click', close);
        });

      // Toggle button
      document.querySelector('.menu-toggle').addEventListener('click', function() {
        slideout.open();
      });

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

  onClickGoods(goods: Goods) {
    this.goodsService.selectedGoods = goods;
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
