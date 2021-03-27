import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";

export interface IToastForm {
  title: string;
  description: string;
}

export interface IToastState {
  success: IToastForm[];
  error: IToastForm[];
  info: IToastForm[];
  warning: IToastForm[];
}

@Injectable()
export class ToastService {

  constructor(private toastr: ToastrService) { }

  public success(title?: string, message?: string) {
    const toast = this.toastr.success(message, title, { closeButton: true });
    return toast.onHidden;
  }

  public error(title?: string, message?: string) {
    const toast = this.toastr.error(message, title, { closeButton: true });
    return toast.onHidden;
  }

  public warning(title?: string, message?: string) {
    const toast = this.toastr.warning(message, title, { closeButton: true });
    return toast.onHidden;
  }

  public info(title?: string, message?: string) {
    const toast = this.toastr.info(message, title, { closeButton: true });
    return toast.onHidden;
  }

}
