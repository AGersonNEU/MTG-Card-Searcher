import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardAPIService } from '../../services/card-api.service';
import { Card } from '../../models/Card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  constructor(private route: ActivatedRoute, private cardService: CardAPIService){
  }
  id: any = '';
  card: Card | null | void = null;
  async ngOnInit(){
    this.id = this.route.snapshot.paramMap.get("id");
    this.card = await this.cardService.getCardById(this.id);
    console.log(this.card);
  }
}
