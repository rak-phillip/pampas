import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

library.add(faSort);
library.add(faSortUp);
library.add(faSortDown);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
