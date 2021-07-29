// Angular
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CdkStep, CdkStepLabel, CdkStepper} from '@angular/cdk/stepper';
import {FocusableOption} from '@angular/cdk/a11y';
// Vendor
import {takeUntil} from 'rxjs/operators';
// App
import {StepHeaderComponent} from './step-header.component';
import {Run} from '../../../interfaces';

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
  @Input() run: Run;
  @Output() cliActionChange = new EventEmitter<string>();
  // The list of step headers of the steps in the stepper
  @ViewChildren(StepHeaderComponent) _stepHeader: QueryList<FocusableOption>;

  // Steps that the stepper holds
  @ContentChildren(StepComponent) _steps: QueryList<StepComponent>;

  cliActionValue = 'load';
  cliActionOptions: Array<any> = [
    {
      label: 'Load',
      value: 'load'
    },
    {
      label: 'Parse',
      value: 'parseResumes'
    }
  ];


  // Consumer-specified template-refs used to override the header icons
  _iconOverrides: { [key: string]: TemplateRef<any> } = {};

  get completed(): boolean {
    try {
      const steps = this._steps.toArray();
      const lastIndex = steps.length - 1;
      return steps[lastIndex].completed && lastIndex === this.selectedIndex;
    } catch (err) {
      return false;
    }
  }

  // Mark the component for change detection whenever the content children query changes
  ngAfterContentInit() {
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

  handleChange(event): void {
    console.log('event');
    console.log(event);
    this.cliActionChange.emit(this.cliActionValue);
  }
}
