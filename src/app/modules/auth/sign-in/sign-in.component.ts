import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
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
    private loggedIn: LoggedIn,
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private verificationService: VerificationService,
  ) {
    const token = route.snapshot.queryParamMap.get('token');
    this.verificationService.get(token)
      .subscribe(verification => {
        if (verification) {
          this.verification = verification;
          const created = verification.created as Timestamp;
          const elapsed = (Date.now() - created.toMillis()) / 1000 / 60;

          if (elapsed > 10) {
            this.router.navigate(['/verification']);
          }
        } else {
          this.router.navigate(['/verification']);
        }
      });
  }

  ngOnInit() {
  }

  onClickSignIn(target: string) {
    this.authService.signIn(target).then((result) => {
      const uid = result.user.uid;
      this.userService.getUser(result.user.uid)
        .pipe(
          switchMap(user => {
            const verification = this.verification;
            if (user) {
              return this.userService.updateDisplayName(uid, verification.displayName).then(() => {
                this.loggedIn.subscribe();
                this.loggedIn.userSource.next(user.id);
              });
            } else {
              const newUser = {
                groupRef: verification.groupRef,
                email: verification.email,
                displayName: verification.displayName,
                photoURL: environment.defaultPhotoURL,
                notice: true,
                desc: `세컨드마켓 ${verification.displayName}입니다!`
              } as User;
              return this.userService.setUser(uid, newUser).then(() => {
                this.loggedIn.subscribe();
                this.loggedIn.userSource.next(uid);
              });
            }
          })
        ).subscribe(() => {
          this.router.navigate(['/group']);
      });
    });
  }

}
