import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroComponent } from '@app/modules/home/intro/intro.component';

const routes: Routes = [
  { path: '',  redirectTo: '/group', pathMatch: 'full' },
  { path: 'intro', component: IntroComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
