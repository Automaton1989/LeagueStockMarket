import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { AccountPageComponent } from './account-page/account-page.component';
import { ShowTeamComponent } from './show-team/show-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';


const routes: Routes = [
{path: '', component: HomepageComponent},
{path: 'create-team', component: CreateTeamComponent},
{path: 'account', component: AccountPageComponent},
{path: 'team/:name', component: ShowTeamComponent},
{path: 'team/:name/edit', component: EditTeamComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
