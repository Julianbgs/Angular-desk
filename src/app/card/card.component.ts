import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { Cards } from '../_interfaces/cards';
import {CardService} from '../_services/card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card: any;
  @Input() dataBegin: any;
  @Input() dataWork: any;
  @Input() dataDone: any;
  @Output() OnDelete = new EventEmitter();

  constructor(private cardService: CardService) { }

  ngOnInit() {
  }

  deleteCardStart() {
    this.OnDelete.emit();
  }
}
