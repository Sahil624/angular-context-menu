import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MatTableModule,MatMenuModule, MatButtonModule } from '@angular/material';
import { ContextMenuModule } from './lib/ngx-contextmenu';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  imports:      [ BrowserModule,BrowserAnimationsModule, FormsModule, MatTableModule,  MatMenuModule, OverlayModule , ContextMenuModule, MatButtonModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
