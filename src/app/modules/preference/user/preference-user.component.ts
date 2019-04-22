import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LocationService } from '@app/shared/services';
import { AuthService, FileUploadService, UserService } from '@app/core/http';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { ImageFile } from '@app/core/models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-preference-user',
  templateUrl: './preference-user.component.html',
  styleUrls: ['./preference-user.component.scss']
})
export class PreferenceUserComponent implements OnInit {
  preferenceForm: FormGroup;
  photoURL: string | ArrayBuffer;
  show = false;

  private imageFile: ImageFile;
  private submitting = false;
  private uploadPreset = environment.cloudinary.preset.profile;

  get displayName() { return this.preferenceForm.get('displayName'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private spinnerService: SpinnerService
  ) {
    const user = this.authService.user;
    this.photoURL = user.photoURL;

    this.preferenceForm = this.fb.group({
      displayName: [user.displayName || '', [Validators.required, Validators.minLength(1), Validators.maxLength(21)]],
      desc: [user.desc || '', Validators.maxLength(101)],
      notification: this.fb.group({
        goods: user.notification.goods,
        interest: user.notification.interest
      })
    });
  }

  ngOnInit() { }

  protected upload(): Observable<any> {
    const files = [this.imageFile.file];

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
    const file = e.target.files.item(0);
    const tmpImageFile = new ImageFile(file);

    tmpImageFile.readAsDataURL().then(() => {
      this.photoURL = tmpImageFile.url;
      this.imageFile = tmpImageFile;
    });
  }

  onSubmit() {
    if (!this.submitting) {
      this.submitting = true;
      this.spinnerService.show(true);

      const id = this.authService.user.id;

      if (this.imageFile) {
        this.upload().pipe(
          map(images => Object.assign({photoURL: images[0]}, this.preferenceForm.value)),
          switchMap(preference => this.userService.updatePreference(id, preference))
        ).subscribe(this.success, this.error);
      } else {
        this.userService.updatePreference(id, this.preferenceForm.value).then(this.success, this.error);
      }
    }
  }

  onClickSignOut() {
    this.authService.signOut().then(
      () => {
        this.router.navigate(['/verification']);
      }
    );
  }

  protected success = () => {
    this.spinnerService.show(false);
    this.submitting = false;
  }

  protected error = (e) => {
    console.error(e);
    alert(e);

    this.spinnerService.show(false);
    this.submitting = false;
  }

  // goBack(e: any) {
  //   e.preventDefault();
  //   this.locationService.goBack();
  // }

}
