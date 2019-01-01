import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../shared/guards';
import { LoginInfoResolver } from '../../shared/resolvers';
import { TargetSelectedValidatorDirective } from './target-selected-validator.directive';
import { RemoveCommaPipe } from './remove-comma.pipe';
import { GoodsRoutingModule } from './goods-routing.module';
import { WriteComponent } from './write/write.component';
import { FileUploadService } from './file-upload.service';

@NgModule({
  declarations: [
    TargetSelectedValidatorDirective,
    RemoveCommaPipe,
    WriteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GoodsRoutingModule
  ],
  providers: [
    AuthGuard,
    LoginInfoResolver,
    DecimalPipe,
    FileUploadService
  ],
})
export class GoodsModule { }
