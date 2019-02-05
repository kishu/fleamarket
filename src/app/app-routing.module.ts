import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroComponent } from '@app/modules/intro/intro.component';
import { HomeComponent } from '@app/modules/home/home/home.component';

const routes: Routes = [
  { path: '',  redirectTo: '/group', pathMatch: 'full' },
  // { path: '', component: HomeComponent, data: { market: 'group' } },
  { path: 'intro', component: IntroComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true
      // scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
