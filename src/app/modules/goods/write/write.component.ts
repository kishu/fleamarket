import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { targetSelectedValidator } from '../target-selected.directive';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { User, Corp, ImageFile } from '../../../shared/models';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {
  group: Corp;
  writeForm: FormGroup;
  imageFiles = new Map();

  private submitting = false;

  get target() { return this.writeForm.get('target'); }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cloudinary: Cloudinary) {
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

  protected onChangeFrontImage(e: any) {
    const files = e.target.files;

    if (files) {
      Array.from(files).forEach(file => {
        const random = Math.floor(Math.random() * 90000) + 10000;
        const imageFile = new ImageFile(file);

        imageFile.readAsDataURL().then(() => {
          this.imageFiles.set(`f${random}`, imageFile);
        });
      });
    }
  }

  protected onSubmit() {
    // if (!this.submitting) {
      this.submitting = true;
      console.log(this.writeForm.get(['target']));
    // }
  }

}
