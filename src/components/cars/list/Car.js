import Template from '../../Template';
import html from './car.html';
import './car.css';
import { db } from '../../../services/firebase';
import { getUrl } from '../../../services/cloudinary';

const template = new Template(html);
const carsImages = db.ref('car-images');

export default class Car {
  constructor(key, car) {
    this.key = key;
    this.car = car;
    this.carImages = carsImages.child(key).limitToFirst(1);
  }

  update(car) {
    this.caption.textContent = `${car.make} ${car.model}`;
    this.image.alt = `${car.make} ${car.model}`;
  }

  render() {
    const dom = template.clone();
    dom.querySelector('a').href = `#cars/${this.key}`;
    this.caption = dom.querySelector('h2');
    this.image = dom.querySelector('img');

    this.update(this.car);
    
    this.onValue = this.carImages.on('child_added', data => {
      this.image.src = getUrl(data.val(), 'c_fill,e_grayscale,h_250,w_350');
    });

    return dom;
  }

  unrender() {
    this.carImages.off('child_added', this.onValue);
  }
}