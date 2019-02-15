import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';
import { SignInComponent } from './sign-in/sign-in.component';


const routes: Routes = [
  { path: 'verification', component: VerificationComponent },
  { path: 'signin', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
