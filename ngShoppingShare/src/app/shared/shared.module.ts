import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { DialogButtonDirective } from './dialog/dialog-button.directive';
import { DialogComponent } from './dialog/dialog.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { ContentInterceptor } from './interceptors/content.interceptor';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { UserSessionService } from './services/usersession.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';
import { ToastService } from './services/toast.service';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    DialogComponent,
    DialogButtonDirective,
    SpinnerComponent,
    ValidationMessageComponent
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    DialogComponent,
    DialogButtonDirective,
    SpinnerComponent,
    ValidationMessageComponent
  ],
  providers: [

  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        UserSessionService,
        SpinnerService,
        AuthGuard,
        ToastService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SpinnerInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthTokenInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ContentInterceptor,
          multi: true
        }
      ]
    };
  }

}
