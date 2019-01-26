import * as $ from 'jquery';
import 'slick-carousel';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, CommentService, GoodsService } from '../../../core/http';
import { LoggedIn } from '../../../core/logged-in.service';
import { Comment, Goods, Market, User } from '../../../shared/models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  authority = false;
  group: string;
  market: Market;
  userDesc: string;
  userDisplayName: string;
  userPhotoURL: string;

  commentForm: FormGroup;
  comments$: Observable<Comment[]>;
  goods: Goods;
  otherGoods: Goods[];
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

    this.goods = this.goodsService.selectedGoods;
    this.user$ = this.goodsService.getGoodsUser(this.goods.userRef);
    this.otherGoods = this.goodsService.getGoodsByUser(this.goods.userRef.id);
    this.comments$ = this.commentService.getCommentsByGoods(this.goods.id);

    this.authority = (user.id === this.goods.userRef.id);
    this.userDesc = user.desc;
    this.userDisplayName = user.displayName;
    this.userPhotoURL = user.photoURL;

    this.commentForm = this.fb.group({
      body: [
        '',
        [ Validators.required,  Validators.minLength(1), Validators.maxLength(501) ]
      ]
    });


  }

  ngOnInit() {
    $(document).ready(function() {
      $('.single-item').slick({
        arrows: false,
        dots: true
      });
    });
  }

  onMenuChange(menu: string) {
    switch (menu) {
      case 'edit':
        this.router.navigate(['/goods', this.goods.id, 'edit']);
        break;
    }
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
