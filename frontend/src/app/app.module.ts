import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { TablesComponent } from './tables/tables.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantsComponent,
    TablesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
