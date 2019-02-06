import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    protected username: string;
    protected password: string;
    protected data: any;

    constructor(private loginSvc: LoginService, public alertCtrl: AlertController, private route: Router) {
    }

    ngOnInit() {
    }

    private goToSettings(): void {
        this.route.navigate(['/settings']);
    }

    protected login(): void {
        this.loginSvc.auth(this.username, this.password).subscribe(res => {
            this.data = res;

            let welcomeMsg = 'Benvenuto' + this.data.user.firstName + ' ' + this.data.user.lastName;
            this.presentAlert('Benvenuto', welcomeMsg);

            this.goToSettings();
        }, error1 => {
            if (error1.error.statusCode >= 400 && error1.error.statusCode < 500) {
                this.presentAlert('Errore Login', error1.error.retErrMsg);
            } else if (error1.error.statusCode >= 500) {
                this.presentAlert('Errore Server', 'Server non disponibile, riprova più tardi!');
            }
        });
    }

    private async presentAlert(title: string, msg: string) {
        const alert = await this.alertCtrl.create({
            header: title,
            message: msg,
            buttons: ['OK']
        });
        await alert.present();
    }

}
