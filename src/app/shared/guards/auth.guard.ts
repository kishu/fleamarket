import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { AuthService, UserService } from '@app/core/http';
import { PersistanceService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private loggedIn: LoggedIn,
    private authService: AuthService,
    private userService: UserService,
    private persistanceService: PersistanceService ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return forkJoin(this.authService.afUser, of(this.loggedIn.user)).pipe(
      switchMap(([afUser, user]) => {
        // 인트로를 안본 경우 -> 무조건
        const viewIntro = this.persistanceService.get('viewIntro');

        if (!viewIntro) {
          this.router.navigate(['intro']);
          return of(false);
        }

        if (!afUser && !user) {
          this.router.navigate(['login']);
          return of(false);
        }

        if (afUser && !user) {
          this.router.navigate(['auth']);
          return of(false);
        }

        return of(true);
      })
    );
  }

}
