import PageStreams from './pages/Streams.vue';
import PageScheduling from './pages/Scheduling.vue';

export default [
  {
    path: '/',
    redirect: '/streams',
  },
  {
    path: '/streams',
    component: PageStreams,
  },
  {
    path: '/scheduling',
    component: PageScheduling,
  },
];
