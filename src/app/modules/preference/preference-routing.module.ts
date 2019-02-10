import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';
import { PreferenceNotificationComponent } from '@app/modules/preference/notification/preference-notification.component';
import { PreferenceUserComponent } from '@app/modules/preference/user/preference-user.component';

const routes: Routes = [
  {
    path: 'preference',
    canActivate: [AuthGuard],
    children: [
      {path: 'notification', component: PreferenceNotificationComponent},
      {path: 'user', component: PreferenceUserComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
