import { Component } from '@angular/core';
import { DisableHeader } from '@shared/decorators/disable-header.decorator';

@Component({
  templateUrl: 'error404.component.html'
})
@DisableHeader()
export class Error404Component {

  public count: number = 3;

  ngOnInit() {
    this.countDown();
  }

  private countDown() {
    setTimeout(() => {
      if (this.count > 0) {
        this.count--;
        this.countDown();
      } else {
        history.back();
      }
    }, 1000);
  }

}
