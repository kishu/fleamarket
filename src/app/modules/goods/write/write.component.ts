import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, merge } from 'rxjs';
import { targetSelectedValidator } from '../target-selected-validator.directive';
import { FileUploadService } from '../file-upload.service';
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
  get title() { return this.writeForm.get('title'); }
  get desc() { return this.writeForm.get('desc'); }
  get price() { return this.writeForm.get('price'); }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fileUploadeService: FileUploadService) {
    const user: User = this.route.snapshot.data.user;
    // TODO
    // corp -> group
    // add group ref to user
    // resolve user and group
    // remove and seprate corp of users
    this.group = user.corp;
    console.log(user);

    this.buildWriteForm();
  }

  ngOnInit() {

  }

  protected buildWriteForm() {
    this.writeForm = this.fb.group({
      target: this.fb.group({
        group: true,
        lounge: false
      }, { validators: targetSelectedValidator }),
      category: this.fb.group({
        category: '가전/디지털',
        recent: ''
      }, { validators: Validators.required }),
      purchase: ['알 수 없음', Validators.required],
      condition: ['미개봉', Validators.required],
      title: [
        '',
        [ Validators.required,  Validators.maxLength(31) ]
      ],
      desc: [
        '',
        [ Validators.required,  Validators.maxLength(201) ]
      ],
      price: [
        '',
        [ Validators.required, Validators.maxLength(10) ]
      ],
      delivery: this.fb.group({
        delivery: '직거래',
        etc: [
          '',
          Validators.maxLength(51)
        ]
      }, { validators: Validators.required }),
      contact: [
        '',
        Validators.maxLength(51)
      ],
      donation: [
        '0',
        Validators.required
      ]
    });

    this.writeForm.get('category.category')
      .valueChanges.subscribe(() => {
        this.writeForm.get('category.recent')
          .setValue('', { emitEvent: false });
    });

    this.writeForm.get('category.recent')
      .valueChanges.subscribe(() => {
        this.writeForm.get('category.category')
          .setValue('', { emitEvent: false });
    });

    this.writeForm.get('delivery.delivery')
      .valueChanges.subscribe(() => {
        this.writeForm.get('delivery.etc')
          .setValue('', { emitEvent: false });
    });

    this.writeForm.get('delivery.etc')
      .valueChanges.subscribe(() => {
        this.writeForm.get('delivery.delivery')
        .setValue('', { emitEvent: false });
    });
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
    if (!this.submitting) {
      // this.submitting = true;

      const form = this.writeForm;
      const goods = {
        group: form.get('target.group').value,
        lounge: form.get('target.lounge').value,
        category:
          form.get('category.category').value ||
          form.get('category.recent').value,
        purchase: form.get('purchase').value,
        condition: form.get('condition').value,
        title: form.get('title').value,
        desc: form.get('desc').value,
        price: form.get('price').value,
        delivery:
          form.get('delivery.delivery').value ||
          form.get('delivery.etc').value,
        contact: form.get('contact').value,
        donation: form.get('donation').value
      };

      console.log(goods);
    }
  }

  protected test() {
    const files = [];

    this.frontImageFiles.forEach(imageFile => {
      files.push(imageFile.file);
    });

    const progress$ = [];
    const response$ = [];
    const statusList = this.fileUploadeService.upload(files);

    for (const key of Object.keys(statusList)) {
      progress$.push(statusList[key].progress);
      response$.push(statusList[key].response);
    }

    merge(progress$).pipe().subscribe(result => {
      result.subscribe(r => console.log('progress$', r));
    });

    forkJoin(response$).subscribe(result => {
      console.log('response$', result);
    });
  }

}
