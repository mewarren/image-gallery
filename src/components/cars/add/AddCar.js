import Template from '../../Template';
import html from './add-car.html';
import './add-car.css';
import { db } from '../../../services/firebase';


const template = new Template(html);
const cars = db.ref('cars');

export default class AddCar {
  constructor(onAdd) {
    this.onAdd = onAdd;
  }

  handleSubmit(form) {
    // this.error.textContent = '';

    const data = new FormData(form);
    const car = {};
    data.forEach((value, key) => car[key] = value);

    const ref = cars.push();
    ref.set(car)
      .then(() => window.location.hash = `#cars/${ref.key}`)
      .catch(err => this.error.textContent = err); 
  }

  render() {
    const dom = template.clone();
    this.error = dom.querySelector('error');

    this.form = dom.querySelector('form');
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.handleSubmit(event.target);
    });

    dom.querySelector('button[type=button]').addEventListener('click', event => {
      event.preventDefault();
      window.location.hash = '#cars';
    });

    return dom;
  }

  unrender(){

  }
}