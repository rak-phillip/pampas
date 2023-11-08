import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faSquare,
  faSquareCheck,
  faSquareMinus,
  faCircle,
  faArrowRightFromBracket,
  faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';

library.add(faSort);
library.add(faSortUp);
library.add(faSortDown);
library.add(faSquare);
library.add(faSquareCheck);
library.add(faSquareMinus);
library.add(faCircle);
library.add(faArrowRightFromBracket);
library.add(faArrowRightToBracket);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
