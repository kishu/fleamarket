import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared/guards';
import { NotificationComponent } from './notification/notification.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'preference',
    canActivate: [AuthGuard],
    children: [
      {path: 'notification', component: NotificationComponent},
      {path: 'user', component: UserComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
