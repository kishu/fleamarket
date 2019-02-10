import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { LoggedIn } from '@app/core/logged-in.service';
import { UserService } from '@app/core/http';
import { SpinnerService } from '@app/modules/spinner/spinner.service';
import { AuthData, User } from '@app/core/models';
import { environment } from '@environments/environment';

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
    private loggdIn: LoggedIn,
    private userService: UserService,
    private spinnerService: SpinnerService
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
      this.spinnerService.show(true);

      const user: User = {
        groupRef: this.userService.getGroupRef(this.authData.group.id),
        email: this.authData.email,
        displayName: this.nick.value,
        photoURL: environment.defaultPhotoURL,
        notice: true,
        desc: ''
      };

      this.userService.setUser(this.loggdIn.user.id, user).subscribe(this.success, this.error);
    }
  }

  success = () => {
    this.router.navigate(['/']);
    this.spinnerService.show(false);
  }

  error = (e) => {
    console.error(e);
    this.spinnerService.show(false);
    alert(e);
  }

}
