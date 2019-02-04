import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadService } from '@app/core/http';
import { SharedModule } from '@app/shared/shared.module';
import { GoodsRoutingModule } from '@app/modules/goods/goods-routing.module';
import { DetailComponent } from '@app/modules/goods/detail/detail.component';
import { EditComponent } from '@app/modules/goods/edit/edit.component';
import { TargetSelectedValidatorDirective } from '@app/modules/goods/target-selected-validator.directive';

@NgModule({
  declarations: [
    TargetSelectedValidatorDirective,
    DetailComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GoodsRoutingModule
  ],
  providers: [
    DecimalPipe,
    FileUploadService
  ],
})
export class GoodsModule { }
