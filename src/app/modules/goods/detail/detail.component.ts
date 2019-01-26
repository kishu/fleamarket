import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { AuthService, CommentService, GoodsService } from '../../../core/http';
import { LoggedIn } from '../../../core/logged-in.service';
import { Comment, Goods, User } from '../../../shared/models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  authority = false;
  group: string;
  list: string;
  moreImages: boolean;
  userDesc: string;
  userDisplayName: string;
  userPhotoURL: string;

  commentForm: FormGroup;
  comments$: Observable<Comment[]>;
  goods: Goods;
  otherGoods$: Observable<Goods[]>;
  user$: Observable<User>;

  private submitting = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loggedIn: LoggedIn,
    private authService: AuthService,
    private commentService: CommentService,
    private goodsService: GoodsService
  ) {
    const user = this.loggedIn.user;
    this.list = route.snapshot.paramMap.get('list');

    this.route.params.pipe(
      pluck('goodsId')
    ).subscribe(() => {
      this.moreImages = false;
      this.goods = this.goodsService.selectedGoods;
      this.user$ = this.goodsService.getGoodsUser(this.goods.userRef);
      this.otherGoods$ = this.goodsService.getGoodsByUser(this.goods.userRef, this.list);
      this.comments$ = this.commentService.getCommentsByGoods(this.goods.id);

      this.authority = (user.id === this.goods.userRef.id);
      this.userDesc = user.desc;
      this.userDisplayName = user.displayName;
      this.userPhotoURL = user.photoURL;
    });

    this.commentForm = this.fb.group({
      body: [
        '',
        [ Validators.required,  Validators.minLength(1), Validators.maxLength(501) ]
      ]
    });
  }

  ngOnInit() {
  }

  onMenuChange(menu: string) {
    switch (menu) {
      case 'edit':
        this.router.navigate(['/goods', this.goods.id, 'edit']);
        break;
    }
  }

  onClickMoreImages() {
    this.moreImages = true;
  }

  onClickOtherGoods(goods: Goods) {
    this.goodsService.selectedGoods = goods;
    return false;
  }

  onCommentSubmit() {
    if (!this.submitting) {
      this.submitting = true;

      const comment: Comment = {
        userRef: this.commentService.getUserRef(this.authService.user.id),
        goodsRef: this.commentService.getGoodsRef(this.goods.id),
        parentRef: null,
        user: {
          displayName: this.authService.user.displayName,
          photoURL: this.authService.user.photoURL
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

}
