// NG2
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Vendor
import { NovoElementsModule } from 'novo-elements';
// APP
import { Header, Sidebar } from './all';


const COMPONENTS = [
    Header,
    Sidebar
];

@NgModule({
    imports: [CommonModule, FormsModule, NovoElementsModule],
    declarations: [...COMPONENTS],
    entryComponents: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class ComponentsModule {
}
