import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import PartsView from '../views/PartsView.vue'
import IdeaGenerationView from '../views/IdeaGenerationView.vue'
import FinalInteractionView from '../views/FinalInteractionView.vue'
import IdeaDetailView from '../views/IdeaDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/choose',
      name: 'parts',
      component: PartsView,
    },
    {
      path: '/idea-generation',
      name: 'idea-generation',
      component: IdeaGenerationView,
    },
    {
      path: '/final',
      name: 'final',
      component: FinalInteractionView,
    },
    {
      path: '/idea/:id',
      name: 'idea-detail',
      component: IdeaDetailView,
    },
  ],
})

export default router
