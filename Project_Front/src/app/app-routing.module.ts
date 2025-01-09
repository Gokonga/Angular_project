import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { WorkerComponent } from './components/worker/worker.component';
import { workerGuard } from './guards/worker.guard';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'admin' , component:AdminComponent,canActivate:[adminGuard] },
  {path:'worker',component:WorkerComponent,canActivate:[workerGuard]},
  {path:'',redirectTo:'/login',pathMatch:'full'},

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})  
export class AppRoutingModule { }
