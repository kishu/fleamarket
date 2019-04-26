import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { FunctionsRegionToken } from '@angular/fire/functions';
// applications modules
import { SharedModule } from '@app/shared/shared.module';
import { HomeModule } from '@app/modules/home/home.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { PreferenceModule } from '@app/modules/preference/preference.module';
import { AppRoutingModule } from '@app/app-routing.module';
// providers
import { AuthService } from '@app/core/http';
import { AuthGuard } from '@app/shared/guards';
// components
import { AppComponent } from '@app/app.component';
// environment
import { environment } from '@environments/environment';

export function signIn(authService: AuthService) {
  return () => {
    return new Promise(resolve => {
      authService.checkIn().subscribe(() => resolve());
    });
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    // AngularFirestoreModule.enablePersistence(),
    SharedModule,
    HomeModule,
    AuthModule,
    GoodsModule,
    PreferenceModule,
    AppRoutingModule
  ],
  providers: [
    Location,
    AuthGuard,
    AuthService,
    { provide: FunctionsRegionToken, useValue: environment.firebase.functionsRegion},
    { provide: APP_INITIALIZER, useFactory: signIn, deps: [AuthService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
