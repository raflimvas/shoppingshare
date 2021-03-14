import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DialogButtonDirective } from "./dialog/dialog-button.directive";
import { DialogComponent } from "./dialog/dialog.component";
import { UserSessionService } from "./services/usersession.service";
import { SpinnerComponent } from "./spinner/spinner.component";
import { SpinnerService } from "./spinner/spinner.service";
import { ValidationMessageComponent } from "./validation-message/validation-message.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
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
      providers: [ UserSessionService, SpinnerService ]
    };
  }

}
