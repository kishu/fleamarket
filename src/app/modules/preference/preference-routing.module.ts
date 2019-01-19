import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'preference',
    canActivate: [AuthGuard],
    children: [
      {path: 'user', component: UserComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
