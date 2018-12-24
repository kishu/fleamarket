import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { User } from '../models';
import { AuthService, UserService } from '../../core/http';

@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(
    private authService: AuthService,
    private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return Observable.create(observer => {
      this.authService.loginUserInfo.pipe(
        first(),
        switchMap(afUser => {
          return this.userService.getUser(afUser.uid);
        }),
        first()
      ).subscribe(user => {
        observer.next(user);
        observer.complete();
      });
    });
  }

}
