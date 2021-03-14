import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { Error404Component } from "./error404.component";

@NgModule({
  imports: [ SharedModule ],
  declarations: [ Error404Component ],
  exports: [ Error404Component ]
})
export class ErrorsModule { }
