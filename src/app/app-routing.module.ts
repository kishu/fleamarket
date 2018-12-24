import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserResolver } from './shared/resolvers';
import { IntroComponent } from './modules/intro/intro.component';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  {
    path: '',
    resolve: { user: UserResolver },
    children: [
      { path: '', component: HomeComponent },
      { path: 'intro', component: IntroComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
