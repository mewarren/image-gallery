import Template from '../../Template';
import html from './car-detail.html';
import './car-detail.css';
import Images from './Images';
import { db } from '../../../services/firebase';

const template = new Template(html);
const cars = db.ref('cars');

export default class CarDetail {
  constructor(key) {
    this.key = key;
    this.car = cars.child(key);
  }

  render() {
    const dom = template.clone();

    const header = dom.querySelector('h2');
    const make = dom.querySelector('make');
    const model = dom.querySelector('model');

    this.onValue = this.car.on('value', data => {
      const car = data.val();
      header.textContent = `${car.make} ${car.model}`;
      make.textContent = car.make;  
      model.textContent = car.model;  
    });

    this.images = new Images(this.key);
    dom.querySelector('section.images').append(this.images.render());

    return dom;
  }

  unrender() {
    cars.child(this.key).off('value', this.onValue);
    this.images.unrender();
  }
}