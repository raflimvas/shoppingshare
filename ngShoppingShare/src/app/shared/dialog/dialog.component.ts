import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { DialogButtonDirective } from './dialog-button.directive';
import { DialogResult } from './dialog-result.model';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: [ 'dialog.component.scss' ]
})
export class DialogComponent {

  public isOpened: boolean = false;

  @Input() public title: string = 'Dialog';
  @Output() public result = new EventEmitter<DialogResult>();

  @ContentChildren(DialogButtonDirective) buttons: QueryList<DialogButtonDirective> = <any>null;

  constructor() { }

  ngAfterViewInit() {
    this.buttons.toArray().forEach(x => {
      x.click.subscribe(e => {
        this.result.emit({
          action: x.dialogAction
        });
        if (x.dialogAction != 'none') this.forceClose();
      })
    });
  }

  public open(): void {
    this.isOpened = true;
  }

  public forceClose(): void {
    this.isOpened = false;
  }

  public cancel(): void {
    this.isOpened = false;
    this.result.emit({
      action: 'cancel'
    });
  }

}
