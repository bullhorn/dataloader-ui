import { Component } from '@angular/core';

@Component({
    selector: 'bowling-alley',
    template: require('./BowlingAlley.html')
})
export class BowlingAlley {
    constructor() {
    }
}

//
// import { Component, EventEmitter, Output } from '@angular/core';
// // import { WindowManager, MasterPageSDK } from '../../services';
//
// @Component({
//     selector: 'bowlingalley',
//     templateUrl: './BowlingAlley.html'
// })
// export class BowlingAlley {
//     @Output() tabsClosed: EventEmitter<any> = new EventEmitter();
//
//     WindowManager: any = WindowManager;
//     loadingLabel: string = TranslateService.translate('LABELS.LOADING');
//
//     constructor(private slideOut: SlideOut, private pageSDK: MasterPageSDK) { }
//
//     /**
//      * Closes a window
//      * @param {String|Number} uuid - uuid of the window
//      */
//     closeWindow(uuid) {
//         this.pageSDK.send('close', { uuid });
//     }
//
//     /**
//      * Makes the window the active window
//      * @param {String|Number} uuid - uuid of the window
//      */
//     makeWindowActive(uuid) {
//         this.slideOut.closeSlideOut();
//         WindowManager.activateWindow(uuid);
//     }
//
//     /**
//      * Closes all the active windows
//      */
//     closeAllWindows() {
//         this.pageSDK.closeAllWindows();
//         this.tabsClosed.next(true);
//     }
//
//     titleManager(titleKey) {
//         let windowTitle = this.pageSDK.store.settings[titleKey];
//         switch (titleKey) {
//             case 'entityTitleAppointmentTemplate':
//             case 'entityTitleEmailTemplate':
//             case 'entityTitleMessageTemplate':
//             case 'entityTitleNoteTemplate':
//             case 'entityTitleSignatureTemplate':
//             case 'entityTitleSubmissionTemplate':
//             case 'entityTitleTaskTemplate':
//             case 'entityTitleShortList':
//                 windowTitle = this.pageSDK.store.settings[`${titleKey}Many`];
//                 break;
//             default:
//                 break;
//         }
//         return windowTitle;
//     }
// }
