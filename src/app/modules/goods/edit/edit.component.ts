import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoggedIn } from '../../../core/logged-in.service';
import { FileUploadService, GoodsService } from '../../../core/http';
import { SpinnerService } from '../../spinner/spinner.service';
import { targetSelectedValidator } from '../target-selected-validator.directive';
import { Goods, ImageFile } from '../../../shared/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  private submitting = false;
  private readonly uploadPreset = environment.cloudinary.preset.goods;
  private goods: Goods;

  action: string;
  back: string;
  groupName: string;

  editForm: FormGroup;
  imageFiles = new Map<number, ImageFile>();

  get market() { return this.editForm.get('market'); }
  get title() { return this.editForm.get('title'); }
  get desc() { return this.editForm.get('desc'); }
  get price() { return this.editForm.get('price'); }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loggedIn: LoggedIn,
    private goodsService: GoodsService,
    private fileUploadService: FileUploadService,
    private spinnerService: SpinnerService
  ) {
    const goodsId = this.route.snapshot.params['goodsId'];
    this.action = goodsId === 'new' ? '등록' : '수정';
    this.back = goodsId === 'new' ? this.loggedIn.group.name : '돌아가기';
    this.groupName = this.loggedIn.group.name;
    this.goods = goodsId === 'new' ?
      this.goodsService.getNewGoods() :
      this.goodsService.getSelectedGoods();
    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm() {
    const goods = this.goods;
    this.editForm = this.fb.group({
      market: this.fb.group({
        group: goods.market.group,
        lounge: goods.market.lounge,
      }, { validators: targetSelectedValidator }),
      category: this.fb.group({
        category: goods.category,
        recent: ''
      }, { validators: Validators.required }),
      purchase: [ goods.purchase, Validators.required ],
      condition: [ goods.condition, Validators.required ],
      title: [ goods.title, [ Validators.required,  Validators.maxLength(31) ] ],
      desc: [ goods.desc, [ Validators.required,  Validators.maxLength(201) ] ],
      price: [ goods.price, [ Validators.required, Validators.maxLength(15) ] ],
      delivery: this.fb.group({
        delivery: goods.delivery,
        etc: [
          '',
          Validators.maxLength(51)
        ]
      }, { validators: Validators.required }),
      contact: [ goods.contact, Validators.maxLength(51) ],
      donation: [ goods.donation, Validators.required ]
    });
  }

  protected upload(): Observable<any> {
    const files = [];

    this.imageFiles.forEach(imageFile => {
      files.push(imageFile.file);
    });

    const progress$ = [];
    const response$ = [];
    const statusList = this.fileUploadService.upload(files, this.uploadPreset);

    for (const key of Object.keys(statusList)) {
      progress$.push(statusList[key].progress);
      response$.push(statusList[key].response);
    }

    // merge(progress$).pipe().subscribe(result => {
    //   result.subscribe(r => console.log('progress$', r));
    // });
    //

    return forkJoin(response$).pipe(
      map(responses => {
        return responses.map(response => {
          return response.body.eager[0].url;
        });
      })
    );
  }

  onChangeImage(e: any) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      const imageFile = new ImageFile(file);
      imageFile.readAsDataURL().then(() => {
        this.imageFiles.set(Date.now(), imageFile);
      });
    }
  }

  onSubmit() {
    if (!this.submitting) {
      this.submitting = true;
      this.spinnerService.show(true);
      this.upload().pipe(
        map(images => Object.assign(this.goods, this.editForm.value, { images })),
        switchMap(goods => this.goodsService.addGoods(goods))
      ).subscribe(this.success, this.error);
    }
  }

  success = () => {
    this.router.navigate(['/']).then(() => {
      this.spinnerService.show(false);
      this.submitting = false;
    });
  }

  error = (e) => {
    console.error(e);
    alert(e);

    this.spinnerService.show(false);
    this.submitting = false;
  }
}
