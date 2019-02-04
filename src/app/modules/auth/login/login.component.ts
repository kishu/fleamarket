import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, pluck } from 'rxjs/operators';
import { AuthService, UserService } from '@app/core/http';
import { SpinnerService } from '@app/modules/spinner/spinner.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
  }

  onLogin(target: string) {
    this.spinnerService.show(true);
    fromPromise(this.authService.login(target)).pipe(
      pluck('user'),
      switchMap((user: firebase.UserInfo) => this.userService.getUser(user.uid)),
    ).subscribe(this.success, this.error);
  }

  success = (user) => {
    this.ngZone
      .run(() => {
        if (user) {
          this.authService.resolveAuthInfo().subscribe(() => {
            this.router.navigate(['/']);
            this.spinnerService.show(false);
          });
        } else {
          this.router.navigate(['/auth']);
          this.spinnerService.show(false);
        }
      });
  }

  error = (e) => {
    console.error(e);
    alert(e.message);
    this.spinnerService.show(false);
  }

  onLogout() {
    this.authService.logout().then(() => alert('완료'));
  }

}
