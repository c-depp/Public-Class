import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TabsPage} from './tabs.page';
import {MapsPage} from '../maps/maps.page';
import {SearchPage} from '../search/search.page';
import {LoginPage} from '../login/login.page';
import {SettingsPage} from '../settings/settings.page';


const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'maps',
                children: [{
                    path: '',
                    loadChildren: '../maps/maps.module#MapsPageModule'
                }]
            },
            {
                path: 'search',
                children: [{
                    path: '',
                    loadChildren: '../search/search.module#SearchPageModule'
                }]
            },
            {
                path: 'details',
                children: [{
                    path: '',
                    loadChildren: '../details/details.module#DetailsPageModule'
                }]
            },
            {
                path: 'login',
                children: [{
                    path: '',
                    loadChildren: '../login/login.module#LoginPageModule'
                }]
            },
            {
                path: 'settings',
                children: [{
                    path: '',
                    loadChildren: '../settings/settings.module#SettingsPageModule'
                }]
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/maps',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
