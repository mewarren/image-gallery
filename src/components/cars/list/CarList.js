import Template from '../../Template';
import html from './car-list.html';
import './car-list.css';
import Car from './Car';
import { db } from '../../../services/firebase';


const template = new Template(html);
const cars = db.ref('cars');

export default class CarList {

  render() {
    const dom = template.clone();

    const ul = dom.querySelector('ul');

    const map = new Map();

    this.childAdded = cars.on('child_added', data => {
      const car = new Car(data.key, data.val());
      const carDom = car.render();
      map.set(data.key, {
        component: car,
        nodes: [...carDom.childNodes]
      });

      ul.appendChild(carDom);
    });

    this.childRemoved = cars.on('child_removed', data => {
      const toRemove = map.get(data.key);
      map.delete(data.key);
      toRemove.nodes.forEach(node => node.remove());
      toRemove.component.unrender();
    });

    this.childChange = cars.on('child_changed', data => {
      map.get(data.key).component.update(data.val());
    });

    return dom;
  }

  unrender() {
    cars.off('child_added', this.childAdded);
    cars.off('child_removed', this.childRemoved);
    cars.off('child_changed', this.childChange);
  }
}