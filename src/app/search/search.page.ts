import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {MapsPage} from '../maps/maps.page';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    mapItems: any = [];
    backupItems: any = [];

    constructor(public mapSvc: MapService, private router: Router, private route: ActivatedRoute) {
        this.initializeMapItems();
    }

    ngOnInit() {
    }

    public initializeMapItems(): void {
        let tmpRe: any[] = [];
        this.mapSvc.fetchMap().subscribe(
            (mapRe) => {
                tmpRe = mapRe;
            },
            (err) => {
                console.dir(err);
            },
            () => {
                this.mapItems = tmpRe;
                this.backupItems = tmpRe;
            }
        );

    }

    public getLowerCaseString(toConvert: string): string {
        return toConvert.trim().toLowerCase();
    }

    public resetSearch(): void {
        this.mapItems = this.backupItems;
    }

    public getMapItems(typeEvent: any): any {
        this.resetSearch();

        let val = typeEvent.target.value;

        if (val && val.trim() !== '') {
            val = this.getLowerCaseString(val);
            this.mapItems = this.mapItems.filter((aula) => {
                if ((aula.Nome.toLowerCase().includes(val)) || (aula.IDAula.toLowerCase().includes(val))
                    || (aula.Alt && aula.Alt.toLowerCase().includes(val))) {
                    return aula.Nome;
                }
            });
        }
    }

    public refreshCoords(toRefresh: string): string {
        let coordArray = toRefresh.split(',').map(Number);

        coordArray.forEach(function (coord, coordIndex, coordArray) {
            if (coordIndex % 2 === 0) {
                //Usiamo PianoTerraImg come riferimento per tutte le immagini poichè hanno la stessa dimensione 800x800
                coordArray[coordIndex] = Math.round((coordArray[coordIndex] * document.getElementById('content').clientWidth) / MapsPage.WIDTH);
            } else {
                coordArray[coordIndex] = Math.round((coordArray[coordIndex] * document.getElementById('content').clientHeight) / MapsPage.HEIGHT);
            }
        });
        return coordArray.toString();
    }

    public goToDetails(aula: any): void {
        let navExtras: NavigationExtras = {
            relativeTo: this.route,
            queryParams: {
                'nomeAula': aula.Nome,
                'pianoAula': aula.Piano,
                'idAula': aula.IDAula,
                'coords': this.refreshCoords(aula.Coords)
            }
        };
        this.router.navigate(['/details/'], navExtras).catch(e => {
            console.dir(e);
        });
    }
}
