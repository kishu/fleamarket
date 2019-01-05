import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {map, pluck, tap} from 'rxjs/operators';
import { GoodsBy } from '../../../shared/models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  group: string;
  goodsBy: GoodsBy;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const { user, group } = this.route.snapshot.data.loginInfo;
    console.log(group);

    this.route.params.pipe(
      pluck('goodsBy'),
      map((goodsBy: string) => goodsBy.toUpperCase()),
      tap(goodsBy => {
        this.goodsBy = <GoodsBy>goodsBy;
        switch (goodsBy) {
          case GoodsBy.Group:
            this.group = group.name;
            break;
          case GoodsBy.Lounge:
            this.group = '2nd Lounge';
            break;
        }
      })
    ).subscribe();
  }

  ngOnInit() {
  }

}
