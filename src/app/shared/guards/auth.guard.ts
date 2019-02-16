import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService, UserService } from '@app/core/http';
import { PersistenceService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private userService: UserService,
    private persistenceService: PersistenceService ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.persistenceService.get('viewIntro')) {
      this.router.navigate(['intro']);
      return false;
    }

    if (!this.auth.user) {
      this.router.navigate(['verification']);
      return false;
    }

    return true;
  }

}
