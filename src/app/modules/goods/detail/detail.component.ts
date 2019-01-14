import * as $ from 'jquery';
import 'slick-carousel';

import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, pluck, tap} from 'rxjs/operators';
import { AuthService, CommentService, GoodsService } from '../../../core/http';
import { Comment, CommentWrite, Goods, Market, User } from '../../../shared/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  group: string;
  market: Market;
  goods: Goods;
  imageURL = environment.cloudinary.imageURL;
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
    this.commentForm = this.fb.group({
      body: [
        '',
        [ Validators.required,  Validators.minLength(1), Validators.maxLength(501) ]
      ]
    });

    const group = this.authService.group;
    this.goods = this.goodsService.selectedGoods;
    this.user$ = this.goodsService.getGoodsUser(this.goods.userRef);

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

      const comment: CommentWrite = {
        userId: this.authService.user.id,
        goodsId: this.goods.id,
        parentId: null,
        displayName: this.authService.user.displayName,
        body: this.commentForm.get('body').value
      };
      this.commentService.addComment(comment)
        .subscribe(this.successSubmitComment, this.errorSubmitComment);

      this.commentForm.get('body').setValue('');
    }
  }

  protected successSubmitComment = () => {
    this.submitting = false;
  }

  protected errorSubmitComment = (e) => {
    console.error(e);
    alert(e);
    this.submitting = false;
  }

}
