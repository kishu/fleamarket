import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { InterestService, GoodsService } from '@app/core/http';
import { PersistanceService } from '@app/shared/services';
import { Goods } from '@app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userPhotoURL: string;
  groupName: string;
  market: string;
  soldoutFilter: boolean;

  goods$: Observable<Goods[]>;
  private soldoutFilter$: BehaviorSubject<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loggedIn: LoggedIn,
    private interestService: InterestService,
    private goodsService: GoodsService,
    private persistanceService: PersistanceService) {
    this.market = this.route.snapshot.paramMap.get('market');
    this.userPhotoURL = this.loggedIn.user.photoURL;
    this.groupName = this.loggedIn.group.name;

    this.soldoutFilter = this.persistanceService.get('soldoutFilter') || false;
    this.soldoutFilter$ = new BehaviorSubject(this.soldoutFilter);

    this.goods$ = combineLatest(this.route.paramMap, this.soldoutFilter$).pipe(
      switchMap(([paramMap, soldoutFilter]) => {
        this.market = paramMap.get('market');
        if (this.market === 'group') {
          return this.goodsService.getGoodsByGroup(this.loggedIn.user.groupRef, soldoutFilter);
        } else if (this.market === 'lounge') {
          return this.goodsService.getGoodsByLounge(soldoutFilter);
        }
      })
    );
  }

  ngOnInit() {
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
    this.goodsService.selectedGoods = goods;
  }

  showGoods() {
    this.router.navigate(['/']);
  }

  showGoodsByLounge() {
    this.router.navigate(['/lounge']);
  }
}
