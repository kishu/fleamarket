import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AuthService, GroupService, UserService, VerificationService } from '@app/core/http';
import { SpinnerService } from '@app/shared/services';
import { User, Verification } from '@app/core/models';
import { environment } from '@environments/environment';

import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-signin',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  private verification: Verification;
  displayNameForm: FormGroup;

  private user: User;
  private socialSignIn = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private verificationService: VerificationService,
    private spinnerService: SpinnerService
  ) {
    this.displayNameForm = this.fb.group({
      displayName: ''
    });

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

    const createNewUser = (displayName) => ({
      groupRef: verification.groupRef,
      email: verification.email,
      displayName,
      photoURL: environment.defaultPhotoURL,
      notice: true,
      desc: `세컨드마켓 ${displayName}입니다!`
    } as User);

    const signIn = (afUser) => {
      this.socialSignIn = true;
      const uid = afUser.user.uid;
      this.userService.getUser(uid)
        .subscribe((user: User) => {
          if (user) {
            this.user = user;
            this.displayNameForm.get('displayName').setValue(user.displayName);
          } else {
            this.user = createNewUser(afUser.user.displayName);
            this.displayNameForm.get('displayName').setValue(afUser.user.displayName);
          }
          this.spinnerService.show(false);
        });
    };

    const error = (err) => {
      alert(err.message);
      this.spinnerService.show(false);
    };

    this.auth.signIn(target).then(signIn, error);
  }

  onSubmitSignIn() {
    this.spinnerService.show(true);
    const displayName = this.displayNameForm.get('displayName').value
    const user = this.user = Object.assign(this.user, { displayName });
    this.userService.setUser(this.user.id, user).then(
      () => {
        this.auth.signInUser$(this.user.id).pipe(first()).subscribe((_) => {
          this.router.navigate(['/group']).then(
            () => this.spinnerService.show(false)
          );
        });
      },
      (err) => {
        alert(err);
        this.spinnerService.show(false);
      }
    );
  }

}
