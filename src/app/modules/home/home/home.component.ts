import * as $ from 'jquery';
import Slideout from 'slideout';
import 'slick-carousel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedIn } from '../../../core/logged-in.service';
import { GoodsService } from '../../../core/http';
import { Goods } from '../../../shared/models';
import { Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  groupName: string;
  lounge = false;

  goods$: Observable<Goods[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loggedIn: LoggedIn,
    private goodsService: GoodsService) {
    this.groupName = this.loggedIn.group.name;

    this.goods$ = this.route.url.pipe(
      switchMap(url => {
        if (url.length === 0) {
          this.lounge = false;
          return this.goodsService.getGoodsByGroup(this.loggedIn.user.groupRef);
        } else {
          this.lounge = true;
          return this.goodsService.getGoodsByLounge();
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

  showGoods() {
    this.router.navigate(['/']);
  }

  showGoodsByLounge() {
    this.router.navigate(['/lounge']);
  }
}
