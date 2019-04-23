import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Goods, ImageFile } from '@app/core/models';
import { AuthService, FileUploadService, GoodsService } from '@app/core/http';
import { HtmlClassService, LocationService } from '@app/shared/services';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { targetSelectedValidator } from '@app/modules/goods/target-selected-validator.directive';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './goods-edit.component.html',
  styleUrls: ['./goods-edit.component.scss']
})
export class GoodsEditComponent implements OnInit {
  private submitting = false;
  private readonly uploadPreset = environment.cloudinary.preset.goods;
  private readonly newGoods: boolean;

  readonly action: string;
  readonly back: string;
  readonly goods: Goods;
  readonly groupName: string;

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
    private decimalPipe: DecimalPipe,
    private auth: AuthService,
    private locationService: LocationService,
    private goodsService: GoodsService,
    private fileUploadService: FileUploadService,
    private spinnerService: SpinnerService,
    private htmlClassService: HtmlClassService
  ) {
    this.newGoods = ( this.route.snapshot.params['goodsId'] === 'new' );
    this.action = this.newGoods ? '등록' : '수정';
    this.back = this.newGoods ? this.auth.group.name : '돌아가기';
    this.groupName = this.auth.group.name;
    this.goods = this.newGoods ?
      this.goodsService.getNewGoods() :
      this.goodsService.getSelectedGoods();
    this.buildForm();
  }

  ngOnInit() {
    this.htmlClassService.set('goods-edit');
  }

  buildForm() {
    const goods = this.goods;
    let delivery = '';
    let etc = '';

    if (goods.delivery === '직거래' || goods.delivery === '택배') {
      delivery = goods.delivery;
    } else {
      etc = goods.delivery;
    }

    this.editForm = this.fb.group({
      market: this.fb.group({
        group: true,
        lounge: goods.share,
      }, { validators: targetSelectedValidator }),
      purchase: [ goods.purchase, Validators.required ],
      condition: [ goods.condition, Validators.required ],
      title: [ goods.title, [ Validators.required,  Validators.maxLength(31) ] ],
      desc: [ goods.desc, [ Validators.required,  Validators.maxLength(201) ] ],
      price: [ this.decimalPipe.transform(goods.price, '1.0-0'), [ Validators.required, Validators.maxLength(15) ] ],
      delivery: this.fb.group({
        delivery: delivery,
        etc: [ etc,  Validators.maxLength(51) ]
      }, { validators: Validators.required }),
      contact: [ goods.contact, Validators.maxLength(51) ]
    });

    this.editForm.get('price')
      .valueChanges.subscribe(value => {
      if (value) {
        const noCommaValue = value.replace(/,/g, '');
        const intValue = parseInt(noCommaValue, 10);
        const result = noCommaValue ?
          this.decimalPipe.transform(intValue, '1.0-0') : '';
        this.editForm.get('price')
          .setValue(result, { emitEvent: false });
      }
    });

    this.editForm.get('delivery.delivery')
      .valueChanges.subscribe(() => {
      this.editForm.get('delivery.etc')
        .setValue('', { emitEvent: false });
    });

    this.editForm.get('delivery.etc')
      .valueChanges.subscribe(() => {
      this.editForm.get('delivery.delivery')
        .setValue('', { emitEvent: false });
    });
  }

  protected upload(): Observable<any> {
    const files = [];

    if (this.imageFiles.size === 0) {
      return of([]);
    }

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

  onChangeGroup(e: any) {
    const market = this.editForm.get('market').value;
    const checked = e.target.checked;

    if (!market.lounge && !checked) {
      this.editForm.get('market').patchValue({group: true});
    }
  }

  onChangeLounge(e: any) {
    const market = this.editForm.get('market').value;
    const checked = e.target.checked;

    if (!market.group && !checked) {
      this.editForm.get('market').patchValue({lounge: true});
    }
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

  onRotateImage(e: TouchEvent | MouseEvent, img: HTMLElement) {
    const rotate = +img.dataset.rotate || 0;
    let nextRotate = rotate + 90;
    if (nextRotate >= 360) {
      nextRotate = 0;
    }

    img.classList.remove(`rotate${rotate}`);
    img.classList.add(`rotate${nextRotate}`);
    img.dataset.rotate = nextRotate.toString();
  }

  onDeleteImageUrlByIndex(i: number) {
    this.goods.images.splice(i, 1);
  }

  onDeleteImageFileByKey(key: number) {
    this.imageFiles.delete(key);
  }

  onSubmit() {
    if (!this.submitting) {
      this.submitting = true;
      this.spinnerService.show(true);

      const form = this.editForm;
      const price = parseInt(form.get('price').value.replace(/,/g, ''), 10);
      const delivery = form.get('delivery.delivery').value || form.get('delivery.etc').value;

      this.upload().pipe(
        map(images => this.goods.images.concat(images)),
        map(images => {
          return Object.assign(this.goods, this.editForm.value, { price, delivery }, { images });
        }),
        switchMap(goods => {
          let addOrUpdateGoods$;
          if (this.newGoods) {
            addOrUpdateGoods$ = this.goodsService.addGoods(goods);
          } else {
            addOrUpdateGoods$ = this.goodsService.updateGoods(goods.id, goods);
          }
          return addOrUpdateGoods$;
        })
      ).subscribe(this.success, this.error);
    }
  }

  success = () => {
    // this.goodsListService.forceUpdate = true;
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

  goBack(e: any) {
    e.preventDefault();
    this.locationService.goBack();
  }
}
