import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Card } from '../../models/Card';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.css'
})

export class AccountPageComponent {
  constructor(private route: ActivatedRoute, private mongoService: ApiService) {
  }
  searchQuery: string = '';
  cards: Card[] = [];
  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedCard: Card | null = null;
  notificationMessage: string = '';
  showNotification: boolean = false;
  private notificationTimeout: any;

  async searchCards() {
    if(this.searchQuery.trim().toLowerCase() === '') {
      this.cards = await this.mongoService.getAllCards();
      console.log("Cards from MongoDB:", this.cards);
    } else {
      this.cards = await this.mongoService.getCardSearch(this.searchQuery.trim().toLowerCase());
      console.log("Cards from search:", this.cards);
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

  showCardDeletedNotification(cardName: string) {
    this.notificationMessage = `${cardName} was removed from bulk`;
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

  async deleteCard(card: Card) {
    try {
      const response = await this.mongoService.deleteCard(card.id);
      
      // Check if quantity was reduced or card was deleted
      if (response && response.message === 'Card quantity reduced') {
        this.notificationMessage = `${card.name} quantity reduced`;
      } else {
        this.notificationMessage = `${card.name} was removed from bulk`;
      }
      
      this.showNotification = true;
      
      // Clear any existing timeout
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
      
      // Hide notification after 3 seconds
      this.notificationTimeout = setTimeout(() => {
        this.showNotification = false;
      }, 3000);
      
      // Refresh the card list after deletion
      await this.searchCards();
      console.log('Card deleted successfully');
    } catch (error) {
      console.error('Error deleting card:', error);
    }
    this.closeContextMenu();
  }
}
