import * as $ from 'jquery';
import 'slick-carousel';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, pluck, tap} from 'rxjs/operators';
import { AuthService, CommentService, GoodsService } from '../../../core/http';
import { Comment, Goods, Market, User } from '../../../shared/models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  userDisplayName: string;
  userPhotoURL: string;
  userDesc: string;
  isOwner = false;

  group: string;
  market: Market;
  goods: Goods;
  user$: Observable<User>;
  commentForm: FormGroup;
  submitting = false;
  comments$: Observable<Comment[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private commentService: CommentService,
    private goodsService: GoodsService
  ) {
    const user = this.authService.user;
    const group = this.authService.group;
    this.goods = this.goodsService.selectedGoods;
    this.user$ = this.goodsService.getGoodsUser(this.goods.userRef);

    this.isOwner = (user.id === this.goods.userRef.id);
    this.userDisplayName = user.displayName;
    this.userPhotoURL = user.photoURL;
    this.userDesc = user.desc;

    this.commentForm = this.fb.group({
      body: [
        '',
        [ Validators.required,  Validators.minLength(1), Validators.maxLength(501) ]
      ]
    });

    this.route.params.pipe(
      pluck('market'),
      map((market: string) => market.toUpperCase()),
      tap(market => {
        this.market = <Market>market;
        switch (market) {
          case Market.Group:
            this.group = group.name;
            break;
          case Market.Lounge:
            this.group = '2nd Lounge';
            break;
        }
      })
    ).subscribe();

    this.comments$ = this.commentService.getCommentsByGoods(this.goods.id);
  }

  ngOnInit() {
    $(document).ready(function() {
      $('.single-item').slick({
        arrows: false,
        dots: true
      });
    });
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
