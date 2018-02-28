// NG
import { Component } from '@angular/core';

@Component({
  selector: 'app-load',
  template: `
    <div class="load-wrapper">
      <app-load-header [stepNumber]="stepNumber"></app-load-header>
      <div class="first-step-wrapper" *ngIf="stepNumber === 1">
        <div class="drop-help-wrapper">
          <i class="bhi-dropzone"></i>
          <h2>{{ 'DRAG_AND_DROP.HEADING' | translate }}</h2>
          <h4>
            {{ 'DRAG_AND_DROP.SUB_HEADING_1' | translate }}
            <a>{{ 'DRAG_AND_DROP.SUB_HEADING_2' | translate }}</a>
            {{ 'DRAG_AND_DROP.SUB_HEADING_3' | translate }}
          </h4>
        </div>
      </div>
      <div class="second-step-wrapper" *ngIf="stepNumber === 2"></div>
      <!--<app-results *ngIf="stepNumber === 3"></app-results>-->
    </div>
  `,
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent {
  stepNumber: number = 1;
}
