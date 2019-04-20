import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { firestore } from 'firebase';
import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { AuthService, InterestService, GoodsService, GoodsListService } from '@app/core/http';
import { GlobalToggleService, HtmlClassService, PersistenceService } from '@app/shared/services';
import { Goods, Interest } from '@app/core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userPhotoURL: string;
  groupName: string;
  market: string;
  sortOption: boolean;
  exceptSoldOut: boolean;
  goodsList$: Observable<Goods[]>;
  private limit = 30;
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
    private htmlClassService: HtmlClassService,
    private globalToggleService: GlobalToggleService
  ) {
    this.exceptSoldOut = this.persistenceService.get('exceptSoldOut') || false;
    this.userPhotoURL = this.auth.user.photoURL;
    this.groupName = this.auth.group.name;

    const scroll$ = new Subject<Scroll | null>();
    const fetch$ = new Subject();

    this.goodsList$ = this.goodsListService.goodsList$.pipe(
      filter(g => g !== null),
      tap(() => this.submitting = false),
      tap(() => fetch$.next())
    );

    combineLatest(fetch$, scroll$).pipe(
      tap(([, s]) => {
        window.setTimeout(() => {
          this.viewportScroller.scrollToPosition(s.position);
        }, 0);
      })
    ).subscribe();

    if (!this.goodsListService.cached) {
      this.getGoodsList(Timestamp.now(), true);
    }

    this.router.events.pipe(
      filter( e => e !== null),
      filter(e => e instanceof Scroll),
      first(),
      filter((e: Scroll) => e.position && e.position[1] > 0),
    ).subscribe((e: Scroll) => scroll$.next(e));
   }

  ngOnInit() {
    this.htmlClassService.set('home');
  }

  getGoodsList(startAfter: Timestamp, scan: boolean) {
    this.goodsListService.more({
      groupRef: this.auth.user.groupRef,
      startAfter,
      limit: this.limit,
      scan
    });
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
    }
    this.sortOption = false;
  }

  onClickInterest(goods: Goods) {
    const userRef = this.auth.userRef;
    const index = goods.interests.findIndex(user => userRef.isEqual(user));
    const interest: Interest = {
      userRef,
      goodsRef: this.goodsService.getGoodsRef(goods.id),
      // market: this.market
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
      this.getGoodsList(startAfter, true);
    }
  }

  onClickGoods(goods: Goods) {
    this.goodsService.cachedGoods = goods;
  }

  showGoodsBy(market: string) {
    this.router.navigate(['/', market]);
  }

  onClickNotification() {
    this.globalToggleService.notification$.next();
  }

  onClickPreference() {
    this.globalToggleService.preference$.next();
  }

}
