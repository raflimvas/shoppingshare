import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth.routing';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
