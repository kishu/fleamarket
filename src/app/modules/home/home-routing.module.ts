import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import {LoginInfoResolver} from '../../shared/resolvers';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    resolve: { loginInfo: LoginInfoResolver },
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
