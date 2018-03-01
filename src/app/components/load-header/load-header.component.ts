import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-load-header',
  template: `
    <div class="load-header-wrapper">
      <div [class.colored]="stepNumber >= 1">
        <i class="bhi-upload"></i>
        <div class="step-text">{{ 'SELECT_FILE' | translate }}</div>
      </div>
      <div class="preview-wrapper" [class.colored]="stepNumber >= 2">
        <i class="bhi-preview"></i>
        <div class="step-text">{{ 'PREVIEW' | translate }}</div>
      </div>
      <div [class.colored]="stepNumber >= 3">
        <i class="bhi-list"></i>
        <div class="step-text">{{ 'VIEW_RESULTS' | translate }}</div>
      </div>
    </div>
    <div class="load-header-wrapper-border"
         [ngClass]="{'first-step': stepNumber === 1, 'second-step': stepNumber === 2, 'third-step': stepNumber === 3}"></div>
  `,
  styleUrls: ['./load-header.component.scss'],
})
export class LoadHeaderComponent {
  @Input() stepNumber: number;
}
