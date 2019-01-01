import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AuthService, GroupService } from '../../core/http';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth/auth.component';
import { AuthMailComponent } from './auth-mail/auth-mail.component';
import { AuthCodeComponent } from './auth-code/auth-code.component';
import { AuthNickComponent } from './auth-nick/auth-nick.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AuthComponent,
    AuthMailComponent,
    AuthCodeComponent,
    AuthNickComponent,
    LoginComponent
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
