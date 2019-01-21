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
    path: 'goods',
    canActivate: [AuthGuard],
    children: [
      {path: 'write', component: WriteComponent},
      {path: 'edit/:goodsId', canActivate: [GoodsAuthorityGuard], component: EditComponent}
    ]
  },
  {
    path: ':market/goods/:goodsId',
    canActivate: [AuthGuard, GoodsGuard],
    component: DetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
