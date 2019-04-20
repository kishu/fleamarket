import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService, GroupService, UserService, VerificationService } from '@app/core/http';
import { HtmlClassService, SpinnerService } from '@app/shared/services';
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
  displayNameForm: FormGroup;
  socialSignIn = false;

  private verification: Verification;
  private isExistedUser = false;
  private userId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private verificationService: VerificationService,
    private spinnerService: SpinnerService,
    private htmlClassService: HtmlClassService
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
    this.htmlClassService.set('auth-sign-in');
  }

  onClickSignIn(target: string) {
    this.spinnerService.show(true);

    this.auth.signIn(target).then(
      c => {
        this.userService.getUser(c.user.uid)
          .subscribe(u => {
            this.isExistedUser = !!u;
            this.userId = u ? u.id : c.user.uid;
            const displayName = u ? u.displayName : c.user.displayName;
            this.displayNameForm.get('displayName').setValue(displayName);
            this.spinnerService.show(false);
            this.socialSignIn = true;
          });
      },
      err => {
        alert(err.message);
        this.spinnerService.show(false);
      }
    );
  }

  private registerUser() {
    this.spinnerService.show(true);
    const displayName = this.displayNameForm.get('displayName').value;
    const verification = this.verification;

    const user = {
      groupRef: this.verification.groupRef,
      email: verification.email,
      displayName,
      photoURL: environment.defaultPhotoURL,
      notification: {
        goods: true,
        interest: true
      },
      desc: `세컨드마켓 ${displayName}입니다!`
    } as User;

    fromPromise(this.userService.setUser(this.userId, user)).pipe(
      switchMap(() => this.auth.signInUserById(this.userId))
    ).subscribe(() => {
      this.router.navigate(['/group']).then(
        () => this.spinnerService.show(false)
      );
    });
  }

  private updateUser() {
    this.spinnerService.show(true);
    const displayName = this.displayNameForm.get('displayName').value;
    const updatePromise = this.userService.updateDisplayName(this.userId, displayName);

    fromPromise(updatePromise).pipe(
      switchMap(() => this.auth.signInUserById(this.userId))
    ).subscribe(() => {
      this.router.navigate(['/']).then(
        () => this.spinnerService.show(false)
      );
    });
  }

  onSubmitSignIn() {
    this.isExistedUser ?
      this.updateUser() :
      this.registerUser();
  }

}
