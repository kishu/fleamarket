import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { AuthService, GroupService } from '@app/core/http';
import { SpinnerService } from '@app/modules/spinner/spinner.service';
import { AuthData, Group, GroupType } from '@app/shared/models';

@Component({
  selector: 'app-auth-mail',
  templateUrl: './auth-mail.component.html',
  styleUrls: ['./auth-mail.component.css']
})
export class AuthMailComponent implements OnInit {
  @Output() submitted = new EventEmitter<AuthData>();
  groups$: Observable<Group[]>;
  mailForm: FormGroup;
  private submitting = false;
  private authCode: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private groupService: GroupService,
    private fns: AngularFireFunctions,
    private spinnerService: SpinnerService) {
    this.mailForm = this.fb.group({
      account: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]
      ],
      group: ['', Validators.required]
    });
  }

  get account() {
    return this.mailForm.get('account');
  }

  get group() {
    return this.mailForm.get('group');
  }

  get email() {
    return `${this.account.value}@${this.group.value.domain}`;
  }

  ngOnInit() {
    this.groups$ = this.groupService.getGroupsByType(GroupType.Corp);
    this.authCode = (Math.floor(1000 + Math.random() * 9000)).toString();
  }

  onSubmit() {
    if (!this.submitting) {
      this.spinnerService.show(true);
      this.submitting = true;
      const sendAuthMail = this.fns.httpsCallable('sendAuthMail');

      sendAuthMail({
        to: this.email,
        // todo corpName => groupName
        corpName: this.group.value.name,
        authCode: this.authCode
      }).subscribe(this.success, this.error);
    }
  }

  protected success = () => {
    const authData: AuthData = {
      email: this.email,
      group: this.group.value,
      code:  this.authCode
    };

    this.submitted.emit(authData);

    this.spinnerService.show(false);
    this.submitting = false;

    setTimeout(() => alert('인증 메일을 발송했습니다'), 0);
  }

  protected error = (e) => {
    console.error(e);
    alert(`인증 메일 발송하지 못했습니다.\n${e.message}`);

    this.spinnerService.show(false);
    this.submitting = false;
  }

}
