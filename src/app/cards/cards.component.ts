import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Cards} from '../_interfaces/cards';
import {AngularFirestore} from '@angular/fire/firestore';
import {CardService} from '../_services/card.service';
import {MatDialog} from '@angular/material/dialog';
import {ModalComponent} from '../modal/modal.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  @ViewChild('form', {static: false}) form: NgForm;

  dataCards: Array<any> = [];
  dataNextCards: Array<any> = [];
  dataNewCards: Array<any> = [];
  formData: any = {};
  isDisabling: boolean = false;

  constructor(private db: AngularFirestore, private cardService: CardService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.gettingCards();
    this.gettingCardsWorked();
    this.gettingCardsDone();
  }

  submittedForm() {
    this.formData = this.form.value;
    this.cardService.createCard(this.formData)
      .then((res) => {
      this.gettingCards();
    });
  }

  gettingCards() {
    this.cardService.getCards().subscribe((res) => {
      const cards = [];
      res.forEach((data) => cards.push({ id: data.id, ...data.data()}));
      this.dataCards = cards;
    });
  }

  gettingCardsWorked() {
    this.cardService.getCardsWorked().subscribe((res) => {
      const cardsWork = [];
      res.forEach((data) => cardsWork.push({ id: data.id, ...data.data()}));
      this.dataNextCards = cardsWork;
    });
  }

  gettingCardsDone() {
    this.cardService.getCardsDone().subscribe((res) => {
      const cardsDone = [];
      res.forEach((data) => cardsDone.push({ id: data.id, ...data.data()}));
      this.dataNewCards = cardsDone;
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      const card = event.container.data[event.currentIndex];
      const data = Object.assign({}, {title: card.title,
        content: card.content
      });
      if (event.container.id === 'cdk-drop-list-1') {
        this.isDisabling = true;
        this.cardService.saveCardWorked(data).then((res) => {
          this.gettingCardsWorked();
          if (event.previousContainer.id === 'cdk-drop-list-0') {
            this.cardService.deleteCard(card).then(() => {
              this.isDisabling = false;
            });
          }
          if (event.previousContainer.id === 'cdk-drop-list-2') {
            this.cardService.deleteCardDone(card).then(() => {
              this.isDisabling = false;
            });
          }
        });

      } else if (event.container.id === 'cdk-drop-list-2') {
        this.isDisabling = true;
        this.cardService.saveCardDone(data).then((res) => {
          this.gettingCardsDone();
          if (event.previousContainer.id === 'cdk-drop-list-0') {
            this.cardService.deleteCard(card).then(() => {
              this.isDisabling = false;
            });
          }
          if (event.previousContainer.id === 'cdk-drop-list-1') {
            this.cardService.deleteCardWorked(card).then(() => {
              this.isDisabling = false;
            });
          }
        });
      } else {
        this.isDisabling = true;
        this.cardService.saveCardStart(data).then((res) => {
          this.gettingCards();
          if (event.previousContainer.id === 'cdk-drop-list-1') {
            this.cardService.deleteCardWorked(card).then(() => {
              this.isDisabling = false;
            });
          }
          if (event.previousContainer.id === 'cdk-drop-list-2') {
            this.cardService.deleteCardDone(card).then(() => {
              this.isDisabling = false;
            });
          }
        });
      }
    }
  }

  handlerDeleteCardFromStart(card: any) {
    const updatedDataCards = this.dataCards.filter(item => item.id !== card.id);
    this.cardService.deleteCard(card).then(() => {
      this.dataCards = updatedDataCards;
    });
  }

  handlerDeleteCardFromWork(card: any) {
    const updatedDataCards = this.dataNextCards.filter(item => item.id !== card.id);
    this.cardService.deleteCardWorked(card).then(() => {
      this.dataNextCards = updatedDataCards;
    });
  }

  handlerDeleteCardFromDone(card: any) {
    const updatedDataCards = this.dataNewCards.filter(item => item.id !== card.id);
    this.cardService.deleteCardDone(card).then(() => {
      this.dataNewCards = updatedDataCards;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
