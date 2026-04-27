
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AboutLandingPage } from './pages/AboutLandingPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LivePage } from './pages/LivePage';
import { MembershipPage } from './pages/MembershipPage';
import { MissionVisionPage } from './pages/MissionVisionPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegionPage } from './pages/RegionPage';
import { RegionsLandingPage } from './pages/RegionsLandingPage';
import { ResearchersPage } from './pages/ResearchersPage';
import { SectionPage } from './pages/SectionPage';
import { TeamPage } from './pages/TeamPage';
import { WhatWeDoPage } from './pages/WhatWeDoPage';
import { ScrollToTop } from './components/ScrollToTop';

import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminLayout } from './admin/pages/AdminLayout';
import { AdminHero } from './admin/pages/sections/AdminHero';
import { AdminBanners } from './admin/pages/sections/AdminBanners';
import { AdminHotTopics } from './admin/pages/sections/AdminHotTopics';
import { AdminLatestHeadlines } from './admin/pages/sections/AdminLatestHeadlines';
import { AdminTrending } from './admin/pages/sections/AdminTrending';
import { AdminWorldRegions } from './admin/pages/sections/AdminWorldRegions'; 
import { AdminMoreSections } from './admin/pages/sections/AdminMoreSections';
import { AdminMembership }   from './admin/pages/sections/AdminMembership';
import { AdminPageBanner }   from './admin/pages/sections/AdminPageBanner';
import { AdminContactRequests } from './admin/pages/sections/AdminContactRequests';
import { VideoPage }       from './pages/VideoPages';
import { VideoDetailPage } from './pages/VideoDetailPage';
import { OpinionPage }     from './pages/OpinionPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AdminAllPages } from './admin/pages/sections/AdminAllPages';
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const appRoutes = (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutLandingPage />} />
        <Route path="/about/team" element={<TeamPage />} />
        <Route path="/about/researchers" element={<ResearchersPage />} />
        <Route path="/about/what-we-do" element={<WhatWeDoPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/regions" element={<RegionsLandingPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/mission-vision" element={<MissionVisionPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/more" element={<Navigate to="/section/world-news" replace />} />
        <Route path="/section/:slug" element={<SectionPage />} />
        <Route path="/region/:area" element={<RegionPage />} />
        <Route path="/region/:area/:country" element={<RegionPage />} />
        <Route path="/section/video"   element={<VideoPage />} />
<Route path="/section/opinion" element={<OpinionPage />} />
<Route path="/video/:id"       element={<VideoDetailPage />} />
<Route path="/article/:id" element={<ArticleDetailPage />} />
<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
<Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
<Route path="/disclaimer" element={<DisclaimerPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/hero" replace />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="hot-topics" element={<AdminHotTopics />} />
          <Route path="latest-headlines" element={<AdminLatestHeadlines />} />
          <Route path="trending" element={<AdminTrending />} />
          <Route path="world/:region" element={<AdminWorldRegions />} />
<Route path="world" element={<Navigate to="/admin/world/asia" replace />} />
<Route path="more/:section" element={<AdminMoreSections />} />
<Route path="more"          element={<Navigate to="/admin/more/interviews" replace />} />
<Route path="membership"    element={<AdminMembership />} />
<Route path="page-banner"   element={<AdminPageBanner />} />
<Route path="/admin/contact-requests" element={<AdminContactRequests />} />
<Route path="/admin/all-pages" element={<AdminAllPages />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );

  if (isAdminRoute) {
    return appRoutes;
  }

  return <MainLayout>{appRoutes}</MainLayout>;
}

function App() {
  return (
    <AdminAuthProvider>
      <AppContent />
    </AdminAuthProvider>
  );
}

export default App;
