import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
// applications modules
import { SharedModule } from '@app/shared/shared.module';
import { HomeModule } from '@app/modules/home/home.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { PreferenceModule } from '@app/modules/preference/preference.module';
import { AppRoutingModule } from '@app/app-routing.module';
// providers
import { AuthGuard } from '@app/shared/guards';
import { AuthService } from '@app/core/http';
import { LoggedIn } from '@app/core/logged-in.service';
// components
import { AppComponent } from '@app/app.component';
// environment
import { environment } from '@environments/environment';

import { PersistenceService } from '@app/shared/services';
import { SpinnerService } from '@app/shared/services/spinner.service';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';

export function resolveAuthInfo(authService: AuthService) {
  return () => authService.resolveAuthInfo().toPromise();
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    SharedModule,
    HomeModule,
    AuthModule,
    GoodsModule,
    PreferenceModule,
    AppRoutingModule
  ],
  providers: [
    Location,
    LoggedIn,
    AuthGuard,
    AuthService,
    PersistenceService,
    SpinnerService,
    { provide: APP_INITIALIZER, useFactory: resolveAuthInfo, deps: [AuthService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
