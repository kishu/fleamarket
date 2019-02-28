import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, GroupService } from '@app/core/http';
import { AuthRoutingModule } from '@app/modules/auth/auth-routing.module';
import { VerificationComponent } from './verification/verification.component';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [
    VerificationComponent,
    SignInComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  providers: [
    AuthService,
    GroupService
  ]
})
export class AuthModule { }
