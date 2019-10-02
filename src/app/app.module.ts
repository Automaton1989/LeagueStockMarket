import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpService } from './http.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { AccountPageComponent } from './account-page/account-page.component';
import { ShowTeamComponent } from './show-team/show-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CreateTeamComponent,
    AccountPageComponent,
    ShowTeamComponent,
    EditTeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [HttpService, HomepageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
