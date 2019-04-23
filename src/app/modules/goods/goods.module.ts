import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadService } from '@app/core/http';
import { SharedModule } from '@app/shared/shared.module';
import { GoodsRoutingModule } from '@app/modules/goods/goods-routing.module';
import { GoodsDetailComponent } from '@app/modules/goods/detail/goods-detail.component';
import { GoodsEditComponent } from '@app/modules/goods/edit/goods-edit.component';

@NgModule({
  declarations: [
    GoodsDetailComponent,
    GoodsEditComponent
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
