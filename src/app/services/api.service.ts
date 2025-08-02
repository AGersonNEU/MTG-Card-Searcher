import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Card } from '../models/Card';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  async addCard(card: Card): Promise<Card> {
    // Always set quantity to 1 when adding cards from Scryfall
    const cardData = {
      ...card,
      quantity: 1
    };
    
    const response = 
      await this.http.post<{ success: boolean; card: Card }>
      (`${this.apiUrl}/addCard`, cardData).toPromise();
    if (!response?.card) {
      throw new Error('Failed to add card');
    }
    return response.card;
  }

  async getCardSearch(searchQuery: string): Promise<Card[]> {
    try {
      const response = 
        await this.http.get<{ success: boolean; cards: Card[] }>
        (`${this.apiUrl}/searchCards?searchQuery=${encodeURIComponent(searchQuery)}`).toPromise();
      console.log("Cards found: ",response?.cards);
      return response?.cards || [];
    } catch (error) {
      console.error('Error searching cards:', error);
      return [];
    }
  }

  async getAllCards(): Promise<Card[]> {
    try {
      const response = await this.http.get<{ success: boolean; cards: Card[] }>(`${this.apiUrl}/getAllCards`).toPromise();
      console.log("All cards from MongoDB:", response?.cards);
      return response?.cards || [];
    } catch (error) {
      console.error('Error getting all cards:', error);
      return [];
    }
  }

  async deleteCard(cardId: string): Promise<any> {
    try {
      const response = await this.http.delete(`${this.apiUrl}/deleteCard`, { body: { id: cardId } }).toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }

  // Example method to test the connection
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }
} 