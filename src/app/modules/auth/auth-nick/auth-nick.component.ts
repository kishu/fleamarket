import {Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { AuthService, UserService } from '../../../core/http';
import { AuthData, User } from '../../../shared/models';

@Component({
  selector: 'app-auth-nick',
  templateUrl: './auth-nick.component.html',
  styleUrls: ['./auth-nick.component.css']
})
export class AuthNickComponent implements OnInit {
  @Input() authData: AuthData;
  nickForm: FormGroup;
  private submitting = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.nickForm = this.fb.group({
      nick: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(16)
        ]
      ]
    });
  }

  get nick() {
    return this.nickForm.get('nick');
  }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.submitting) {
      this.submitting = true;

      this.authService.loginUserInfo.pipe(
        switchMap(afUser => {
          const user: User = {
            email: this.authData.email,
            displayName: this.nick.value,
            photoURL: afUser.photoURL,
            corp: {
              domain: this.authData.group.domain,
              displayName: this.authData.group.name
            }
          };
          return this.userService.addUser(afUser.uid, user);
        })
      ).subscribe(this.success, this.error);

      // this.authService.loginUserInfo.pipe(
      //   switchMap(userInfo => {
      //     return concat(
      //       // this.authService.updateDisplayName(this.nick.value),
      //       this.userService.addUser(userInfo.uid, user)
      //     );
      //   })
      // )
    }
  }

  success = () => {
    this.router.navigate(['/']);
  }

  error = (e) => {
    console.error(e);
    alert(e);
  }

}
