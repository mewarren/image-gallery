import Template from '../../Template';
import html from './images.html';
import Image from './Image';
import { db, storage } from '../../../services/firebase';

const template = new Template(html);
const carsImages = db.ref('car-images');
const carImageStorage = storage.ref('cars');

export default class Images {
  constructor(key) {
    this.carImages = carsImages.child(key);
    this.imageStorage = carImageStorage.child(key);
  }

  handleUpload(file) {
    const carImage = this.carImages.push();
    const uploadTask = this.imageStorage.child(carImage.key).put(file);

    uploadTask.on('state_changed', () => {

    }, err => {
      console.error(err);
    }, () => {
      const downloadUrl = uploadTask.snapshot.downloadURL;
      this.fileInput.value = null;
      carImage.set(downloadUrl);
    });
  }

  handleEmbed(url) {
    const carImage = this.carImages.push();
    carImage.set(url);
  }

  handleRemove(imageKey) {
    this.carImages.child(imageKey).remove();
    const storage = this.imageStorage.child(imageKey);
    storage.delete()
      .catch(err => {
        if(err.code === 'storage/object-not-found') return;
        console.error(err);        
      });
  }

  render() {
    const dom = template.clone();

    this.fileInput = dom.querySelector('input[type=file]');
    this.fileInput.addEventListener('change', event => {
      const files = event.target.files;
      if(!files || !files.length) return;
      this.handleUpload(files[0]);
    });

    const embedForm = dom.querySelector('form');
    embedForm.addEventListener('submit', event => {
      event.preventDefault();
      this.handleEmbed(event.target.elements.url.value);
    });

    const ul = dom.querySelector('ul');
    const map = new Map();

    this.childAdded = this.carImages.on('child_added', data => {
      const image = new Image(data.val(), () => this.handleRemove(data.key));
      const imageDom = image.render();
      map.set(data.key, {
        nodes: [...imageDom.childNodes],
        component: image
      });
      ul.appendChild(imageDom);
    });

    this.childRemoved = this.carImages.on('child_removed', data => {
      const toRemove = map.get(data.key);
      toRemove.nodes.forEach(node => node.remove());
    });

    return dom;
  }

  unrender() {
    this.carImages.on('child_added', this.childAdded);
    this.carImages.on('child_removed', this.childRemoved);
  }
}