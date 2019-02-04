import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from '@app/modules/home/custom-reuse-strategy';
import { HomeRoutingModule } from '@app/modules/home/home-routing.module';
import { HomeComponent } from '@app/modules/home/home/home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]
})
export class HomeModule { }
