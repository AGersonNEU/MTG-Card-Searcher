import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Card } from '../../models/Card';
import { CardAPIService } from '../../services/card-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent {
  constructor(private route: ActivatedRoute, private cardService: CardAPIService){
  }
  searchQuery: string = '';
  cards: Card[] = [];
  //we need a list of pokemon to show
  async searchCards(){
    if(this.searchQuery.trim() != ''){
      this.cards = await this.cardService.getCardSearch(this.searchQuery);
    }
    
  }
}
