import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreferenceRoutingModule } from '@app/modules/preference/preference-routing.module';
import { NotificationComponent } from '@app/modules/preference/notification/notification.component';
import { UserComponent } from '@app/modules/preference/user/user.component';

@NgModule({
  declarations: [
    NotificationComponent,
    UserComponent
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
