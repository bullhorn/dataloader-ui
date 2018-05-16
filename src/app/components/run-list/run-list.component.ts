// Angular
import { Component, EventEmitter, Input, Output } from '@angular/core';
// App
import { IRun } from '../../../interfaces/IRun';

@Component({
  selector: 'app-run-list',
  templateUrl: './run-list.component.html',
  styleUrls: ['./run-list.component.scss'],
})
export class RunListComponent {
  @Input() runs: IRun[];
  @Input() currentRun: IRun | null = null;
  @Input() selectedRun: IRun | null = null;
  @Output() selectedRunChanged = new EventEmitter<IRun>();

  runClicked(index: number): void {
    this.selectedRun = this.runs[index];
    this.selectedRunChanged.emit(this.selectedRun);
  }

  clearSelectedRun(): void {
    this.selectedRun = null;
    this.selectedRunChanged.emit(this.selectedRun);
  }
}
