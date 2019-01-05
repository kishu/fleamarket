import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
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
    path: ':market/goods/:id',
    canActivate: [AuthGuard],
    resolve: { loginInfo: LoginInfoResolver },
    component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
