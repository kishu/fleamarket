import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';
import { IntroComponent } from '@app/modules/home/intro/intro.component';
import { HomeComponent } from '@app/modules/home/home/home.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: HomeComponent, data: {animation: 'HomePage'} },
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
