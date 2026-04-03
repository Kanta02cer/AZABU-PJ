import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';

const HomePage = lazy(() => import('../pages/home/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));
const AzabuPressListPage = lazy(() => import('../pages/azabu-press/page'));
const PostDetailPage = lazy(() => import('../pages/_post/detail'));
const InterviewDetailPage = lazy(() => import('../pages/interview/detail'));
const TagPage = lazy(() => import('../pages/tag/page'));
const AdminPage = lazy(() => import('../pages/admin/page'));
const AdminLoginPage = lazy(() => import('../pages/admin/login'));
const DesignSystemPage = lazy(() => import('../pages/design-system/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <PageTransition><HomePage /></PageTransition>,
  },
  {
    path: '/azabu-press',
    element: <PageTransition><AzabuPressListPage /></PageTransition>,
  },
  {
    path: '/_post/:id',
    element: <PageTransition><PostDetailPage /></PageTransition>,
  },
  {
    path: '/interview/:id',
    element: <PageTransition><InterviewDetailPage /></PageTransition>,
  },
  {
    path: '/tag/:tag',
    element: <PageTransition><TagPage /></PageTransition>,
  },
  {
    path: '/admin',
    element: <PageTransition><AdminPage /></PageTransition>,
  },
  {
    path: '/admin/login',
    element: <PageTransition><AdminLoginPage /></PageTransition>,
  },
  {
    path: '/design-system',
    element: <PageTransition><DesignSystemPage /></PageTransition>,
  },
  {
    path: '*',
    element: <PageTransition><NotFoundPage /></PageTransition>,
  },
];

export default routes;
