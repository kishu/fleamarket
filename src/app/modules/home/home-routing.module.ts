import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';
import { HomeComponent } from '@app/modules/home/home/home.component';

export function homeMatcher(url: UrlSegment[]) {
  if (url.length === 1 && (url[0].path === 'group' || url[0].path === 'lounge')) {
    return {
      consumed: url,
      posParams: {
        market: url[0],
      }};
  } else {
    return null;
  }
}

const routes: Routes = [
  {
    matcher: homeMatcher,
    canActivate: [AuthGuard],
    component: HomeComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
