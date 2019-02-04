import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from '@app/modules/auth/auth/auth.component';
import { LoginComponent } from '@app/modules/auth/login/login.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
