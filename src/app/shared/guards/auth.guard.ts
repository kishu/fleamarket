import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService, UserService } from '../../core/http';
import { PersistanceService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private userSerice: UserService,
    private persistanceService: PersistanceService ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return forkJoin(this.authService.afUser, of(this.authService.user)).pipe(
      switchMap(([afUser, user]) => {
        if (!afUser && !user) {
          const viewIntro = this.persistanceService.get('viewIntro');
          if (!viewIntro) {
            this.router.navigate(['intro']);
          } else if (!afUser) {
            this.router.navigate(['login']);
          } else {
            this.router.navigate(['auth']);
          }
          return of(false);
        } else {
          return of(true);
        }
      })
    );
  }

}
