import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { Corp } from '../../../shared/models';
import { AuthMailData } from '../../../shared/models';
import { AuthService, CorpService } from '../../../core/http';

@Component({
  selector: 'app-auth-mail',
  templateUrl: './auth-mail.component.html',
  styleUrls: ['./auth-mail.component.css']
})
export class AuthMailComponent implements OnInit {
  @Output() submitted = new EventEmitter<AuthMailData>();
  corps$: Observable<Corp[]>;
  mailForm: FormGroup;
  private submitting = false;
  private authCode: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private corpService: CorpService,
    private fns: AngularFireFunctions) {
    this.mailForm = this.fb.group({
      account: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30)
        ]
      ],
      corp: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  get account() {
    return this.mailForm.get('account');
  }

  get corp() {
    return this.mailForm.get('corp');
  }

  get email() {
    return `${this.account.value}@${this.corp.value.domain}`;
  }

  ngOnInit() {
    this.corps$ = this.corpService.getCorps();
    this.authCode = (Math.floor(1000 + Math.random() * 9000)).toString();
  }

  onSubmit() {
    if (!this.submitting) {
      this.submitting = true;
      const sendAuthMail = this.fns.httpsCallable('sendAuthMail');

      sendAuthMail({
        to: this.email,
        corpName: this.corp.value.displayName,
        authCode: this.authCode
      }).subscribe(this.success, this.error);
    }
  }

  protected success = () => {
    this.submitting = false;
    const authMailData: AuthMailData = {
      email: this.email,
      corp: {
        domain: this.corp.value.domain,
        displayName: this.corp.value.displayName
      },
      authCode:  this.authCode
    };
    this.submitted.emit(authMailData);
    alert('인증 메일을 발송했습니다');
  }

  protected error = (e) => {
    console.error(e);
    alert(`인증 메일 발송하지 못했습니다.\n${e.message}`);
    this.submitting = false;
  }

}
