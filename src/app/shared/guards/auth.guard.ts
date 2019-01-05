import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/http';
import { first, map, tap } from 'rxjs/operators';
import { PersistanceService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private persistanceService: PersistanceService ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.loginUserInfo.pipe(
      first(),
      map(user => !!user),
      tap(isAuth => {
        const viewIntro = this.persistanceService.get('viewIntro');
        if (!isAuth && !viewIntro) {
          this.router.navigate(['/intro']);
        } else if (!isAuth && viewIntro) {
          this.router.navigate(['/login']);
        }
      }));
  }

}
