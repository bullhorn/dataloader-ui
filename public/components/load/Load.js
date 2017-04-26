import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormUtils, FileControl } from 'novo-elements';
// import { ipcRenderer } from 'electron';
const spawn = require('child_process').spawn;
const shell = require('electron').shell;
const os = require('os');

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
        this.fileControl = new FileControl({
            key: 'file',
            name: 'file',
            label: 'File'
        });
        this.fileForm = this.formUtils.toFormGroup([this.fileControl]);

        let columns = [
            {
                title: 'Column',
                name: 'column',
                ordering: true,
                filtering: true
            }, {
                title: 'Row 1',
                name: 'row_1',
                ordering: true,
                filtering: true
            }, {
                title: 'Row 2',
                name: 'row_2',
                ordering: true,
                filtering: true
            }, {
                title: 'Row 3',
                name: 'row_3',
                ordering: true,
                filtering: true
            }
        ];

        const TableData = [
            {
                'column': 'Victoria Cantrell',
                'row_1': 'Integer Corporation',
                'row_2': '8262',
                'row_3': 208178
            }, {
                'column': 'Pearl Crosby',
                'row_1': 'In PC',
                'row_2': '8262',
                'row_3': 114367
            }, {
                'column': 'Colette Foley',
                'row_1': 'Lorem Inc.',
                'row_2': '8262',
                'row_3': 721473
            }];

        this.preview = {
            columns: columns.slice(),
            rows: TableData.slice(),
            config: {
                paging: {
                    current: 1,
                    itemsPerPage: 10,
                    onPageChange: event => {
                        this.preview.config.paging.current = event.page;
                        this.preview.config.paging.itemsPerPage = event.itemsPerPage;
                    }
                },
                sorting: true,
                filtering: true,
                ordering: true,
                resizing: true,
                selectAllEnabled: true,
                rowSelectionStyle: 'checkbox'
            }
        };

        this.outputFiles = [{
            name: 'Successful Records',
            records: 103,
            filePath: 'dataloader/results/ClientCorporation_load_2017-04-26_07.25.27_success.csv',
            dateCreated: 'April 26, 7.25 AM',
            icon: 'bhi-certification'
        }, {
            name: 'Failed Records',
            records: 5,
            filePath: 'dataloader/results/ClientCorporation_load_2017-04-26_07.25.27_failure.csv',
            dateCreated: 'April 26, 7.25 AM',
            icon: 'bhi-caution'
        }, {
            name: 'Log File',
            records: 108,
            errors: 5,
            warnings: 18,
            filePath: 'dataloader/log/dataloader_2017-04-26_07.25.27.log',
            dateCreated: 'April 26, 7.25 AM',
            icon: 'bhi-note'
        }];
    }

    openFile(filePath) {
        shell.showItemInFolder(filePath);
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
