import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { firestore } from 'firebase';
import { forkJoin, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { first, map, switchMap } from 'rxjs/operators';
import { LoginInfo } from '../models';
import { AuthService, UserService } from '../../core/http';

@Injectable()
export class LoginInfoResolver implements Resolve<LoginInfo> {
  constructor(
    private authService: AuthService,
    private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<LoginInfo> {
    return Observable.create(observer => {
      this.authService.loginUserInfo.pipe(
        first(),
        switchMap(afUser => {
          return this.userService.getUser(afUser.uid);
        }),
        first(),
        switchMap(user => {
          const groupRef = user.groupRef as firestore.DocumentReference;
          const group$ = fromPromise(groupRef.get()).pipe(
            map(group => ({ id: group.id, ...group.data() }))
          );
          return forkJoin(of(user), group$);
        }),
        first()
      ).subscribe(([user, group]) => {
        observer.next({user, group});
        observer.complete();
      });
    });
  }

}
