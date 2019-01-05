import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, pluck } from 'rxjs/operators';
import { AuthService, UserService } from '../../../core/http';
import { User } from '../../../shared/models';

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
    private userService: UserService) { }

  ngOnInit() {
  }

  onLogin(target: string) {
    fromPromise(this.authService.login(target)).pipe(
      pluck('user'),
      switchMap((user: User) => this.userService.getUser(user.uid)),
    ).subscribe(this.success, this.error);
  }

  success = (user) => {
    this.ngZone
      .run(() => {
        (user) ?
          this.router.navigate(['/']) :
          this.router.navigate(['auth']);
      });
  }

  error = (e) => {
    console.error(e);
    alert(e.message);
  }

  onLogout() {
    this.authService.logout().then(() => alert('완료'));
  }

}
