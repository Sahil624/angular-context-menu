import { Directive, Input, ViewContainerRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatMenu, MatMenuTrigger, MatMenuPanel } from '@angular/material';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ContextServiceService } from './_providers/context-service.service';


@Directive({
  selector: '[contextMenu]',
  host: {
    'area-hashpopup': 'true',
    '(click)': '_handleClick($event)',
    '(contextmenu)': 'handleContext($event)'
  }
})
export class ContextMenuDirective {
  menu = null;

  @Input() public contextMenuSubject: any;
  @Input('contextMenu') public contextMenu;

  constructor(private _menuService: ContextServiceService) { }

  get _menuFor() {
    return this.menu;
  }

  set _menuFor(v: MatMenuPanel) {
    this.menu  = v;
  }

  _handleClick(e) {
    console.log('click', e);
  }

  handleContext(event: MouseEvent) {
    event.preventDefault();
    console.log('right-click', event, this.contextMenu);
    this._menuService.show.next({
      contextMenu: this.contextMenu,
      event: event,
      item: this.contextMenuSubject
    })
  }

}