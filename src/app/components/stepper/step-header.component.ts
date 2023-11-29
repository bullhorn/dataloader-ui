// Angular
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CdkStepHeader } from '@angular/cdk/stepper';

@Component({
  selector: 'app-step-header',
  template: ` <div class="step-icon" [class.selected]="selected">
      <novo-icon>{{ icon }}</novo-icon>
    </div>
    <div class="step-label" [class.selected]="selected">
      <div class="step-text-label">{{ label }}</div>
    </div>
    <app-step-status [state]="state"></app-step-status>`,
  styleUrls: ['step-header.component.scss'],
  host: {
    class: 'step-header',
    role: 'tab',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepHeaderComponent extends CdkStepHeader {
  @Input() active: boolean;
  @Input() icon: string;
  @Input() index: number;
  @Input() label: string;
  @Input() selected: boolean;
  @Input() state: string;
}
