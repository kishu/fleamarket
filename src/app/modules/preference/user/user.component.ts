import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService, FileUploadService, UserService } from '../../../core/http';
import { SpinnerService } from '../../spinner/spinner.service';
import { CloudinaryPreset, ImageFile, UserPreference } from '../../../shared/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  preferenceForm: FormGroup;
  imageURL = environment.cloudinary.imageURL;
  photoURL: string | ArrayBuffer;
  private submitting = false;
  private imageFile: ImageFile;

  get displayName() { return this.preferenceForm.get('displayName'); }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
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
      notice: [user.notice, Validators.required]
    });
  }

  ngOnInit() {
  }

  protected getUserPreference(image) {
    const form = this.preferenceForm;
    return {
      photoURL: image,
      displayName: form.get('displayName').value,
      desc: form.get('desc').value,
      notice: form.get('notice').value,
    } as UserPreference;
  }

  protected upload(): Observable<any> {
    const files = [this.imageFile.file];

    const progress$ = [];
    const response$ = [];
    const statusList = this.fileUploadService.upload(files, CloudinaryPreset.profile);

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
          return `${response.body.public_id}.${response.body.format}`;
        });
      })
    );
  }

  onChangeImage(e: any) {
    const file = e.target.files.item(0);
    const tmpImageFile = new ImageFile(file);

    tmpImageFile.readAsDataURL().then(() => {
      this.photoURL = tmpImageFile.dataURL;
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
          map(images => this.getUserPreference(images[0])),
          switchMap(preference => this.userService.updatePreference(id, preference))
        ).subscribe(this.success, this.error);
      } else {
        const preference = this.getUserPreference(this.authService.user.photoURL);
        this.userService.updatePreference(id, preference).then(this.success, this.error);
      }
    }
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

}
