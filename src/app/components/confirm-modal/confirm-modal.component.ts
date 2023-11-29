// Angular
import { Component, OnInit } from '@angular/core';
// Vendor
import { NovoModalParams, NovoModalRef } from 'novo-elements';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <novo-notification type="warning">
      <h2>{{ headerText }}</h2>
      <h3 *ngIf="subheaderText">{{ subheaderText }}</h3>
      <button theme="standard" (click)="cancel()">Cancel</button>
      <button theme="primary" [color]="buttonColor" (click)="yes()" [icon]="confirmButtonIcon">
        {{ confirmButtonText }}
      </button>
    </novo-notification>
  `,
})
export class ConfirmModalComponent implements OnInit {
  headerText: any;
  subheaderText: any;
  buttonColor: string;
  confirmButtonText: string;
  confirmButtonIcon: string;

  constructor(
    public modalRef: NovoModalRef,
    public params: NovoModalParams,
  ) {}

  ngOnInit(): any {
    this.headerText = this.params['headerText'];
    this.subheaderText = this.params['subheaderText'];
    this.buttonColor = this.params['buttonColor'] || 'action';
    this.confirmButtonText = this.params['confirmButtonText'] || 'Yes';
    this.confirmButtonIcon = this.params['confirmButtonIcon'] || 'check';
  }

  yes(): any {
    this.modalRef.close(true);
  }

  cancel(): any {
    this.modalRef.close();
  }
}
