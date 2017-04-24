import {Component, OnInit, FormGroup, FormControl} from '@angular/core';
import {FormUtils, TextBoxControl} from 'novo-elements';

@Component({
    selector: 'settings',
    template: require('./Settings.html')
})
export class Settings implements OnInit {
    constructor(formUtils: FormUtils) {
        this.formUtils = formUtils;
    }

    ngOnInit() {
        this.setupForm();
    }

    setupForm() {
        this.formControls = {
            usernameControl: new TextBoxControl({
                type: 'text',
                label: 'Username',
                value: '',
                required: true,
                key: 'username'
            }),
            passwordControl: new TextBoxControl({
                type: 'text',
                label: 'Password',
                value: '',
                required: true,
                key: 'password'
            }),
            clientIdControl: new TextBoxControl({
                type: 'text',
                label: 'Client ID',
                value: '',
                required: true,
                key: 'clientId'
            }),
            clientSecretControl: new TextBoxControl({
                type: 'text',
                label: 'Client Secret',
                value: '',
                required: true,
                key: 'clientSecret'
            })
        };

        this.form = this.formUtils.toFormGroup([this.formControls.usernameControl, this.formControls.passwordControl, this.formControls.clientIdControl, this.formControls.clientSecretControl]);
    }

    save() {
    }
}
