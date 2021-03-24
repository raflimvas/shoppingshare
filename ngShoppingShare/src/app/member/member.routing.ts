import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { ListsCreateComponent } from './lists/lists.create.component';
import { ListsUpdateComponent } from './lists/lists.update.component';
import { MemberComponent } from './member.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
      { path: '', component: ListsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'newlist', component: ListsCreateComponent },
      { path: 'updatelist', component: ListsUpdateComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MemberRoutingModule { }
