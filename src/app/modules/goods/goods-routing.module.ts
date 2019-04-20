import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';
import { GoodsGuard } from '@app/modules/goods/goods.guard';
import { GoodsAuthorityGuard } from '@app/modules/goods/goods-authority.guard';
import { GoodsEditComponent } from '@app/modules/goods/edit/goods-edit.component';
import { GoodsDetailComponent } from '@app/modules/goods/detail/goods-detail.component';

const routes: Routes = [
  {
    path: 'goods/:goodsId',
    canActivate: [AuthGuard, GoodsGuard],
    component: GoodsDetailComponent
  },
  {
    path: 'goods/:goodsId/edit',
    canActivate: [AuthGuard, GoodsAuthorityGuard],
    component: GoodsEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
