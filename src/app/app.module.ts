import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
// applications modules
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoodsModule } from './modules/goods/goods.module';
import { AppRoutingModule } from './app-routing.module';
// providers
import { AuthGuard } from './shared/guards';
import { LoginInfoResolver } from './shared/resolvers';
// components
import { AppComponent } from './app.component';
import { IntroComponent } from './modules/intro/intro.component';
import { HomeComponent } from './modules/home/home.component';
// environment
import { environment } from '../environments/environment';

import { SpinnerService } from './modules/spinner/spinner.service';
import { SpinnerComponent } from './modules/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    IntroComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    SharedModule,
    AuthModule,
    GoodsModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    LoginInfoResolver,
    SpinnerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
