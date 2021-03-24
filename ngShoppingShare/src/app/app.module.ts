import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './home/home.component';
import { ErrorsModule } from './errors/errors.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderService } from './layout/header/header.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    SharedModule.forRoot(),
    ErrorsModule
  ],
  providers: [
    HeaderService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
