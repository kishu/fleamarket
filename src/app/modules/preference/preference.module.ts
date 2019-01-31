import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreferenceRoutingModule } from './preference-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { UserComponent } from './user/user.component';

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
