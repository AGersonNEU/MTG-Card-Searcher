import { Routes } from '@angular/router';
import { CardListComponent } from './components/card-list/card-list.component';
import { HomeComponent } from './components/home/home.component';
import { CardComponent } from './components/card/card.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: "searchCards", component: CardListComponent},
    {path: 'searchCards/:id', component: CardComponent}
];
