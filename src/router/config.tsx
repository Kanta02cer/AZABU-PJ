import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

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
    element: <HomePage />,
  },
  {
    path: '/news',
    element: <NewsListPage />,
  },
  {
    path: '/news/:id',
    element: <NewsDetailPage />,
  },
  {
    path: '/column',
    element: <ColumnListPage />,
  },
  {
    path: '/column/:id',
    element: <ColumnDetailPage />,
  },
  {
    path: '/interview/:id',
    element: <InterviewDetailPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/design-system',
    element: <DesignSystemPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;

