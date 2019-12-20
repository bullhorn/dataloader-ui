// Angular
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-status',
  template: `
    <div class="stepper-status-line" [ngClass]="state"></div>
    <div [ngSwitch]="state" class="stepper-status-icon">
      <novo-icon color="positive" *ngSwitchCase="'edit'">check-circle</novo-icon>
      <novo-icon color="positive" *ngSwitchCase="'done'">check-circle-filled</novo-icon>
      <novo-icon color="positive" *ngSwitchDefault>circle-o</novo-icon>
    </div>`,
  styleUrls: ['step-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepStatusComponent {
  @Input() state: string;
}
