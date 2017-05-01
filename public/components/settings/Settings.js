import { Component, OnInit } from '@angular/core';
import { FormUtils, TextBoxControl, TilesControl } from 'novo-elements';
const fs = require('fs');

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
        this.formControls = [
            new TextBoxControl({
                type: 'text',
                label: 'Username',
                value: '',
                required: true,
                key: 'username'
            }),
            new TextBoxControl({
                type: 'text',
                label: 'Password',
                value: '',
                required: true,
                key: 'password'
            }),
            new TextBoxControl({
                type: 'text',
                label: 'Client ID',
                value: '',
                required: true,
                key: 'clientId'
            }),
            new TextBoxControl({
                type: 'text',
                label: 'Client Secret',
                value: '',
                required: true,
                key: 'clientSecret'
            }),
            new TilesControl({
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
            new TextBoxControl({
                type: 'text',
                label: 'List Delimiter',
                value: ';',
                required: true,
                key: 'listDelimiter'
            }),
            new TextBoxControl({
                type: 'text',
                label: 'Date Format',
                value: 'MM/dd/yy HH:mm',
                required: true,
                key: 'dateFormat'
            })
        ];

        this.form = this.formUtils.toFormGroup(this.formControls);
    }

    save() {
        console.log('this.form.value:', this.form.value);
        const settingsFile = 'settings.json';
        fs.writeFile(settingsFile, JSON.stringify(this.form.value, null, 2), function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("Saved settings to: " + settingsFile);
        });
    }
}
