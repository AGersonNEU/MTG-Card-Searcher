import { Injectable } from '@angular/core';
import { Card } from '../models/Card';

@Injectable({
  providedIn: 'root'
})
export class CardAPIService {

  constructor() { }

  async getCardSearch(searchQuery: string){
    let cards: Card[] = [];

    let url = `https://api.scryfall.com/cards/search?order=name&unique=cards&q=${searchQuery}`;

    let result = await fetch(url);
    let data = await result.json();

    for(let card of data.data ){
      if(!card.image_uris){
        continue;
      }
      console.log("Card: ",card);
      let newCard={
        id: card.id,
        name: card.name,
        image: card.image_uris.png,
        cost: card.prices.usd,
        set: card.set_name,
        colors: card.colors,
        commander: card.legalities.commander,
        standard: card.legalities.standard,
        modern: card.legalities.modern,
        duel: card.legalities.duel,
        releaseDate: card.released_at,
        quantity: 0
      } 

      switch(newCard.colors){
        //blue
        case 'U':
          newCard.colors = 'Blue';
          break;
        //red
        case 'R':
          newCard.colors = 'Red';
          break;
        //black
        case 'B':
          newCard.colors = 'Black';
          break;
        //green
        case 'G':
          newCard.colors = 'Green';
          break;
        //white
        case 'W':
          newCard.colors = 'white';
          break;
      }

      cards.push(newCard);
    }

    return cards;
  }

  async getCardById(cardId: string){
    let url = `https://api.scryfall.com/cards/${cardId}`;

    let result = await fetch(url);
    let data = await result.json();
    
    let newCard={
      id: data.id,
      name: data.name,
      image: data.image_uris.png,
      cost: data.prices.usd,
      set: data.set_name,
      colors: data.colors,
      commander: data.legalities.commander,
      standard: data.legalities.standard,
      modern: data.legalities.modern,
      duel: data.legalities.duel,
      releaseDate: data.released_at,
      quantity: 0
    } 

    return newCard;
  }

  async randomCard(){
    let url = "https://api.scryfall.com/cards/random";

    let result = await fetch(url);
    let data = await result.json();
    
    let newCard={
      id: data.id,
      name: data.name,
      image: data.image_uris.png,
      cost: data.prices.usd,
      set: data.set_name,
      colors: data.colors,
      commander: data.legalities.commander,
      standard: data.legalities.standard,
      modern: data.legalities.modern,
      duel: data.legalities.duel,
      releaseDate: data.released_at,
      quantity: 0
    } 

    return newCard;
  }
}
