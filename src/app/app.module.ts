import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GiffyComponent } from './components/giffy/giffy.component';
import { GiffiesComponent } from './pages/giffies/giffies.component';

@NgModule({
  declarations: [AppComponent, GiffyComponent, GiffiesComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
