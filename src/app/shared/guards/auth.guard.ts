import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, merge } from 'rxjs';
import { AuthService } from '../../core/http';
import { first, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.loginUserInfo.pipe(
      first(),
      map(user => !!user),
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(
            ['/login'],
            { queryParams: { redirect: state.url }});
        }
      }));
  }

}
