import {Component, OnInit} from '@angular/core';
import {DetailService} from '../../services/detail.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HighlightService} from '../../services/highlight.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

    public nomeAula: string;
    public pianoAula: string;
    public idAula: string;
    public coordsAula: string;
    public activities: any = [];

    constructor(public detailSvc: DetailService, private route: ActivatedRoute,
                private router: Router, private highSvc: HighlightService) {
    }

    ngOnInit() {
        this.updateRoomName();
        this.loadDetails(this.nomeAula);
    }

    public locate(): void {
        this.highSvc.setHighlightable(this.nomeAula, this.pianoAula, this.idAula, this.coordsAula, true);
        this.router.navigate(['../tabs/maps'], {relativeTo: this.route}).catch(e => {
            console.dir(e);
        });
    }

    private updateRoomName(): void {
        this.route.queryParams.subscribe(params => {
            this.nomeAula = params['nomeAula'];
            this.pianoAula = params['pianoAula'];
            this.idAula = params['idAula'];
            this.coordsAula = params['coords'];
        });
    }

    public getShortDescr(longDescription: string): string {
        return longDescription.split('(')[0];
    }

    public getTime(date: string): string {
        return date.slice(11, 16);
    }

    /*
    public getDuration(item: any): string {
        if (!item.start || !item.end) {
            console.dir('ERRORE');
        } else {
            let startHour;
            let endHour;
            let duration;

            startHour = Number.parseInt(item.start.slice(11, 13));
            endHour = Number.parseInt(item.end.slice(11, 13));
            duration = endHour - startHour;

            return duration + 'h';
        }
    }
    */

    public loadDetails(aula: string): void {
        let tmpRe: any[] = [];
        this.detailSvc.fetchDetailByAula(aula).subscribe(
            (re) => {
                tmpRe = re;
            },
            (err) => {
                console.dir(err);
            },
            () => {
                this.activities = tmpRe;
            }
        );
    }


}
