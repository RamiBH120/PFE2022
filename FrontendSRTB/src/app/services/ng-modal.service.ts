import { Injectable } from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class NgModalService {

  title: string;
  buttonTitle = "OK";
  type: "error";

  protected modalRef: NgbModalRef;

  constructor(protected modalService: NgbModal) { }

  public show(title: string, message: string) {
    this.title = title;
    this.modalRef = this.modalService.open(
      message
    );
  }

  hide() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
