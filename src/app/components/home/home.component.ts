import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardAPIService } from '../../services/card-api.service';
import { Card } from '../../models/Card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private route: ActivatedRoute, private cardService: CardAPIService){
  }
  id: any = '';
  card: Card | null | void = null;
  //we need a list of pokemon to show
  async ngOnInit(){
    this.card = await this.cardService.randomCard();
  }
}
