import {
    Component,
    ContentChildren,
    ElementRef,
    Input,
    OnDestroy,
    QueryList,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { ContextMenuItemDirective } from './contextMenu.item.directive';
import { ContextMenuService, IContextMenuClickEvent, CloseContextMenuEvent } from './contextMenu.service';

export interface ILinkConfig {
    click: (item: any, $event?: MouseEvent) => void;
    enabled?: (item: any) => boolean;
    html: (item: any) => string;
}
export interface MouseLocation {
    left?: string;
    marginLeft?: string;
    marginTop?: string;
    top?: string;
}

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'context-menu',
    styles: [`
    .cdk-overlay-container {
      position: fixed;
      z-index: 1000;
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .ngx-contextmenu.cdk-overlay-pane {
      position: absolute;
      pointer-events: auto;
      box-sizing: border-box;
    }
  `],
    template: ` `,
})
export class ContextMenuComponent implements OnDestroy {
    @Input() public menuClass = "";
    @ContentChildren(ContextMenuItemDirective) public menuItems: QueryList<ContextMenuItemDirective>;
    // @ViewChild('menu') public menuElement: ElementRef;
    public visibleMenuItems: ContextMenuItemDirective[] = [];

    item: any;
    private subscription: Subscription = new Subscription();

    constructor(
        private _contextMenuService: ContextMenuService,
    ) {
        this.subscription.add(_contextMenuService.show.subscribe(menuEvent => {
            this.onMenuEvent(menuEvent);
        }));
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public onMenuEvent(menuEvent: IContextMenuClickEvent): void {
        const { contextMenu, event, item } = menuEvent;
        if (contextMenu && contextMenu !== this) {
            return;
        }
        this.item = item;
        
        this._contextMenuService.openContextMenu({ ...menuEvent, menuItems: this.menuItems.toArray(), menuClass: this.menuClass });
    }

}
