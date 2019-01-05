import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {map, pluck, tap} from 'rxjs/operators';
import { Market } from '../../../shared/models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  group: string;
  market: Market;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const { user, group } = this.route.snapshot.data.loginInfo;

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
  }

  ngOnInit() {
  }

}
