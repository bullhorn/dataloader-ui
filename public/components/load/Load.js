import {Component, OnInit, ChangeDetectorRef, FormGroup, FormControl} from '@angular/core';
import {FormUtils, FileControl, CheckboxControl} from 'novo-elements';
import {remote, ipcRenderer} from 'electron';
const spawn = require('child_process').spawn;

@Component({
    selector: 'load',
    template: require('./Load.html')
})
export class Load implements OnInit {
    constructor(changeRef: ChangeDetectorRef, formUtils: FormUtils) {
        this.app = 'dataloader';
        this.response = 'nothing yet';
        this.changeRef = changeRef;
        this.formUtils = formUtils;
        // ipcRenderer.on('loadSample', this.open.bind(this));
        // ipcRenderer.on('save-file', this.save.bind(this));
    }

    ngOnInit() {
        this.setupForm();
    }

    setupForm() {
        this.fileControl = new FileControl({key: 'file', name: 'myfile', label: 'File'});
        this.bhNext = new CheckboxControl({key: 'check', label: 'BH Next'});
        this.fileForm = this.formUtils.toFormGroup([this.fileControl, this.bhNext]);
    }

    loadSample(form) {
        debugger;
        this.response = 'loading';
        process.chdir('dataloader');

        const basic_load = spawn('./dataloader', ['help']);

        basic_load.stdout.on('data', this.captureResponse.bind(this));
        basic_load.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        basic_load.stderr.on('data', this.captureResponse.bind(this));
        basic_load.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        basic_load.on('close', function (code) {
            console.log('closing code: ' + code);
            debugger;
            response = code;
            //Here you can get the exit code of the script
        });

        // const ls = spawn('ls');
        //
        // ls.stdout.on('data', this.captureResponse.bind(this));
        //
        // ls.stderr.on('data', (data) => {
        //     console.log(`stderr: ${data}`);
        // });
    }

    captureResponse(code) {
        let myNotification;
        myNotification = new Notification('LS response', {
            body: code
        });
        this.response = code.toString();
        this.changeRef.detectChanges();
    }

}
