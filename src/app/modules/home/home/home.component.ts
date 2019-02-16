import {Component, OnInit} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, } from 'rxjs';
import { filter, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SignInService } from '@app/core/sign-in.service';
import { InterestService, GoodsService, GoodsListService } from '@app/core/http';
import { PersistenceService } from '@app/shared/services';
import { Goods } from '@app/core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userPhotoURL: string;
  groupName: string;
  market: string;
  exceptSoldOut: boolean;

  goodsList$: Observable<Goods[]>;
  exceptSoldOut$: BehaviorSubject<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signIn: SignInService,
    private interestService: InterestService,
    private goodsService: GoodsService,
    private goodsListService: GoodsListService,
    private persistenceService: PersistenceService,
    private viewportScroller: ViewportScroller
  ) {
    const exceptSoldOut = this.persistenceService.get('exceptSoldOut') || false;

    this.userPhotoURL = this.signIn.user.photoURL;
    this.groupName = this.signIn.group.name;
    this.market = this.route.snapshot.paramMap.get('market');
    this.exceptSoldOut$ = new BehaviorSubject(exceptSoldOut);

    this.fetchGoodsList();
   }

  ngOnInit() {
  }

  fetchGoodsList() {
    const subject = new BehaviorSubject<Scroll | null>(null);

    this.router.events.pipe(
      filter(e => e instanceof Scroll),
      first(),
      tap((e: Scroll) => subject.next(e))
    ).subscribe();

    this.goodsList$ = combineLatest(this.route.paramMap, this.exceptSoldOut$).pipe(
      tap(([paramMap, exceptSoldOut]) => {
        this.market = paramMap.get('market');
        this.exceptSoldOut = exceptSoldOut;
        this.persistenceService.set('exceptSoldOut', exceptSoldOut);
      }),
      switchMap(() => {
        return this.goodsListService.getGoodsListBy(this.market, this.exceptSoldOut);
      }),
      withLatestFrom(subject),
      tap(([_, e]) => {
        if (e && e.position) {
          this.viewportScroller.scrollToPosition(e.position);
          window.setTimeout(() => this.viewportScroller.scrollToPosition(e.position), 0);
          subject.next(null);
        } else {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      }),
      map(([goodsList]) => goodsList)
    );
  }

  interested(goods: Goods) {
    return goods.interests.findIndex(
      item => this.signIn.getUserRef().isEqual(item)
    ) > -1;
  }

  onClickExceptSoldOut($event) {
    this.exceptSoldOut$.next($event.target.checked);
  }

  onClickInterest(goods: Goods) {
    const userRef = this.signIn.getUserRef();
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
