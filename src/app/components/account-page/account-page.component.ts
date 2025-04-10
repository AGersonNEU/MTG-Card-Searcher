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

  async searchCards() {
    if(this.searchQuery.trim().toLowerCase() === '') {
      this.cards = await this.mongoService.getAllCards();
    } else {
      this.cards = await this.mongoService.getCardSearch(this.searchQuery.trim().toLowerCase());
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

  async deleteCard() {
    if (this.selectedCard) {
      try {
        await this.mongoService.deleteCard(this.selectedCard.id);
        // Refresh the card list after deletion
        await this.searchCards();
        console.log('Card deleted successfully');
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
    this.closeContextMenu();
  }
}
