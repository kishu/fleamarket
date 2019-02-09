import {Component, OnDestroy, OnInit} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { InterestService, GoodsService, GoodsListService, GoodsListFilter } from '@app/core/http';
import { PersistanceService } from '@app/shared/services';
import { Goods } from '@app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  userPhotoURL: string;
  groupName: string;
  market: string;
  exceptSoldOut: boolean;

  goodsList$: Observable<Goods[]>;
  private routeEventSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loggedIn: LoggedIn,
    private interestService: InterestService,
    private goodsService: GoodsService,
    private goodsListService: GoodsListService,
    private persistanceService: PersistanceService,
    private viewportScroller: ViewportScroller
  ) {
    this.market = this.route.snapshot.paramMap.get('market');
    this.userPhotoURL = this.loggedIn.user.photoURL;
    this.groupName = this.loggedIn.group.name;
    this.goodsList$ = this.goodsListService.goodsList$;

    this.exceptSoldOut = this.persistanceService.get('exceptSoldOut') || false;

    this.route.paramMap.subscribe(paramMap => {
      this.market = paramMap.get('market');
      this.goodsListService.updateGoodsListFilter(this.getGoodsListFilter());
      this.restoreScrollPosition();
    });
   }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.routeEventSubscription.unsubscribe();
  }

  getGoodsListFilter(): GoodsListFilter {
    return {
      market: this.market,
      exceptSoldOut: this.exceptSoldOut
    };
  }

  protected restoreScrollPosition() {
    this.routeEventSubscription = this.goodsList$.pipe(
      switchMap(() => this.router.events),
      filter(e => e instanceof Scroll),
      tap((e: Scroll) => {
        if (e.position) {
          window.setTimeout(() => this.viewportScroller.scrollToPosition(e.position), 0);
        } else {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      })
    ).subscribe();
  }

  interested(goods: Goods) {
    return goods.interests.findIndex(
      item => this.loggedIn.getUserRef().isEqual(item)
    ) > -1;
  }

  onClickSoldoutFilter($event) {
    this.exceptSoldOut = $event.target.checked;
    this.persistanceService.set('exceptSoldOut', this.exceptSoldOut);
    this.goodsListService.updateGoodsListFilter(this.getGoodsListFilter());
  }

  onClickInterest(goods: Goods) {
    const userRef = this.loggedIn.getUserRef();
    const index = goods.interests.findIndex(item => userRef.isEqual(item));
    const interest = {
      userRef: userRef,
      goodsRef: this.goodsService.getGoodsRef(goods.id)
    };

    if (index === -1) {
      this.interestService.addInterest(interest).subscribe();
      goods.interestCnt =  goods.interestCnt + 1;
      goods.interests.push(userRef);
    } else {
      this.interestService.removeInterest(interest).subscribe();
      goods.interestCnt =  goods.interestCnt - 1;
      goods.interests.splice(index, 1);
    }
  }

  onClickGoods(goods: Goods) {
    this.goodsService.cachedGoods = goods;
  }

  showGoodsBy(market: string) {
    this.router.navigate(['/', market]);
  }

}
