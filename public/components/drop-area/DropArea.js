import { Component } from '@angular/core';

@Component({
    selector: 'drop-area',
    template: require('./DropArea.html')
})
export class DropArea {
    constructor() {
    }
}

// // NG2
// import { Component } from '@angular/core';
// // APP
// import { MasterPageSDK, UrlService } from '../../services';
// import { PageSDK } from 'bh-elements';
// import { TranslateService } from 'chomsky-ng2';
// import { BhFile } from '../../../resources/utils/Utils';
// import { BaseDropArea } from '../../../resources/components/drop-area/DropArea';
// import { ParseUtils } from '../../../resources/utils/parse-utils/ParseUtils';
//
// @Component({
//     selector: 'bowling-alley-droparea',
//     templateUrl: './DropArea.html'
// })
// export class DropArea extends BaseDropArea {
//     waitTime: Number = 3600;
//     stageCls: String = '';
//     num: String = '0%';
//     description: String = TranslateService.translate('FILES.UPLOADING');
//     target: any;
//     message = TranslateService.translate('FILES.DRAG_AND_DROP_RESUME');
//
//     constructor(protected pageSDK: PageSDK, private masterPageSDK: MasterPageSDK, private urls: UrlService) {
//         super(pageSDK);
//         this.selector = 'mainframe';
//     }
//
//     upload(file) {
//         //upload
//         if (file) {
//             this.loading = true;
//             this.message = '';
//             let resume = {
//                 contents: new BhFile(file),
//                 type: 'drop'
//             };
//             resume.contents.read();
//             let parseOptions = {
//                 endpoints: this.endpoints,
//                 uploadProgress: this.uploadProgress.bind(this)
//             };
//             return ParseUtils.parse(file, parseOptions).then((result: any) => {
//                 if (result && result.candidate) {
//                     let candidate = ParseUtils.formatCandidate(result);
//                     let next = ParseUtils.createNextArray(result, this.pageSDK.store.settings, resume);
//                     this.masterPageSDK.send('open', {
//                         type: 'Content',
//                         app: 'fast-add',
//                         entityType: 'Candidate',
//                         data: candidate,
//                         next: next
//                     });
//                     this._reset();
//                 } else {
//                     this._fail(event);
//                 }
//             }).catch((err) => { this._fail(err); });
//         }
//     }
//
//     _fail(err) {
//         let message = err.errorMessage;
//         try {
//             let response = JSON.parse(err.target.response);
//             message = response.errorMessage;
//         } catch (err) {
//             //do nothing
//         }
//         this.stageCls = 'fail';
//         this.num = TranslateService.translate('FILES.ERROR');
//         this.description = TranslateService.translate('FILES.UPLOAD_FAILED');
//         this.message = message;
//         this._reset();
//     }
//
//     _reset() {
//         setTimeout(() => {
//             this.loading = false;
//             this.stageCls = '';
//             this.num = '0%';
//             this.description = TranslateService.translate('FILES.UPLOADING');
//             this.message = TranslateService.translate('FILES.DRAG_AND_DROP_RESUME');
//         }, this.waitTime);
//     }
//
//     uploadProgress(e) { // upload process in progress
//         if (e.lengthComputable) {
//             let iPercentComplete = Math.round(e.loaded * 100 / e.total);
//             this.stageCls = `progress-${iPercentComplete}`;
//             this.num = `${iPercentComplete}%`;
//             if (iPercentComplete === 100) {
//                 this.stageCls = 'full';
//                 this.description = TranslateService.translate('FILES.UPLOAD_COMPLETE');
//             }
//         } else {
//             this.stageCls = 'progress-50';
//         }
//     }
// }
