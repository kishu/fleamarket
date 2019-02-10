import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from '@app/modules/home/home-routing.module';
import { IntroComponent } from '@app/modules/home/intro/intro.component';
import { HomeComponent } from '@app/modules/home/home/home.component';

@NgModule({
  declarations: [
    IntroComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  exports: [
    IntroComponent
  ]
})
export class HomeModule { }
