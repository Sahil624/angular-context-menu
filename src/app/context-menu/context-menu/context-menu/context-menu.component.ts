import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    OnInit,
    HostListener,
    Inject,
    Input,
    OnDestroy,
    Optional,
    Output,
    QueryList,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { ContextMenuItemDirective } from '../context-menu-item.directive';
import { ContextServiceService, IContextMenuClickEvent, CloseContextMenuEvent } from '../_providers/context-service.service';

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
    template: '',
    // templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
    @Input() public menuClass = "";
    @Input() public autoFocus = false;
    @Input() public useBootstrap4 = false;
    @Input() public disabled = false;
    @Output() public close: EventEmitter<CloseContextMenuEvent> = new EventEmitter();
    @Output() public open: EventEmitter<IContextMenuClickEvent> = new EventEmitter();
    @ContentChildren(ContextMenuItemDirective) public menuItems: QueryList<ContextMenuItemDirective>;
    @ViewChild('menu') public menuElement: ElementRef;
    public visibleMenuItems: ContextMenuItemDirective[] = [];

    public links: ILinkConfig[] = [];
    public item: any;
    public event: MouseEvent | KeyboardEvent;
    private subscription: Subscription = new Subscription();
    constructor(
        private _contextMenuService: ContextServiceService,
        private changeDetector: ChangeDetectorRef,
        private elementRef: ElementRef) {
        this.subscription.add(_contextMenuService.show.subscribe(menuEvent => {
            this.onMenuEvent(menuEvent);
        }));
    }

    ngOnInit() {
        console.log(this.menuItems);
    }

    public onMenuEvent(menuEvent: IContextMenuClickEvent): void {
        if (this.disabled) {
            return;
        }
        const { contextMenu, event, item } = menuEvent;
        if (contextMenu && contextMenu !== this) {
            return;
        }
        console.log('items', this.menuItems);

        this.event = event;
        this.item = item;
        this.setVisibleMenuItems();
        this._contextMenuService.openContextMenu({ ...menuEvent, menuItems: this.visibleMenuItems, menuClass: this.menuClass });
        this._contextMenuService.close.asObservable().pipe(first()).subscribe(closeEvent => this.close.emit(closeEvent));
        this.open.next(menuEvent);
    }


    public isMenuItemVisible(menuItem: ContextMenuItemDirective): boolean {
        return this.evaluateIfFunction(menuItem.visible);
    }

    public setVisibleMenuItems(): void {
        this.visibleMenuItems = this.menuItems.filter(menuItem => this.isMenuItemVisible(menuItem));
    }

    public evaluateIfFunction(value: any): any {
        if (value instanceof Function) {
            return value(this.item);
        }
        return value;
    }
}