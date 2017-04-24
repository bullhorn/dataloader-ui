// NG2
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Vendor
import { NovoElementsModule } from 'novo-elements';
// APP
import {
    BowlingAlley,
    DropArea,
    Header,
    Load,
    Menu,
    Settings
} from './all';

const COMPONENTS = [
    BowlingAlley,
    DropArea,
    Header,
    Load,
    Menu,
    Settings
];

@NgModule({
    imports: [CommonModule, FormsModule, NovoElementsModule],
    declarations: [...COMPONENTS],
    entryComponents: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class ComponentsModule {
}
