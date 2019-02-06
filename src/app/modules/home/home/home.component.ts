import {Component, OnDestroy, OnInit} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import {filter, switchMap, tap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { InterestService, GoodsService } from '@app/core/http';
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
  soldoutFilter: boolean;

  goods$: Observable<Goods[]>;
  private soldoutFilter$: BehaviorSubject<boolean>;
  private routeEventSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loggedIn: LoggedIn,
    private interestService: InterestService,
    private goodsService: GoodsService,
    private persistanceService: PersistanceService,
    private viewportScroller: ViewportScroller
  ) {
    this.market = this.route.snapshot.paramMap.get('market');
    this.userPhotoURL = this.loggedIn.user.photoURL;
    this.groupName = this.loggedIn.group.name;

    this.soldoutFilter = this.persistanceService.get('soldoutFilter') || false;
    this.soldoutFilter$ = new BehaviorSubject(this.soldoutFilter);

    this.goods$ = combineLatest(this.route.paramMap, this.soldoutFilter$).pipe(
      tap(([paramMap]) => this.market = paramMap.get('market')),
      switchMap(([paramMap, soldoutFilter]) => {
        if (this.market === 'group') {
          return this.getGoodsByGroup(soldoutFilter);
        } else if (this.market === 'lounge') {
          return this.getGoodsByLounge(soldoutFilter);
        }
      })
    );

    this.restoreScrollPosition();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.routeEventSubscription.unsubscribe();
  }

  protected getGoodsByGroup(soldoutFilter: boolean): Observable<Goods[]> {
    if (this.goodsService.cachedGroupGoodsList) {
      return of(this.goodsService.cachedGroupGoodsList);
    } else {
      return this.goodsService.getGoodsByGroup(
        this.loggedIn.user.groupRef, soldoutFilter
      ).pipe(
        tap(goodsList => this.goodsService.cachedGroupGoodsList = goodsList)
      );
    }
  }

  protected getGoodsByLounge(soldoutFilter: boolean): Observable<Goods[]> {
    if (this.goodsService.cachedLoungeGoodsList) {
      return of(this.goodsService.cachedLoungeGoodsList);
    } else {
      return this.goodsService.getGoodsByLounge(soldoutFilter)
        .pipe(
          tap(goodsList => this.goodsService.cachedLoungeGoodsList = goodsList)
        );
    }
  }

  protected restoreScrollPosition() {
    this.routeEventSubscription = this.goods$.pipe(
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
    const soldoutFilter = $event.target.checked;
    this.persistanceService.set('soldoutFilter', soldoutFilter);
    this.soldoutFilter$.next(soldoutFilter);
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
