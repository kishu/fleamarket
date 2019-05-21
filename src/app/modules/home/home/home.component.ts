import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { AuthService, InterestService, GoodsService, GoodsListService, NotificationService } from '@app/core/http';
import { HtmlClassService, PersistenceService } from '@app/shared/services';
import { Goods, Interest } from '@app/core/models';
import DocumentReference = firebase.firestore.DocumentReference;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('expand', [
      state('true', style({
        'transform': 'scale(1) translateY(0)'
       })),
      state('false', style({  })),
      transition('false => true', animate(200))
    ]),
    trigger('fadeOut', [
      state('true', style({
        'opacity': 0
       })),
      state('false', style({  })),
      transition('false => true', animate(200))
    ]),
    trigger('fadeIn', [
      state('true', style({
        'opacity': 1
       })),
      state('false', style({
        'opacity': 0
       })),
      transition('false => true', animate(200))
    ]),
    trigger('slideOut', [
      state('true', style({
        'transform': 'translateY(200%)'
       })),
      state('false', style({  })),
      transition('false => true', animate(200))
    ])
  ]
})
export class HomeComponent implements OnInit {
  @ViewChild('observer') observer: ElementRef;

  offset: any = {
    left: 0,
    right: 0,
    top: 0
  };
  selectedGoods: Goods;
  expand: boolean;
  userPhotoURL: string;
  groupRef: DocumentReference;
  groupName: string;
  market: string;
  filterSoldOut: boolean;
  goodsList$: Observable<Goods[]>;
  lastGoods: Goods;
  private limit = 20;
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
    private notificationService: NotificationService,
  ) {
    this.filterSoldOut = this.persistenceService.get('filterSoldOut') || false;
    this.userPhotoURL = this.auth.user.photoURL;
    this.groupName = this.auth.group.name;
    this.groupRef = this.auth.user.groupRef;

    const scroll$ = new Subject<Scroll | null>();
    const fetch$ = new Subject();

    this.goodsList$ = this.goodsListService.goodsList$.pipe(
      filter(g => g !== null),
      tap(g => this.lastGoods = g[g.length - 1]),
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

    let isLeaving = false;
    const config = {
      rootMargin: '0px 0px 1500px 0px'
    };
    const iObserver = new IntersectionObserver(entries => {
      const observer = entries[0];
      if (isLeaving && observer.isIntersecting) {
        this.getGoodsList(this.lastGoods.updated as Timestamp, true);
        isLeaving = false;
      } else {
        isLeaving = true;
      }
    }, config);

    iObserver.observe(this.observer.nativeElement);
  }

  getGoodsList(startAfter: Timestamp, scan: boolean) {
    this.goodsListService.more({
      groupRef: this.auth.user.groupRef,
      startAfter,
      limit: this.limit,
      filterSoldOut: this.filterSoldOut,
      scan
    });
  }

  interested(goods: Goods) {
    return goods.interests.findIndex(
      item => this.auth.getUserRef().isEqual(item)
    ) > -1;
  }

  onClickToggleFilterSoldOut() {
    this.filterSoldOut = !this.filterSoldOut;
    this.getGoodsList(Timestamp.now(), false);
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

  onClickGoods(goods: Goods) {
    this.goodsService.cachedGoods = goods;
  }

  onClickNotification(e: Event) {
    e.preventDefault();
    this.router.navigate(
      [{outlets: {popup: ['preference', 'notification']}}],
      { skipLocationChange: true }
    );
  }

  onClickPreference(e: Event) {
    e.preventDefault();
    this.router.navigate(
      [{outlets: {popup: ['preference', 'user']}}],
      { skipLocationChange: true }
    );
  }

  onExpand(goods: Goods, e: Event) {
    const _offset = (e.target as HTMLInputElement).getBoundingClientRect();
    this.selectedGoods = goods;
    this.offset = {
      left: _offset.left,
      right: _offset.left,
      top: (_offset.top - 48) / _offset.height * 100,
      scale: _offset.width / (document.body as HTMLInputElement).clientWidth,
      imageUrl: goods.images[0] || 'assets/img/noimage.jpg'
    };
    this.expand = !this.expand;
  }

  goDetail(goods: Goods) {
    if (goods) {
      this.router.navigate(['/goods', goods.id]);
    }
  }
}
