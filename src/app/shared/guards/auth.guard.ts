import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private persistenceService: PersistenceService ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // if (!this.persistenceService.get('viewIntro')) {
    //   this.router.navigate(['intro']);
    //   return false;
    // }

    if (!this.auth.user) {
      this.router.navigate(['verification']);
      return false;
    }

    return true;
  }

}
