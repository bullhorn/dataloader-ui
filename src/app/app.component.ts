// Angular
import { Component, ViewContainerRef } from '@angular/core';
// Vendor
import { NovoModalService } from 'novo-elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showResults: boolean = false;

  constructor(private modalService: NovoModalService,
              private view: ViewContainerRef) {
    this.modalService.parentViewContainer = this.view;
  }
}
