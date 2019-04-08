import PageStreams from './pages/Streams.vue';

export default [
  {
    path: '/',
    redirect: '/streams',
  },
  {
    path: '/streams',
    component: PageStreams,
  },
];
