import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';
import { PreferenceNotificationComponent } from '@app/modules/preference/notification/preference-notification.component';
import { PreferenceUserComponent } from '@app/modules/preference/user/preference-user.component';

const routes: Routes = [
  // {
  //   path: 'preference',
  //   canActivate: [AuthGuard],
  //   children: [
  //     {path: 'notification', component: PreferenceNotificationComponent, outlet: 'popup', data: {animation: 'NotificationPage'} },
  //     {path: 'user', component: PreferenceUserComponent, outlet: 'popup'}
  //   ]
  // }
  {
    path: 'preference/notification',
    canActivate: [AuthGuard],
    component: PreferenceNotificationComponent,
    outlet: 'popup',
    data: { animation: 'NotificationPage' }
  },
  {
    path: 'preference/user',
    canActivate: [AuthGuard],
    component: PreferenceUserComponent,
    outlet: 'popup'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
