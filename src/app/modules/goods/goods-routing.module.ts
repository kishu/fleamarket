import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import { LoginInfoResolver } from '../../shared/resolvers';
import { WriteComponent } from './write/write.component';

const routes: Routes = [
  {
    path: 'goods',
    canActivate: [AuthGuard],
    resolve: {user: LoginInfoResolver},
    children: [
      {path: 'write', component: WriteComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
