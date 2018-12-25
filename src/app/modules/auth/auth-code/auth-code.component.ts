import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthMailData } from '../../../shared/models';

@Component({
  selector: 'app-auth-code',
  templateUrl: './auth-code.component.html',
  styleUrls: ['./auth-code.component.css']
})
export class AuthCodeComponent implements OnInit {
  @Input() authMailData: AuthMailData;
  @Output() reset = new EventEmitter<string>();
  @Output() submitted = new EventEmitter<null>();
  codeForm: FormGroup;

  private timerVal = 180; // 3min
  private timerInterval: any;
  timeEnd = false;

  constructor(private fb: FormBuilder) {
    this.codeForm = this.fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ]
    });
  }

  get code() {
    return this.codeForm.get('code');
  }

  get timerStr() {
    const currTimerVal = this.timerVal;

    const min = Math.floor(currTimerVal / 60);
    const sec = currTimerVal % 60;

    const minStr = min < 10 ? `0${min}` : min.toString();
    const secStr = sec < 10 ? `0${sec}` : sec.toString();

    return `${minStr}:${secStr}`;
  }

  ngOnInit() {
    this.initTimer();
  }

  initTimer() {
    this.timerInterval = setInterval(() => {
      this.timerVal = this.timerVal - 1;
      if (this.timerVal === 0) {
        clearInterval(this.timerInterval);
        this.timeEnd = true;
      }
    }, 1000);
  }

  onClickRetry(e: any) {
    e.preventDefault();
    this.reset.emit();
  }

  onSubmit() {
    if (this.code.value === this.authMailData.authCode) {
      this.submitted.emit();
    } else {
      alert('인증코드가 맞지 않습니다. 다시 입력해 주세요.');
    }
  }

}
