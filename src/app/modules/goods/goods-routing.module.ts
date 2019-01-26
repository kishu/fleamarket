import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import { GoodsGuard } from './goods.guard';
import { GoodsAuthorityGuard } from './goods-authority-guard.service';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: 'goods',
    canActivate: [AuthGuard],
    children: [
      { path: ':goodsId', canActivate: [ GoodsGuard ], component: DetailComponent },
      { path: ':goodsId/edit', canActivate: [ GoodsAuthorityGuard ], component: EditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
