import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './errors/error404.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'member',
    loadChildren: () => import('./member/member.module').then(m => m.MemberModule),
    canActivate: [ AuthGuard ]
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    component: Error404Component
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
