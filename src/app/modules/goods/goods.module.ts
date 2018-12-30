import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../shared/guards';
import { UserResolver } from '../../shared/resolvers';
import { TargetSelectedValidatorDirective } from './target-selected-validator.directive';
import { RemoveCommaPipe } from './remove-comma.pipe';
import { GoodsRoutingModule } from './goods-routing.module';
import { WriteComponent } from './write/write.component';

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
    UserResolver,
    DecimalPipe
  ],
})
export class GoodsModule { }
