import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormUtils, FileControl, CheckboxControl } from 'novo-elements';
// import { ipcRenderer } from 'electron';
const spawn = require('child_process').spawn;
const shell = require('electron').shell;
const os = require('os');
const csv = require("fast-csv");
const fs = require('fs');

@Component({
    selector: 'load',
    template: require('./Load.html')
})
export class Load implements OnInit {
    @ViewChild('table') table: ElementRef;
    constructor(changeRef: ChangeDetectorRef, formUtils: FormUtils) {
        this.app = 'dataloader';
        this.response = 'nothing yet';
        this.changeRef = changeRef;
        this.formUtils = formUtils;
        this.previewTable = {};
        this.rows = [];
        this.filePath = null;
        // ipcRenderer.on('load', this.open.bind(this));
        // ipcRenderer.on('save-file', this.save.bind(this));
    }

    ngOnInit() {
        this.setupForm();
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
            .on("end", function () {
                successCallback(previewData);
            })
            .on("error", function (error) {
                console.log(error)
            });

        return previewData;
    }

    onFileParsed(data) {
        this.previewTable.rows = this.swapColumnsAndRows(data);
        this.changeRef.detectChanges();
    }

    swapColumnsAndRows(data) {
        let swapped = [];

        let rowCount = 0;
        for (const row of data) {

            let colCount = 0;
            for (const col in row) {
                if (rowCount === 0) {
                    let entry = { column: col };

                    // TODO: Logic here to create meaningful default
                    if (colCount === 0) {
                        entry.duplicateCheck = true;
                    } else {
                        entry.duplicateCheck = false;
                    }

                    swapped.push(entry);
                }
                let swappedRow = swapped[colCount];
                swappedRow['row_' + (rowCount + 1)] = row[col];
                colCount++;
            }
            rowCount++;
        }

        return swapped;
    }

    setupForm() {
        let onFileControlChange = (form) => {
            this.filePath = form.value.file[0].file.path;
            this.getCsvPreviewData(this.filePath, this.onFileParsed.bind(this));
            this.cats = true;
            // debugger;
        };

        // TODO: Only allow for a single file (not planning to support multiple in this interface)
        this.fileControl = new FileControl({
            key: 'file',
            name: 'file',
            label: 'CSV File',
            value: null,
            multiple: false,
            interactions: [{ event: 'change', script: onFileControlChange }]
        });
        this.fileForm = this.formUtils.toFormGroup([this.fileControl]);

        this.previewTable = {
            columns: [
                { title: 'Column', name: 'column', ordering: true, filtering: true },
                { title: 'Row 1', name: 'row_1', ordering: true, filtering: true },
                { title: 'Row 2', name: 'row_2', ordering: true, filtering: true },
                { title: 'Row 3', name: 'row_3', ordering: true, filtering: true }
            ],
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
                rowSelectionStyle: 'checkbox',
                sorting: true,
                filtering: true,
                ordering: true,
                resizing: true
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

    load() {
        this.response = 'Loading...';

        let settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

        let params = [];
        params = params.concat(['username', settings.username]);
        params = params.concat(['password', settings.password]);
        params = params.concat(['clientId', settings.clientId]);
        params = params.concat(['clientSecret', settings.clientSecret]);
        params = params.concat(['listDelimiter', settings.listDelimiter]);
        params = params.concat(['dateFormat', settings.dateFormat]);
        // TODO: set data center urls
        // if (params.dataCenter === 'west') {
        //     params = params.concat(['dateFormat', settings.dateFormat]);
        // }

        params = params.concat(['load', this.filePath]);

        process.chdir('dataloader');
        const basic_load = spawn('./dataloader', params);

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
            this.response = code;
            //Here you can get the exit code of the script
        });
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
