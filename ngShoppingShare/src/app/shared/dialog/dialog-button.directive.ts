import { Directive, ElementRef, EventEmitter, Input, Renderer2 } from '@angular/core';
import { DialogResultAction } from './dialog-result.model';

@Directive({
  selector: '[dialogButton]'
})
export class DialogButtonDirective {

  @Input() set dialogAction(value: DialogResultAction) {
    (this.template.nativeElement as any).dialogAction = value;
  }

  public click = new EventEmitter<any>();

  constructor(public template: ElementRef<HTMLElement>, renderer: Renderer2) {
    renderer.listen(this.template.nativeElement, 'click', (e) => {
      this.click.emit(e);
    });
  }

}
