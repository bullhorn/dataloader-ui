// NG2
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
    Header,
    Load,
    Settings
];

@NgModule({
    imports: [CommonModule, FormsModule, NovoElementsModule, RouterModule],
    declarations: [...COMPONENTS],
    entryComponents: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class ComponentsModule {
}
