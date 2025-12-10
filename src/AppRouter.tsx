import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

import WelcomePage from "./pages/WelcomePage";
import FeaturesPage from "./pages/FeaturesPage";
import UserTypePage from "./pages/UserTypePage";
import RegisterPage from "./pages/RegisterPage";
import PlatformDashboardPage from "./pages/PlatformDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import EditProfilePage from "./pages/EditProfilePage";
import NotesPage from "./pages/NotesPage";
import KanbansPage from "./pages/KanbansPage";
import KanbanDetailPage from "./pages/KanbanDetailPage";
import { NIP19Page } from "./pages/NIP19Page";
import { SettingsPage } from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/user-type" element={<UserTypePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/platform-dashboard" element={<PlatformDashboardPage />} />
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/kanbans" element={<KanbansPage />} />
        <Route path="/kanban/:id" element={<KanbanDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* NIP-19 route for npub1, note1, naddr1, nevent1, nprofile1 */}
        <Route path="/:nip19" element={<NIP19Page />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;