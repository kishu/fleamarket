import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../shared/guards';
import { UserResolver } from '../../shared/resolvers';
import { TargetSelectedValidatorDirective } from './target-selected.directive';
import { GoodsRoutingModule } from './goods-routing.module';
import { WriteComponent } from './write/write.component';

@NgModule({
  declarations: [
    TargetSelectedValidatorDirective,
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
    UserResolver
  ],
})
export class GoodsModule { }
