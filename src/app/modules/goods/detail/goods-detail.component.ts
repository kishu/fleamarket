import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, zip } from 'rxjs';
import { filter, pluck, switchMap, tap } from 'rxjs/operators';
import { AuthService, CommentService, GoodsService, GoodsListService, InterestService } from '@app/core/http';
import { HtmlClassService, LocationService } from '@app/shared/services';
import { Comment, Goods, Market } from '@app/core/models';

@Component({
  selector: 'app-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {
  authority = false;
  group: string;
  market: string;
  groupName: string;
  moreImages: boolean;
  userDesc: string;
  userDisplayName: string;
  userPhotoURL: string;

  commentForm: FormGroup;
  comments$: Observable<Comment[]>;
  goods: Goods;
  otherGoods$: Observable<Goods[]>;

  private submitting = false;

  get interested() {
    return this.goods.interests.findIndex(
      item => this.auth.getUserRef().isEqual(item)
    ) > -1;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private locationService: LocationService,
    private auth: AuthService,
    private commentService: CommentService,
    private goodsService: GoodsService,
    private goodsListService: GoodsListService,
    private interestService: InterestService,
    private htmlClassService: HtmlClassService
  ) {
    this.market = route.snapshot.paramMap.get('market');
    this.groupName = this.auth.group.name;

    this.commentForm = this.fb.group({
      body: [
        '',
        [ Validators.required,  Validators.minLength(1), Validators.maxLength(501) ]
      ]
    });
  }

  ngOnInit() {
    this.htmlClassService.set('goods-detail');
    const user = this.auth.user;
    this.route.params.pipe(
      pluck('goodsId')
    ).subscribe(() => {
      this.moreImages = false;
      this.goods = this.goodsService.cachedGoods;
      this.otherGoods$ = this.goodsListService.getGoodsListByUser(this.goods.userRef, this.market);
      this.comments$ = this.commentService.getCommentsByGoods(this.goods.id);

      this.authority = (user.id === this.goods.userRef.id);
      this.userDesc = user.desc;
      this.userDisplayName = user.displayName;
      this.userPhotoURL = user.photoURL;

      this.checkAndUpdateGoodsUser();
    });
  }

  checkAndUpdateGoodsUser() {
    const goods = this.goods;
    const user$ = this.goodsService.getGoodsUser(this.goods.userRef);

    zip(user$, of(goods)).pipe(
      filter(([u, g]) => (
        u.displayName !== g.user.displayName ||
        u.desc !== g.user.desc ||
        u.photoURL !== g.user.photoURL
      )),
      tap(([u, g]) => {
        g.user = {
          displayName: u.displayName,
          desc: u.desc,
          photoURL: u.photoURL
        };
      }),
      switchMap(([u, g]) => this.goodsService.updateUser(g.id, u)),
    ).subscribe();
  }

  commentAuthority(comment) {
    return comment.userRef.isEqual(this.auth.getUserRef());
  }

  onMenuChange(menu: string) {
    switch (menu) {
      case 'edit':
        this.router.navigate(['/', this.market, 'goods', this.goods.id, 'edit']);
        break;
      case 'delete':
        const answer = confirm('삭제한 상품은 복구할 수 없습니다. 삭제 할까요?');
        if (answer) {
         this.goodsService.deleteGoods(this.goods.id).then(() => {
          this.router.navigate(['/', this.market]);
         });
        }
        break;
      case 'soldOut':
        this.goodsService.updateSoldOut(this.goods.id, true);
        this.goods.soldOut = true;
        break;
      case 'onSale':
        this.goodsService.updateSoldOut(this.goods.id, false);
        this.goods.soldOut = false;
        break;
    }
  }

  onClickInterest() {
    const goods = this.goods;
    const userRef = this.auth.getUserRef();
    const index = goods.interests.findIndex(item => userRef.isEqual(item));
    const interest = {
      market: this.market,
      userRef: userRef,
      goodsRef: this.goodsService.getGoodsRef(goods.id)
    };

    if (index === -1) {
      this.interestService.addInterest(interest).subscribe();
      goods.interests.push(userRef);
    } else {
      this.interestService.removeInterest(interest).subscribe();
      goods.interests.splice(index, 1);
    }
  }

  onClickMoreImages() {
    this.moreImages = !this.moreImages;
  }

  onClickOtherGoods(goods: Goods) {
    this.goodsService.cachedGoods = goods;
    return false;
  }

  onClickDeleteComment(comment: Comment) {
    const confirm = window.confirm('댓글을 삭제할까요?');
    if (confirm) {
      this.commentService.deleteComment(comment.id)
        .then(() => {
          this.goodsService.decrementCommentCnt(this.goods.id);
        });
    }
  }

  onCommentSubmit() {
    if (!this.submitting) {
      this.submitting = true;

      const comment: Comment = {
        market: this.route.snapshot.paramMap.get('market') as Market,
        userRef: this.auth.getUserRef(),
        goodsRef: this.commentService.getGoodsRef(this.goods.id),
        user: {
          displayName: this.auth.user.displayName,
          photoURL: this.auth.user.photoURL
        },
        body: this.commentForm.get('body').value as string,
        created: this.commentService.getServerTimeStamp(),
        updated: this.commentService.getServerTimeStamp()
      };
      this.commentService.addComment(comment)
        .subscribe(this.successSubmitComment, this.errorSubmitComment);

      this.commentForm.get('body').setValue('');
    }
  }

  protected successSubmitComment = () => {
    this.goodsService.incrementCommentCnt(this.goods.id);
    this.submitting = false;
  }

  protected errorSubmitComment = (e) => {
    console.error(e);
    alert(e);
    this.submitting = false;
  }

  goBack(e: any) {
    e.preventDefault();
    this.locationService.goBack(this.market);
  }

}
