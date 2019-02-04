import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';
import { NotificationComponent } from '@app/modules/preference/notification/notification.component';
import { UserComponent } from '@app/modules/preference/user/user.component';

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
