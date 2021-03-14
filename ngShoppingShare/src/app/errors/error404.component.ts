import { Component } from "@angular/core";
import { DisableHeader } from "../shared/decorators/disable-header.decorator";

@Component({
  templateUrl: 'error404.component.html'
})
@DisableHeader()
export class Error404Component {

  ngOnInit() { history.back() }

}
