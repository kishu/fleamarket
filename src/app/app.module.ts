import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
// applications modules
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './modules/home/home.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoodsModule } from './modules/goods/goods.module';
import { PreferenceModule } from './modules/preference/preference.module';
import { AppRoutingModule } from './app-routing.module';
// providers
import { AuthGuard } from './shared/guards';
import { AuthService } from './core/http';
// components
import { AppComponent } from './app.component';
import { IntroComponent } from './modules/intro/intro.component';
// environment
import { environment } from '../environments/environment';

import { PersistanceService } from './shared/services';
import { SpinnerService } from './modules/spinner/spinner.service';
import { SpinnerComponent } from './modules/spinner/spinner.component';

export function resolveAuthInfo(authService: AuthService) {
  return () => authService.resolveAuthInfo().toPromise();
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    IntroComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    SharedModule,
    HomeModule,
    AuthModule,
    GoodsModule,
    PreferenceModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    PersistanceService,
    SpinnerService,
    { provide: APP_INITIALIZER, useFactory: resolveAuthInfo, deps: [AuthService], multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
