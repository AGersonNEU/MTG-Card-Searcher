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
  showNotification = false;
  notificationMessage = '';
  notificationTimeout: any;

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

  showCardAddedNotification(cardName: string) {
    this.notificationMessage = `${cardName} was added to bulk`;
    this.showNotification = true;
    
    // Clear any existing timeout
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    
    // Hide notification after 3 seconds
    this.notificationTimeout = setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  async addToMongoDB(card?: Card) {
    const cardToAdd = card || this.selectedCard;
    if (cardToAdd) {
      try {
        await this.apiService.addCard(cardToAdd);
        this.showCardAddedNotification(cardToAdd.name);
        console.log('Card added to MongoDB');
      } catch (error) {
        console.error('Error adding card to MongoDB:', error);
      }
    }
    this.closeContextMenu();
  }
}
