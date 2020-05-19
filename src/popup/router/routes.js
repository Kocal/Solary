import PageStreams from './pages/Streams';

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
