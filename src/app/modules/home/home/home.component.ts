import {Component, OnInit} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { firestore } from 'firebase';
import { BehaviorSubject, Observable, } from 'rxjs';
import { filter, first, map, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService, InterestService, GoodsService, GoodsListService } from '@app/core/http';
import { PersistenceService } from '@app/shared/services';
import { Goods, Interest, Market } from '@app/core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userPhotoURL: string;
  groupName: string;
  market: string;
  exceptSoldOut: boolean;
  goodsList$: Observable<Goods[]>;
  private submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private interestService: InterestService,
    private goodsService: GoodsService,
    private goodsListService: GoodsListService,
    private persistenceService: PersistenceService,
    private viewportScroller: ViewportScroller,
    private goodsList2Service: GoodsListService
  ) {
    this.exceptSoldOut = this.persistenceService.get('exceptSoldOut') || false;
    this.userPhotoURL = this.auth.user.photoURL;
    this.groupName = this.auth.group.name;

    const scroll$ = new BehaviorSubject<Scroll | null>(null);

    this.goodsList$ = this.goodsList2Service.goodsList$.pipe(
      withLatestFrom(scroll$),
      tap(([, e]: [any, Scroll]) => {
        if (e !== null) {
          window.setTimeout(() => {
            this.viewportScroller.scrollToPosition(e.position);
          }, 0);
          scroll$.next(null);
        }
      }),
      map(([goodsList]) => goodsList),
      tap(() => this.submitting = false)
    );

    this.router.events.pipe(
      filter( e => e !== null),
      filter(e => e instanceof Scroll),
      first(),
      filter((e: Scroll) => e.position && e.position[1] > 0),
    ).subscribe((e: Scroll) => scroll$.next(e));

    this.route.paramMap.subscribe(paramMap => {
      this.market = paramMap.get('market');
      goodsList2Service.query$.next({
        market: this.market as Market,
        exceptSoldOut: this.exceptSoldOut
      });
    });
   }

  ngOnInit() {
  }

  interested(goods: Goods) {
    return goods.interests.findIndex(
      item => this.auth.getUserRef().isEqual(item)
    ) > -1;
  }

  onClickExceptSoldOut(checked) {
    if (!this.submitting) {
      this.submitting = true;
      this.exceptSoldOut = checked;
      this.persistenceService.set('exceptSoldOut', checked);
      this.goodsList2Service.query$.next({
        market: this.market as Market,
        exceptSoldOut: checked
      });
    }
  }

  onClickInterest(goods: Goods) {
    const userRef = this.auth.userRef;
    const index = goods.interests.findIndex(user => userRef.isEqual(user));
    const interest: Interest = {
      userRef,
      goodsRef: this.goodsService.getGoodsRef(goods.id),
      market: this.market
    };

    if (index === -1) {
      this.interestService.addInterest(interest).subscribe();
      goods.interests.push(userRef);
    } else {
      this.interestService.removeInterest(interest).subscribe();
      goods.interests.splice(index, 1);
    }
  }

  onClickMore(startAfter: firestore.Timestamp) {
    if (!this.submitting) {
      this.submitting = true;
      this.goodsList2Service.more$.next(startAfter);
    }
  }

  onClickGoods(goods: Goods) {
    this.goodsService.cachedGoods = goods;
  }

  showGoodsBy(market: string) {
    this.router.navigate(['/', market]);
  }

}
