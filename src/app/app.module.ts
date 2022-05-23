import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { GiffyComponent } from './components/giffy/giffy.component';
import { GiffiesComponent } from './pages/giffies/giffies.component';
import { GiffiesEffects } from './store/effects/giffies.effects';
import { giffiesReducer } from './store/reducers/giffies.reducer';
import { PaginationControlComponent } from './components/pagination-control/pagination-control.component';

@NgModule({
  declarations: [
    AppComponent,
    GiffyComponent,
    GiffiesComponent,
    PaginationControlComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({ giffies: giffiesReducer }),
    EffectsModule.forRoot([GiffiesEffects]),
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
