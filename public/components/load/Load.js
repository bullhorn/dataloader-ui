import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormUtils, FileControl } from 'novo-elements';
// import { ipcRenderer } from 'electron';
const spawn = require('child_process').spawn;
const shell = require('electron').shell;
const os = require('os');
const csv = require("fast-csv");

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
        this.previewTable = {};
        // ipcRenderer.on('loadSample', this.open.bind(this));
        // ipcRenderer.on('save-file', this.save.bind(this));
    }

    ngOnInit() {
        this.setupForm();

        let filePath = "dataloader/examples/load/CandidateTest.csv";
        this.getCsvPreviewData(filePath, this.onFileParsed.bind(this));
    }

    getCsvPreviewData(filePath, successCallback) {
        let rowCount = 0;
        let previewData = [];
        let options = {
            headers: true
        };

        let csvStream = csv.fromPath(filePath, options)
            .on("data", function (row) {
                previewData.push(row);
                ++rowCount;
                if (rowCount >= 3) {
                    csvStream.pause();
                    csvStream.unpipe();
                    successCallback(previewData);
                }
            })
            .on("error", function (error) {
                console.log(error)
            });

        return previewData;
    }

    onFileParsed(data) {
        let columns = this.createGenericColumns(data);
        console.log('previewData:', data);
        console.log('tableColumns:', columns);
        this.previewTable.columns = columns;
        this.previewTable.rows = data;
    }

    createGenericColumns(data) {
        let columns = [];

        if (data && data['0']) {
            for (const property in data[0]) {
                columns.push({
                    title: property,
                    name: property,
                    ordering: true,
                    filtering: true
                });
            }
        }

        return columns;
    }

    setupForm() {
        this.fileControl = new FileControl({
            key: 'file',
            name: 'file',
            label: 'File'
        });
        this.fileForm = this.formUtils.toFormGroup([this.fileControl]);

        this.previewTable = {
            columns: [],
            rows: [],
            config: {
                paging: {
                    current: 1,
                    itemsPerPage: 10,
                    onPageChange: event => {
                        this.previewTable.config.paging.current = event.page;
                        this.previewTable.config.paging.itemsPerPage = event.itemsPerPage;
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

    loadSample() {
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

    cancel() {
        // TODO
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
