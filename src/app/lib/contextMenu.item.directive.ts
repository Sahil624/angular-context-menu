import { Highlightable } from '@angular/cdk/a11y';
import { Directive, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Directive({
    /* tslint:disable:directive-selector-type */
    selector: '[contextMenuItem]',
    /* tslint:enable:directive-selector-type */
})
export class ContextMenuItemDirective implements Highlightable {
    @Input() public enabled: boolean | ((item: any) => boolean) = true;
    @Input() public passive = false;
    @Input() public visible: boolean | ((item: any) => boolean) = true;
    @Output() public execute: EventEmitter<{ event: Event, item: any }> = new EventEmitter();

    public currentItem: any;
    public isActive = false;

    constructor(public template: TemplateRef<{ item: any }>, public elementRef: ElementRef) { }

    public setActiveStyles(): void {
        this.isActive = true;
    }
    public setInactiveStyles(): void {
        this.isActive = false;
    }

}
