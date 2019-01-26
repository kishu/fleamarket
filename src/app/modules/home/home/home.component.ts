import * as $ from 'jquery';
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
