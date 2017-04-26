import { Component, OnInit } from '@angular/core';
import { FormUtils, TextBoxControl, TilesControl } from 'novo-elements';

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
            }),
            dataCenterControl: new TilesControl({
                key: 'dataCenter',
                label: 'Data Center',
                value: 'east',
                required: false,
                options: [
                    {
                        label: 'US-East',
                        value: 'east'
                    },
                    {
                        label: 'US-West',
                        value: 'west'
                    },
                    {
                        label: 'US-BHNext',
                        value: 'bhnext'
                    },
                    {
                        label: 'UK',
                        value: 'uk'
                    },
                    {
                        label: 'Other',
                        value: 'other'
                    }
                ]
            }),
            listDelimiterControl: new TextBoxControl({
                type: 'text',
                label: 'List Delimiter',
                value: ';',
                required: true,
                key: 'listDelimiter'
            }),
            dateFormatControl: new TextBoxControl({
                type: 'text',
                label: 'Date Format',
                value: 'MM/dd/yy HH:mm',
                required: true,
                key: 'dateFormat'
            })
        };

        this.form = this.formUtils.toFormGroup([this.formControls.usernameControl, this.formControls.passwordControl, this.formControls.clientIdControl, this.formControls.clientSecretControl, this.formControls.dataCenterControl, this.formControls.listDelimiterControl, this.formControls.dateFormatControl]);
    }

    save() {
    }
}
