import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { MatMenuModule, MatDialogModule, MatButtonModule, MatMenuTrigger } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContextMenuDirective } from './context-menu.directive';
import { ContextServiceService } from './_providers/context-service.service';
import {OverlayModule} from '@angular/cdk/overlay';
import { ContextMenuItemDirective } from './context-menu-item.directive';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    DragDropModule,
    OverlayModule,
    MatMenuModule
  ],
  declarations: [ContextMenuComponent, ContextMenuDirective,  ContextMenuItemDirective],
  exports: [
    ContextMenuDirective,
    ContextMenuComponent
  ],
  entryComponents: [
    ContextMenuComponent
  ],
  providers: [ContextServiceService]
})
export class MyContextMenuModule { }