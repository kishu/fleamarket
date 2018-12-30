import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { targetSelectedValidator } from '../target-selected.directive';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { User, Corp, ImageFile } from '../../../shared/models';

enum ImageType {
  FRONT = 'front',
  SIDE = 'side',
  BACK = 'back'
}

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {
  group: Corp;
  writeForm: FormGroup;

  frontImageFiles = new Map<number, ImageFile>();
  sideImageFiles = new Map<number, ImageFile>();
  backImageFiles = new Map<number, ImageFile>();

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

  protected onChangeImage(e: any, imageType: string) {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      const imageFile = new ImageFile(file);

      imageFile.readAsDataURL().then(() => {
        switch (imageType) {
          case ImageType.FRONT:
            this.frontImageFiles.set(Date.now(), imageFile);
            break;
          case ImageType.SIDE:
            this.sideImageFiles.set(Date.now(), imageFile);
            break;
          case ImageType.BACK:
            this.backImageFiles.set(Date.now(), imageFile);
            break;
        }
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
