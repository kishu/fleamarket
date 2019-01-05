import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import { GoodsGuard } from './goods.guard';
import { GoodsResolver } from './goods.resolver';
import { LoginInfoResolver } from '../../shared/resolvers';
import { WriteComponent } from './write/write.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: 'goods',
    canActivate: [AuthGuard],
    resolve: { loginInfo: LoginInfoResolver },
    children: [
      {path: 'write', component: WriteComponent}
    ]
  },
  {
    path: ':market/goods/:goodsId',
    canActivate: [AuthGuard, GoodsGuard],
    resolve: { loginInfo: LoginInfoResolver, goods: GoodsResolver },
    component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
