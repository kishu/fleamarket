import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AuthService, GroupService, UserService, VerificationService } from '@app/core/http';
import { SpinnerService } from '@app/shared/services';
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
    private auth: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private verificationService: VerificationService,
    private spinnerService: SpinnerService
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
    this.spinnerService.show(true);

    const verification = this.verification;
    const newUser = {
      groupRef: verification.groupRef,
      email: verification.email,
      displayName: verification.displayName,
      photoURL: environment.defaultPhotoURL,
      notice: true,
      desc: `세컨드마켓 ${verification.displayName}입니다!`
    } as User;

    const signIn = (afUser) => {
      const uid = afUser.user.uid;
      this.userService.getUser(uid).pipe(
        map(user => user ? user : newUser),
        switchMap((user: User) =>
          user.id ?
            this.userService.updateDisplayName(user.id, verification.displayName) :
            this.userService.setUser(uid, user)
        )
      ).subscribe(() => {
        this.auth.signInUser$(uid).pipe(first()).subscribe((_) => {
          this.router.navigate(['/group']).then(
            () => this.spinnerService.show(false)
          );
        });
      });
    };

    const error = (err) => {
      alert(err.message);
    };

    this.auth.signIn(target).then(signIn, error);
  }

}
