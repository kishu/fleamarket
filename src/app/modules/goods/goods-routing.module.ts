import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';
import { GoodsGuard } from '@app/modules/goods/goods.guard';
import { GoodsAuthorityGuard } from '@app/modules/goods/goods-authority-guard.service';
import { EditComponent } from '@app/modules/goods/edit/edit.component';
import { DetailComponent } from '@app/modules/goods/detail/detail.component';

export function goodsDetailMatcher(url: UrlSegment[]) {
  if (url.length === 3 && ( url[0].path === 'group' || url[0].path === 'lounge') &&
    url[1].path === 'goods') {
    return {
      consumed: url,
      posParams: {
        market: url[0],
        goodsId: url[2]
      }
    };
  } else {
    return null;
  }
}

export function goodsEditMatcher(url: UrlSegment[]) {
  if (url.length === 4 && ( url[0].path === 'group' || url[0].path === 'lounge') &&
    url[1].path === 'goods' && url[3].path === 'edit') {
    return {
      consumed: url,
      posParams: {
        market: url[0],
        goodsId: url[2]
      }
    };
  } else {
    return null;
  }
}

const routes: Routes = [
  {
    matcher: goodsDetailMatcher,
    canActivate: [AuthGuard, GoodsGuard],
    component: DetailComponent
  },
  {
    matcher: goodsEditMatcher,
    canActivate: [AuthGuard, GoodsAuthorityGuard],
    component: EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
