import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoggedIn } from '../../../core/logged-in.service';
import { InterestService, GoodsService } from '../../../core/http';
import { PersistanceService } from '../../../shared/services';
import { Goods } from '../../../shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  groupName: string;
  list: string;
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

    this.groupName = this.loggedIn.group.name;
    const urlSegments = this.route.snapshot.url;
    this.list = ( urlSegments.length === 0 ) ? 'group' : urlSegments[0].path;

    this.soldoutFilter = this.persistanceService.get('soldoutFilter') || false;
    this.soldoutFilter$ = new BehaviorSubject(this.soldoutFilter);

    this.goods$ = combineLatest(this.route.url, this.soldoutFilter$).pipe(
      switchMap(([url, soldoutFiter]) => {
        if (url.length === 0) {
          this.list = 'group';
          return this.goodsService.getGoodsByGroup(this.loggedIn.user.groupRef, soldoutFiter);
        } else {
          this.list = url[0].path;
          return this.goodsService.getGoodsByLounge(soldoutFiter);
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
