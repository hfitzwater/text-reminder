import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'carbon-components/css/carbon-components.css'
import CarbonComponentsVue from '@carbon/vue'
import { USER_ACTIONS } from './store/modules/UserStore';
import { setInteractionMode } from 'vee-validate';

setInteractionMode('lazy');
Vue.config.productionTip = false;
Vue.use(CarbonComponentsVue);

const preloadAndRender = async () => {
  /* Hack for focusing carbon input */
  Vue.directive('focus', {
    inserted: function (el) {
      setTimeout(() => {
        const inputEl = el.querySelector('input');
        inputEl.focus();
      });
    }
  });

  try {
    await store.dispatch(USER_ACTIONS.GET_USER_FROM_TOKEN);
  } catch( ex ) {
    console.warn('Not logged in ');
    router.push('/');
  }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
};

preloadAndRender();



