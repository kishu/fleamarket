import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreferenceRoutingModule } from '@app/modules/preference/preference-routing.module';
import { PreferenceNotificationComponent } from '@app/modules/preference/notification/preference-notification.component';
import { PreferenceUserComponent } from '@app/modules/preference/user/preference-user.component';

@NgModule({
  declarations: [
    PreferenceNotificationComponent,
    PreferenceUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PreferenceRoutingModule
  ]
})
export class PreferenceModule { }
