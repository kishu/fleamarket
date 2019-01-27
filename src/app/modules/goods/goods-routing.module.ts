import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import { GoodsGuard } from './goods.guard';
import { GoodsAuthorityGuard } from './goods-authority-guard.service';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';

export function goodsMatcher(url: UrlSegment[]) {
  if ((url.length === 3 || url.length === 4) &&
    ( url[0].path === 'group' || url[0].path === 'lounge') &&
    url[1].path === 'goods') {

    let consumedUrl;
    if (url.length === 4) {
      consumedUrl = url.slice(0, 3);
    } else {
      consumedUrl = url;
    }

    return {
      consumed: consumedUrl,
      posParams: {
        list: url[0],
        goodsId: url[2]
      }
    };
  } else {
    return null;
  }
}

const routes: Routes = [
  {
    matcher: goodsMatcher,
    canActivate: [AuthGuard, GoodsGuard],
    children: [
      { path: '', component: DetailComponent },
      { path: 'edit', canActivate: [ GoodsAuthorityGuard ], component: EditComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
