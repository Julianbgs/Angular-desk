import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class CardService {

  constructor(private firestore: AngularFirestore) {
  }

  createCard(data) {
    console.log(data);
    return this.firestore
      .collection('Cards')
      .add(data);
  }

  getCards() {
    return this.firestore
      .collection('Cards')
      .get();
  }

  getCardsWorked() {
    return this.firestore
      .collection('Cards-worked')
      .get();
  }

  getCardsDone() {
    return this.firestore
      .collection('Cards-done')
      .get();
  }

  saveCardStart(data) {
    return this.firestore
      .collection('Cards')
      .add(data);
  }

  saveCardWorked(data) {
    return this.firestore
      .collection('Cards-worked')
      .add(data);
  }

  saveCardDone(data) {
    return this.firestore
      .collection('Cards-done')
      .add(data);
  }

  deleteCard(data) {
    return this.firestore
      .collection('Cards')
      .doc(data.id)
      .delete();
  }

  deleteCardDone(data) {
    return this.firestore
      .collection('Cards-done')
      .doc(data.id)
      .delete();
  }

  deleteCardWorked(data) {
    return this.firestore
      .collection('Cards-worked')
      .doc(data.id)
      .delete();
      }
}
