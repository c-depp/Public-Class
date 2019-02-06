import {Component, OnInit, ViewChild} from '@angular/core';
import {MapService} from '../../services/map.service';
import {IonSlides} from '@ionic/angular';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {HighlightService} from '../../services/highlight.service';
import {QRScanner} from '@ionic-native/qr-scanner/ngx';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.page.html',
    styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

    private static SUB_FLOOR = 'P. Seminterrato';
    private static GROUND_FLOOR = 'P. Terra';
    private static FIRST_FLOOR = 'P. Primo';
    public static HEIGHT = 800;
    public static WIDTH = 800;
    private static HIGHLIGHT_OFFSET = 2;
    protected slideTitle: string;
    protected firstFloorAreas: any;
    protected groundFloorAreas: any;
    protected subFloorAreas: any;
    protected showHighlight: boolean = false;

    constructor(private mapSvc: MapService, private router: Router,
                private route: ActivatedRoute, private highSvc: HighlightService,
                private scanner: QRScanner) {
        this.updateMap();
    }

    @ViewChild(IonSlides) slides: IonSlides;

    sliderOpts = {
        zoom: {
            toggle: false
        },
        initialSlide: 1
    };

    ngOnInit() {
        this.updateSlideTitle();
        this.onHighlightIntent();
    }

    private highlight(slideIndex: number, slideTitle: string, highlightable: any, highlightElem: string, highlightDuration: number): void {
        this.slides.slideTo(slideIndex);
        this.slideTitle = slideTitle;

        let tmpCoordArray = highlightable.lastCoords.split(',').map(Number);
        tmpCoordArray[0] = tmpCoordArray[0] + MapsPage.HIGHLIGHT_OFFSET;
        tmpCoordArray[1] = tmpCoordArray[1] + MapsPage.HIGHLIGHT_OFFSET;
        document.getElementById(highlightElem).setAttribute('style',
            'left: ' + tmpCoordArray[0] + 'px !important; ' +
            'top: ' + tmpCoordArray[1] + 'px !important;');
        this.showHighlight = true;

        setTimeout(() => {
            this.showHighlight = false;
        }, highlightDuration);

    }


    private onHighlightIntent(): void {
        this.highSvc.getIntent().subscribe((intent) => {
                console.dir(intent);
                if (intent === true) {
                    let highlightable = this.highSvc.getHighlightable();

                    switch (highlightable.lastFloor) {
                        case 'PP':
                            this.highlight(0, MapsPage.FIRST_FLOOR, highlightable,
                                'highlight0', 4000);

                            break;
                        case 'PT':
                            this.highlight(1, MapsPage.GROUND_FLOOR, highlightable,
                                'highlight1', 4000);

                            break;
                        case 'PS':

                            this.highlight(2, MapsPage.SUB_FLOOR, highlightable,
                                'highlight2', 4000);

                            break;
                        default:
                    }

                }
            },
            (err) => {
                console.dir(err);
            });

    }

    private updateSlideTitle(): void {
        this.slides.ionSlideDidChange.subscribe(() => {
            this.slides.getActiveIndex().then((index) => {
                switch (index) {
                    case 0:
                        this.slideTitle = MapsPage.FIRST_FLOOR;
                        break;
                    case 1:
                        this.slideTitle = MapsPage.GROUND_FLOOR;
                        break;
                    case 2:
                        this.slideTitle = MapsPage.SUB_FLOOR;
                        break;
                    default:
                        console.dir('ERRORE');
                }
            });
        });
    }

    private filterByFloor(filter: string, toFilter: any[]): any[] {
        let filteredAreas: any[] = [];
        for (let area of toFilter) {
            if (area.Piano === filter) {
                filteredAreas.push(area);
            }
        }
        return filteredAreas;
    }

    protected refreshCoords(toRefresh: string): string {
        let coordArray = toRefresh.split(',').map(Number);

        coordArray.forEach(function (coord, coordIndex, coordArray) {
            if (coordIndex % 2 === 0) {
                //Usiamo PianoTerraImg come riferimento per tutte le immagini poichè hanno la stessa dimensione 800x800
                coordArray[coordIndex] = Math.round((coordArray[coordIndex] * document.getElementById('PianoTerraImg').clientWidth) / MapsPage.WIDTH);
            } else {
                coordArray[coordIndex] = Math.round((coordArray[coordIndex] * document.getElementById('PianoTerraImg').clientHeight) / MapsPage.HEIGHT);
            }
        });
        return coordArray.toString();
    }

    private updateMap(): void {
        let tmpRe: any[] = [];
        this.mapSvc.fetchMap().subscribe(
            (mapRe) => {
                tmpRe = mapRe;
            },
            (err) => {
                console.dir(err);
            },
            () => {
                this.firstFloorAreas = this.filterByFloor('PP', tmpRe);
                this.groundFloorAreas = this.filterByFloor('PT', tmpRe);
                this.subFloorAreas = this.filterByFloor('PS', tmpRe);
            }
        );
    }

    public onClick(area: any): void {
        let navExtras: NavigationExtras = {
                relativeTo: this.route,
                queryParams: {
                    'nomeAula': area.Nome,
                    'pianoAula': area.Piano,
                    'idAula': area.IDAula,
                    'coords': this.refreshCoords(area.Coords)
                }
            }
        ;
        this.router.navigate(['/details/'], navExtras);
    }

    public scanQR(): void {

        this.scanner.show().then(() => {
            this.scanner.scan().subscribe((qrData) => {
                let parseData = JSON.parse(qrData['result']);
                console.dir(parseData);
                if (parseData.hasOwnProperty('Nome')) {
                    let navExtras: NavigationExtras = {
                        relativeTo: this.route,
                        queryParams: {
                            'nomeAula': parseData.Nome,
                            'pianoAula': parseData.Piano,
                            'idAula': parseData.IDAula,
                            'coords': this.refreshCoords(parseData.Coords)
                        }};
                    this.router.navigate(['/details/'], navExtras);
                }},
                (err) => {
                    console.dir(err);
                });
        });


    }

}
