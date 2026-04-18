import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';

const HomePage = lazy(() => import('../pages/home/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));
const AzabuPressListPage = lazy(() => import('../pages/azabu-press/page'));
const AzabuPlusTenshokuPage = lazy(() => import('../pages/azabu-plus-tenshoku/page'));
const PostDetailPage = lazy(() => import('../pages/_post/detail'));
const InterviewDetailPage = lazy(() => import('../pages/interview/detail'));
const TagPage = lazy(() => import('../pages/tag/page'));
const AdminPage = lazy(() => import('../pages/admin/page'));
const AdminLoginPage = lazy(() => import('../pages/admin/login'));
const DesignSystemPage = lazy(() => import('../pages/design-system/page'));

// ── 採用プラットフォーム（AZABU+転職）
const TenshokuRegisterPage = lazy(() => import('../pages/tenshoku/register/page'));
const CompanyRegisterPage = lazy(() => import('../pages/companies/register/page'));
const AdminRecruitmentPage = lazy(() => import('../pages/admin/recruitment/page'));

// ── UpBoard（学歴不問 × 上場企業特化）
const UpBoardPage = lazy(() => import('../pages/upboard/page'));
const UpBoardCheckPage = lazy(() => import('../pages/upboard/check/page'));
const UpBoardRegisterPage = lazy(() => import('../pages/upboard/register/page'));
const AdminUpBoardPage = lazy(() => import('../pages/admin/upboard/page'));

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
    path: '/azabu-plus-tenshoku',
    element: <PageTransition><AzabuPlusTenshokuPage /></PageTransition>,
  },
  // ブランド表記ゆれ向けのエイリアス導線
  {
    path: '/azabu-tenshoku',
    element: <PageTransition><AzabuPlusTenshokuPage /></PageTransition>,
  },
  {
    path: '/azabu-plus',
    element: <PageTransition><AzabuPlusTenshokuPage /></PageTransition>,
  },
  {
    path: '/azabu-plus-project',
    element: <PageTransition><AzabuPlusTenshokuPage /></PageTransition>,
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
  // ── 採用プラットフォーム
  {
    path: '/tenshoku/register',
    element: <PageTransition><TenshokuRegisterPage /></PageTransition>,
  },
  {
    path: '/register',
    element: <PageTransition><TenshokuRegisterPage /></PageTransition>,
  },
  {
    path: '/companies/register',
    element: <PageTransition><CompanyRegisterPage /></PageTransition>,
  },
  {
    path: '/admin/recruitment',
    element: <PageTransition><AdminRecruitmentPage /></PageTransition>,
  },
  // ── UpBoard
  {
    path: '/upboard',
    element: <PageTransition><UpBoardPage /></PageTransition>,
  },
  {
    path: '/upboard/check',
    element: <PageTransition><UpBoardCheckPage /></PageTransition>,
  },
  {
    path: '/upboard/register',
    element: <PageTransition><UpBoardRegisterPage /></PageTransition>,
  },
  {
    path: '/admin/upboard',
    element: <PageTransition><AdminUpBoardPage /></PageTransition>,
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
