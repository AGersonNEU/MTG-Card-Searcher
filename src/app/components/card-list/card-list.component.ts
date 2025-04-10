import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Card } from '../../models/Card';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CardAPIService } from '../../services/card-api.service';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent {
  constructor(
    private cardService: CardAPIService,
    private apiService: ApiService
  ) {}

  searchQuery: string = '';
  cards: Card[] = [];
  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedCard: Card | null = null;

  async searchCards() {
    if(this.searchQuery.trim().toLowerCase() != '') {
      this.cards = await this.cardService.getCardSearch(this.searchQuery.trim().toLowerCase());
    }
  }

  onContextMenu(event: MouseEvent, card: Card) {
    event.preventDefault();
    this.selectedCard = card;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.showContextMenu = true;
  }

  closeContextMenu() {
    this.showContextMenu = false;
    this.selectedCard = null;
  }

  async addToMongoDB() {
    if (this.selectedCard) {
      try {
        await this.apiService.addCard(this.selectedCard);
        console.log('Card added to MongoDB');
      } catch (error) {
        console.error('Error adding card to MongoDB:', error);
      }
    }
    this.closeContextMenu();
  }
}
