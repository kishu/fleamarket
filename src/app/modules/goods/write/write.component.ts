import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { targetSelectedValidator } from '../target-selected-validator.directive';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { User, Corp, ImageFile } from '../../../shared/models';

enum ImageType {
  FRONT = 'front',
  SIDE = 'side',
  BACK = 'back'
}

enum CategoryType {
  CATEGORY = 'category',
  RECENT = 'recent'
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
  get title() { return this.writeForm.get('title'); }
  get desc() { return this.writeForm.get('desc'); }
  get price() { return this.writeForm.get('price'); }

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
      }, { validators: targetSelectedValidator }),
      categories: this.fb.group({
        category: ['가전/디지털'],
        recent: ['']
      }, { validators: Validators.required }),
      purchase: ['알 수 없음', Validators.required],
      condition: ['미개봉', Validators.required],
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(31)
        ]
      ],
      desc: [
        '',
        [
          Validators.required,
          Validators.maxLength(201)
        ]
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.maxLength(10)
        ]
      ]
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

  protected onChangeCategory(type: CategoryType) {
    const categories = this.writeForm.get('categories');
    const category = categories.get('category');
    const recent = categories.get('recent');

    switch (type) {
      case CategoryType.CATEGORY:
        recent.setValue('');
        break;
      case CategoryType.RECENT:
        category.setValue('');
        break;
    }
  }

  protected onSubmit() {
    // if (!this.submitting) {
      this.submitting = true;
      console.log(this.writeForm.get(['target']));
    // }
  }
}
