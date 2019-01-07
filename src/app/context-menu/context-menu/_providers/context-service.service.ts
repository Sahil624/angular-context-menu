import { Injectable, ComponentRef, ElementRef } from '@angular/core';
import { ContextMenuItemDirective } from '../context-menu-item.directive';
import { Subject, Subscription } from 'rxjs';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { ContextMenuContentComponent } from '../context-menu/context-menu-content.component';
import { OverlayRef, Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

export interface CancelContextMenuEvent {
    eventType: 'cancel';
    event?: MouseEvent | KeyboardEvent;
}
export interface ExecuteContextMenuEvent {
    eventType: 'execute';
    event?: MouseEvent | KeyboardEvent;
    item: any;
    menuItem: ContextMenuItemDirective;
}
export type CloseContextMenuEvent = ExecuteContextMenuEvent | CancelContextMenuEvent;

export interface IContextMenuClickEvent {
    anchorElement?: Element | EventTarget;
    contextMenu?: ContextMenuComponent;
    event?: MouseEvent | KeyboardEvent;
    parentContextMenu?: ContextMenuContentComponent;
    item: any;
    activeMenuItemIndex?: number;
}
export interface IContextMenuContext extends IContextMenuClickEvent {
    menuItems: ContextMenuItemDirective[];
    menuClass: string;
}

@Injectable()
export class ContextServiceService {

    public menuTrigger: Subject<IContextMenuClickEvent> = new Subject<IContextMenuClickEvent>();
    private overlays: OverlayRef[] = [];
    public close: Subject<CloseContextMenuEvent> = new Subject();
    public show: Subject<IContextMenuClickEvent> = new Subject<IContextMenuClickEvent>();
    private _fakeElement: any = {
        getBoundingClientRect: (): ClientRect => ({
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
        })
    };
    constructor(private _overlay: Overlay,
        private _scrollStrategy: ScrollStrategyOptions) { }

    public openContextMenu(context: IContextMenuContext) {
        const { anchorElement, event, parentContextMenu } = context;

        if (!parentContextMenu) {
            const mouseEvent = event as MouseEvent;
            this._fakeElement.getBoundingClientRect = (): ClientRect => ({
                bottom: mouseEvent.clientY,
                height: 0,
                left: mouseEvent.clientX,
                right: mouseEvent.clientX,
                top: mouseEvent.clientY,
                width: 0,
            });
            this.closeAllContextMenus({ eventType: 'cancel', event });
            const positionStrategy = this._overlay.position().connectedTo(
                new ElementRef(anchorElement || this._fakeElement),
                { originX: 'start', originY: 'bottom' },
                { overlayX: 'start', overlayY: 'top' })
                .withFallbackPosition(
                    { originX: 'start', originY: 'top' },
                    { overlayX: 'start', overlayY: 'bottom' })
                .withFallbackPosition(
                    { originX: 'end', originY: 'top' },
                    { overlayX: 'start', overlayY: 'top' })
                .withFallbackPosition(
                    { originX: 'start', originY: 'top' },
                    { overlayX: 'end', overlayY: 'top' })
                .withFallbackPosition(
                    { originX: 'end', originY: 'center' },
                    { overlayX: 'start', overlayY: 'center' })
                .withFallbackPosition(
                    { originX: 'start', originY: 'center' },
                    { overlayX: 'end', overlayY: 'center' })
                ;
            this.overlays = [this._overlay.create({
                positionStrategy,
                panelClass: 'ngx-contextmenu',
                scrollStrategy: this._scrollStrategy.close(),
            })];
            // this.attachContextMenu(this.overlays[0], context);
        }
    }

    // public attachContextMenu(overlay: OverlayRef, context: IContextMenuContext): void {
    //     const { event, item, menuItems, menuClass } = context;

    //     const contextMenuContent: ComponentRef<ContextMenuContentComponent> = overlay.attach(new ComponentPortal(ContextMenuContentComponent));
    //     contextMenuContent.instance.event = event;
    //     contextMenuContent.instance.item = item;
    //     contextMenuContent.instance.menuItems = menuItems;
    //     contextMenuContent.instance.overlay = overlay;
    //     contextMenuContent.instance.isLeaf = true;
    //     contextMenuContent.instance.menuClass = menuClass;
    //     (<OverlayRefWithContextMenu>overlay).contextMenu = contextMenuContent.instance;

    //     const subscriptions: Subscription = new Subscription();
    //     subscriptions.add(contextMenuContent.instance.execute.asObservable()
    //         .subscribe((executeEvent) => this.closeAllContextMenus({ eventType: 'execute', ...executeEvent })));
    //     subscriptions.add(contextMenuContent.instance.closeAllMenus.asObservable()
    //         .subscribe((closeAllEvent) => this.closeAllContextMenus({ eventType: 'cancel', ...closeAllEvent })));
    //     subscriptions.add(contextMenuContent.instance.closeLeafMenu.asObservable()
    //         .subscribe(closeLeafMenuEvent => this.destroyLeafMenu(closeLeafMenuEvent)));
    //     subscriptions.add(contextMenuContent.instance.openSubMenu.asObservable()
    //         .subscribe((subMenuEvent: IContextMenuContext) => {
    //             this.destroySubMenus(contextMenuContent.instance);
    //             if (!subMenuEvent.contextMenu) {
    //                 contextMenuContent.instance.isLeaf = true;
    //                 return;
    //             }
    //             contextMenuContent.instance.isLeaf = false;
    //             this.show.next(subMenuEvent);
    //         }));
    //     contextMenuContent.onDestroy(() => {
    //         menuItems.forEach(menuItem => menuItem.isActive = false);
    //         subscriptions.unsubscribe();
    //     });
    //     contextMenuContent.changeDetectorRef.detectChanges();
    // }

    public closeAllContextMenus(closeEvent: CloseContextMenuEvent): void {
        if (this.overlays) {
            this.close.next(closeEvent);
            this.overlays.forEach((overlay, index) => {
                overlay.detach();
                overlay.dispose();
            });
        }
        this.overlays = [];
    }
}