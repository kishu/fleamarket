import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { SignInService } from '@app/core/sign-in.service';
import { AuthService, GroupService, UserService, VerificationService } from '@app/core/http';
import { User, Verification } from '@app/core/models';
import { environment } from '@environments/environment';

import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-signin',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  private verification: Verification;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signIn: SignInService,
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private verificationService: VerificationService,
  ) {
    const token = route.snapshot.queryParamMap.get('token');
    const isValidOf = (v) => {
      const created = v.created as Timestamp;
      const elapsed = (Date.now() - created.toMillis()) / 1000 / 60;
      return of(elapsed <= 10);
    };
    this.verificationService.get(token)
      .pipe(
        tap(v => this.verification = v),
        switchMap(v => v ? isValidOf(v) : of(false)))
      .subscribe(b => !b && this.router.navigate(['/verification']));
  }

  ngOnInit() {
  }

  onClickSignIn(target: string) {
    const verification = this.verification;

    this.authService.signIn(target).then((result) => {
      const uid = result.user.uid;
      const newUser = {
        groupRef: verification.groupRef,
        email: verification.email,
        displayName: verification.displayName,
        photoURL: environment.defaultPhotoURL,
        notice: true,
        desc: `세컨드마켓 ${verification.displayName}입니다!`
      } as User;

      this.userService.getUser(uid).pipe(
        map(user => user ? user : newUser),
        switchMap((user: User) =>
          user.id ?
            this.userService.updateDisplayName(user.id, verification.displayName) :
            this.userService.setUser(uid, user)
        )
      ).subscribe(() => {
        this.signIn.user$(uid).pipe(first()).subscribe((_) => {
          this.router.navigate(['/group']);
        });
      });
    });
  }

}
