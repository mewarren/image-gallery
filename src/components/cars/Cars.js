import Template from '../Template';
import html from './cars.html';
import './cars.css';
import AddCar from './add/AddCar';
import CarList from './list/CarList';
import CarDetail from './detail/CarDetail';
import { removeChildren } from '../dom';

const template = new Template(html);

export default class Cars {
  constructor(){
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  setChildPage() {
    const routes = window.location.hash.split('/');
    const childPage = routes[1] || '';
    if(this.childComponent === childPage) return;
   
    this.childPage = childPage;
    if(this.childComponent) this.childComponent.unrender();
    removeChildren(this.section);

    let childComponent;
    if(childPage === 'add') childComponent = new AddCar();
    else if(childPage) childComponent = new CarDetail(childPage);
    else childComponent = new CarList();
    
    this.childComponent = childComponent;
    this.section.appendChild(childComponent.render());
  }

  render() {
    const dom = template.clone();
    this.section = dom.querySelector('section');
    this.setChildPage();
    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashchange);
  }


}