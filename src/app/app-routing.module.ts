import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesListComponent } from './activities/activities-list/activities-list.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'home', component:HomeComponent},
  {path:'contact-list', component:ContactListComponent},
  {path:'activities-list', component:ActivitiesListComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
