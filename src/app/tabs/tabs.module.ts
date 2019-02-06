import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs.router.module';

import {TabsPage} from './tabs.page';
import {MapsPageModule} from '../maps/maps.module';
import {SearchPageModule} from '../search/search.module';
import {LoginPageModule} from '../login/login.module';
import {SettingsPageModule} from '../settings/settings.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule,
        TabsPageRoutingModule,
        MapsPageModule,
        SearchPageModule,
        LoginPageModule,
        SettingsPageModule
    ],
    declarations: [TabsPage]
})
export class TabsPageModule {
}
