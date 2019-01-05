import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {forkJoin, merge, Observable, of} from 'rxjs';
import {AuthService, UserService} from '../../core/http';
import {filter, first, map, mapTo, switchMap, tap} from 'rxjs/operators';
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

    const loginUser$ = this.authService.loginUserInfo.pipe(first());

    const authUser$ = merge(
      loginUser$.pipe(
        filter(user => !!user),
        switchMap(user => this.userSerice.getUser(user.uid))
      ),
      loginUser$.pipe(
        filter(user => !user),
        mapTo(null)
      )
    ).pipe(first());

    const viewIntro$ = of(this.persistanceService.get('viewIntro'));

    const join$ = forkJoin(loginUser$, authUser$, viewIntro$);

    return merge(
      join$.pipe(
        filter(([loginUser, authUser, viewIntro]) => !loginUser && !viewIntro),
        tap(_ => this.router.navigate(['intro'])),
        mapTo(false)
      ),
      join$.pipe(
        filter(([loginUser, authUser, viewIntro]) => !loginUser && viewIntro),
        tap(_ => this.router.navigate(['login'])),
        mapTo(false)
      ),
      join$.pipe(
        filter(([loginUser, authUser]) => loginUser && !authUser),
        tap(_ => this.router.navigate(['auth'])),
        mapTo(false)
      ),
      join$.pipe(
        filter(([loginUser, authUser]) => loginUser && authUser),
        mapTo(true)
      )
    );
  }

}
