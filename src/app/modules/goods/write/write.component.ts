import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Corp } from '../../../shared/models';
import { targetSelectedValidator } from '../target-selected.directive';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {
  group: Corp;
  writeForm: FormGroup;

  private submitting = false;

  get target() { return this.writeForm.get('target'); }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder) {
    const user: User = this.route.snapshot.data.user;
    // TODO
    // corp -> group
    // add group ref to user
    // resolve user and group
    // remove and seprate corp of users
    this.group = user.corp;
    console.log(user);

    this.writeForm = this.fb.group({
      target: this.fb.group({
        group: [ true ],
        lounge: [ false ]
      }, { validators: targetSelectedValidator })
    });
  }

  ngOnInit() {

  }

  protected onSubmit() {
    // if (!this.submitting) {
      this.submitting = true;
      console.log(this.writeForm.get(['target']));
    // }
  }

}
