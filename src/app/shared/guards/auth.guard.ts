import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AuthService, UserService } from '../../core/http';
import { PersistanceService } from '../services';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authUser: User;
  private viewIntro: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userSerice: UserService,
    private persistanceService: PersistanceService ) {
    this.viewIntro = this.persistanceService.get('viewIntro');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.loginUserInfo.pipe(
      first(),
      switchMap(afUser => {
        let authUser$: Observable<User | any>;
        if (!afUser) {
          authUser$ = of(null);
        } else if (this.authUser) {
          authUser$ = of(this.authUser);
        } else {
          authUser$ = this.userSerice.getUser(afUser.uid);
        }
        return forkJoin( of(afUser), authUser$);
      }),
      map(([afUser, authUser]) => {
        this.authUser = authUser;
        if (!this.viewIntro) {
          this.router.navigate(['intro']);
          return false;
        } else if (!afUser) {
          this.router.navigate(['login']);
          return false;
        } else if (afUser && !authUser) {
          this.router.navigate(['auth']);
          return false;
        } else if (afUser && authUser) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

}
