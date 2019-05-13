import Vue from 'vue';
import Router from 'vue-router';
import Intro from '@/pages/Intro';
import TellMeAboutIt from '@/pages/TellMeAboutIt';
import Results from '@/pages/Results';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'intro',
      component: Intro,
    },
    {
      path: '/tell-me-about-it',
      name: 'tell-me-about-it',
      component: TellMeAboutIt,
    },
    {
      path: '/results',
      name: 'results',
      component: Results,
    },
  ],
});
