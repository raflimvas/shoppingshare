import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ListsComponent } from './lists/lists.component';
import { ListsConfigComponent } from './lists/lists.config.component';
import { ListsCreateComponent } from './lists/lists.create.component';
import { ListsFormComponent } from './lists/lists.form.component';
import { ListsUpdateComponent } from './lists/lists.update.component';
import { MemberComponent } from './member.component';
import { MemberRoutingModule } from './member.routing';
import { MemberService } from './member.service';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [ SharedModule, MemberRoutingModule ],
  declarations: [
    MemberComponent,
    ListsComponent,
    ListsCreateComponent,
    ListsUpdateComponent,
    ListsConfigComponent,
    ListsFormComponent,
    ProfileComponent ],
  providers: [ MemberService ]
})
export class MemberModule { }
