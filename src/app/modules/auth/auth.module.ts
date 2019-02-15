import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AuthService, GroupService } from '@app/core/http';
import { AuthRoutingModule } from '@app/modules/auth/auth-routing.module';
// import { AuthComponent } from '@app/modules/auth/auth/auth.component';
// import { AuthMailComponent } from '@app/modules/auth/auth-mail/auth-mail.component';
// import { AuthCodeComponent } from '@app/modules/auth/auth-code/auth-code.component';
// import { AuthNickComponent } from '@app/modules/auth/auth-nick/auth-nick.component';
import { VerificationComponent } from './verification/verification.component';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [
    // AuthComponent,
    // AuthMailComponent,
    // AuthCodeComponent,
    // AuthNickComponent,
    VerificationComponent,
    SignInComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireFunctionsModule,
    AuthRoutingModule
  ],
  providers: [
    AuthService,
    GroupService
  ]
})
export class AuthModule { }
