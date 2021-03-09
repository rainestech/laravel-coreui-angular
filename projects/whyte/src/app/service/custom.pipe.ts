import {ChangeDetectorRef, Inject, LOCALE_ID, NgModule, NgZone, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {DatePipe, NgLocalization} from "@angular/common";

@Pipe({ name: 'reverse' })

export class ReversePipe implements PipeTransform {
    transform(value) {
        return value.slice().reverse();
    }
}

@Pipe({ name: 'dayAgo' })

export class DayAgoPipe extends DatePipe {
    transform(value) {
        const dateAng = super.transform(value);
        let d = new Date(value);
        let now = new Date();
        let seconds = Math.round(Math.abs((now.getTime() - d.getTime())/1000));
        let minutes = Math.round(Math.abs(seconds / 60));
        let hours = Math.round(Math.abs(minutes / 60));

        if (Number.isNaN(seconds)) {
            return 'Today';
        } else if (hours < 25) {
            return 'Today';
        } else if (hours > 24 && hours <= 48) {
            return 'Yesterday';
        } else {
            return dateAng;
        }
    }
}

@Pipe({
    name:'timeAgo',
    pure:false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
    private timer: number;

    constructor(@Inject( LOCALE_ID ) private locale: string, private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {}

    transform(value: string | Date) {
        this.removeTimer();
        let d = new Date(value);
        let now = new Date();
        let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
        let timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;
        this.timer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.ngZone.run(() => this.changeDetectorRef.markForCheck());
                }, timeToUpdate);
            }
            return null;
        });
        let minutes = Math.round(Math.abs(seconds / 60));
        let hours = Math.round(Math.abs(minutes / 60));
        if (Number.isNaN(seconds)) {
            return 'now';
        } else if (seconds <= 45) {
            return 'a few seconds ago';
        } else if (seconds <= 90) {
            return 'a minute ago';
        } else if (minutes <= 45) {
            return minutes + ' minutes ago';
        } else if (hours <= 24) {
            return d.getHours() + ':' + d.getMinutes();
        } else {
            return new DatePipe(this.locale).transform(value) + ' at ' + d.getHours() + ':' + d.getMinutes();
        }
    }

    ngOnDestroy(): void {
        this.removeTimer();
    }

    private removeTimer() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private getSecondsUntilUpdate(seconds: number) {
        let min = 60;
        let hr = min * 60;
        let day = hr * 24;
        if (seconds < min) { // less than 1 min, update every 2 secs
            return 2;
        } else if (seconds < hr) { // less than an hour, update every 30 secs
            return 30;
        } else if (seconds < day) { // less then a day, update every 5 mins
            return 300;
        } else { // update every hour
            return 3600;
        }
    }
}



@NgModule({
    declarations: [ReversePipe, TimeAgoPipe, DayAgoPipe],
    exports: [
        ReversePipe,
        DayAgoPipe,
        TimeAgoPipe
    ],
    imports: []
})
export class CustomPipe { }
