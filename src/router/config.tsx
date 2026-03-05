import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';

const HomePage = lazy(() => import('../pages/home/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));
const NewsListPage = lazy(() => import('../pages/news/page'));
const NewsDetailPage = lazy(() => import('../pages/news/detail'));
const ColumnListPage = lazy(() => import('../pages/column/page'));
const ColumnDetailPage = lazy(() => import('../pages/column/detail'));
const InterviewDetailPage = lazy(() => import('../pages/interview/detail'));
const AdminPage = lazy(() => import('../pages/admin/page'));
const AdminLoginPage = lazy(() => import('../pages/admin/login'));
const DesignSystemPage = lazy(() => import('../pages/design-system/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <PageTransition><HomePage /></PageTransition>,
  },
  {
    path: '/news',
    element: <PageTransition><NewsListPage /></PageTransition>,
  },
  {
    path: '/news/:id',
    element: <PageTransition><NewsDetailPage /></PageTransition>,
  },
  {
    path: '/column',
    element: <PageTransition><ColumnListPage /></PageTransition>,
  },
  {
    path: '/column/:id',
    element: <PageTransition><ColumnDetailPage /></PageTransition>,
  },
  {
    path: '/interview/:id',
    element: <PageTransition><InterviewDetailPage /></PageTransition>,
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
