import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(target: string) {
    this.authService
      .login(target)
      .then(this.success, this.error);
  }

  success = () => {
    this.ngZone
      .run(() => this.router.navigate(['/auth']))
      .then();
  }

  error = (e) => {
    console.error(e);
    alert(e.message);
  }

  onLogout() {
    this.authService.logout().then(() => alert('완료'));
  }

}
