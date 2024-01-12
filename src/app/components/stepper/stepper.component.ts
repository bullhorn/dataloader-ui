// Angular
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, forwardRef, Inject, Input, QueryList, ViewChildren } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkStep, CdkStepLabel, CdkStepper } from '@angular/cdk/stepper';
// Vendor
import { takeUntil } from 'rxjs/operators';
// App
import { StepHeaderComponent } from './step-header.component';

/**
 * The step resides here with the stepper to avoid circular dependencies
 */
@Component({
  selector: 'app-step',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepComponent extends CdkStep {
  @ContentChild(CdkStepLabel, { static: false }) stepLabel: CdkStepLabel;

  @Input() icon: string;

  constructor(@Inject(forwardRef(() => StepperComponent)) stepper: CdkStepper) {
    super(stepper);
  }
}

/**
 * The stepper extends the CdkStepper that contains the state machine
 */
@Component({
  selector: 'app-stepper',
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.scss'],
  animations: [trigger('stepTransition', [
    state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
    state('current', style({ transform: 'none', visibility: 'visible' })),
    state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
    transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
  ])],
  host: {
    class: 'stepper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent extends CdkStepper implements AfterContentInit {
  // The list of step headers of the steps in the stepper
  @ViewChildren(StepHeaderComponent) _stepHeader: QueryList<StepHeaderComponent>;

  // Full list of steps inside the stepper, including inside nested steppers.
  @ContentChildren(StepComponent, { descendants: true }) _steps: QueryList<StepComponent>;

  // Steps that belong to the current stepper, excluding ones from nested steppers.
  steps: QueryList<StepComponent> = new QueryList<StepComponent>();

  get completed(): boolean {
    try {
      const steps = this._steps.toArray();
      const lastIndex = steps.length - 1;
      return steps[lastIndex].completed && lastIndex === this.selectedIndex;
    } catch (err) {
      return false;
    }
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    // Mark the component for change detection whenever the content children query changes
    this._steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => this._stateChanged());
  }

  complete() {
    try {
      const steps = this._steps.toArray();
      steps[this.selectedIndex].completed = true;
      this.next();
      this._stateChanged();
    } catch (err) {
      // do nothing
    }
  }

  getIndicatorType(index: number): 'none' | 'edit' | 'done' {
    const steps = this._steps.toArray();
    if (index === this.selectedIndex) {
      if (steps[index] && index === steps.length - 1 && steps[index].completed) {
        return 'done';
      }
      return 'edit';
    }
    if (index < this.selectedIndex) {
      return 'done';
    }
    return 'none';
  }
}
