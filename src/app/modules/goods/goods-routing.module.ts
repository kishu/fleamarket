import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import { GoodsGuard } from './goods.guard';
import { GoodsAuthorityGuard } from './goods-authority-guard.service';
import { WriteComponent } from './write/write.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
  {
    path: 'markets/:market/goods',
    canActivate: [AuthGuard],
    children: [
      // {path: 'write', component: WriteComponent},
      { path: ':goodsId', canActivate: [ GoodsGuard ], component: DetailComponent },
      { path: ':goodsId/edit', canActivate: [ GoodsAuthorityGuard ], component: EditComponent }
    ]
  }
];

// https://2ndmarket.co/market/webtoons/goods/
// https://2ndmarket.co/market/lounge/goods/

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
