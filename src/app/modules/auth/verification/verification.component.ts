import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { AuthService, GroupService, UserService, VerificationService } from '@app/core/http';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { Group, GroupType, Verification } from '@app/core/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FirebaseUtilService } from '@app/shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit, OnDestroy {
  private static TIME_LIMIT = 180;

  groups$: Observable<Group[]>;
  mailForm: FormGroup;
  codeForm: FormGroup;
  mailSent = false;
  remainTime: number;

  private timerInterval: any;

  private submitting = false;
  private verificationCode: string;
  private token: string;

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private fns: AngularFireFunctions,
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService,
    private userService: UserService,
    private verificationSerice: VerificationService,
    private spinnerService: SpinnerService
  ) {
    this.remainTime = VerificationComponent.TIME_LIMIT;
    this.mailForm = this.fb.group({
      account: '',
      group: undefined,
      displayName: ''
    });

    this.codeForm = this.fb.group({
      code:  ''
    });
  }

  get timerStr() {
    const currRemainTime = this.remainTime;

    const min = Math.floor(currRemainTime / 60);
    const sec = currRemainTime % 60;

    const minStr = min < 10 ? `0${min}` : min.toString();
    const secStr = sec < 10 ? `0${sec}` : sec.toString();

    return `${minStr}:${secStr}`;
  }

  ngOnInit() {
    this.groups$ = this.groupService.getGroupsByType(GroupType.Corp);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.timerInterval);
  }

  protected startLimitTimer() {
    window.clearInterval(this.timerInterval);
    this.remainTime = VerificationComponent.TIME_LIMIT;

    this.timerInterval = window.setInterval(() => {
      this.remainTime = this.remainTime - 1;
      if (this.remainTime === 0) {
        window.clearInterval(this.timerInterval);
        this.codeForm.get('code').disable();
      }
    }, 1000);
  }

  onClickReSendMail(e: any) {
    e.preventDefault();
    clearInterval(this.timerInterval);
    this.mailSent = false;
  }

  onSubmitSendMail() {
    if (!this.submitting) {
      this.submitting = true;
      this.spinnerService.show(true);

      this.verificationCode = (Math.floor(1000 + Math.random() * 9000)).toString();

      const account = this.mailForm.get('account').value;
      const displayName = this.mailForm.get('displayName').value;
      const group = this.mailForm.get('group').value;
      const email = `${account}@${group.domain}`;

      const sendMail = this.fns.httpsCallable('sendVerificationMail');
      const sendMail$ = sendMail({
        to: email,
        groupName: this.mailForm.get('group').value.name,
        authCode: this.verificationCode
      });

      const verification = {
        groupRef: this.groupService.getRef(group.id),
        displayName,
        email,
        created: FirebaseUtilService.getServerTimeStamp()
      } as Verification;
      const verification$ = this.verificationSerice.add(verification);

      // return sendMail$.pipe(
      return zip(of(true), verification$)
        .subscribe(([, ref]) => {
          this.submitting = false;
          this.token = ref.id;
          console.log(this.verificationCode, this.token);
          alert('인증 메일을 발송했습니다');

          this.mailSent = true;
          this.startLimitTimer();
          this.spinnerService.show(false);
        },
        (err) => {
          alert(err.message);
          this.spinnerService.show(false);
        }
      );
    }
  }

  onSubmitVerificationCode() {
    const code = this.codeForm.get('code').value;
    if ( code === this.verificationCode) {
      clearInterval(this.timerInterval);
      this.router.navigate(['/signin'], { queryParams: { token: this.token } });
    } else {
      alert('인증코드가 맞지 않습니다. 다시 입력해 주세요.');
    }
  }

  onClickSignOut() {
    this.authService.signOut().then(
      () => this.router.navigate(['/'])
    );
  }

}
