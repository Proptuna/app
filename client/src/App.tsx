import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { I18nProvider } from './i18n/I18nProvider';
import { Sidebar } from '@/components/sidebar';
import { AIPage } from '@/components/ai-page';
import { AIConversationsPage } from '@/components/conversations';
import PropertiesPage from '@/components/properties/PropertiesPage';
import PeoplePage from '@/components/people/PeoplePage';
import DocumentsPage from '@/components/documents/DocumentsPage';

function App() {
  // Mock user profile
  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "/avatar-placeholder.png",
    authProvider: "google",
  };

  // Mock logout function
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <I18nProvider>
      <Router>
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
          <Sidebar userProfile={userProfile} onLogout={handleLogout} />
          <div className="flex-1 overflow-auto h-full">
            <Routes>
              <Route path="/" element={<div className="p-6">Dashboard content goes here</div>} />
              <Route path="/ai-page" element={<AIPage />} />
              <Route path="/ai-conversations" element={<AIConversationsPage />} />
              <Route path="/properties-page" element={<PropertiesPage />} />
              <Route path="/people-page" element={<PeoplePage />} />
              <Route path="/documents-page" element={<DocumentsPage />} />
              <Route path="*" element={<div className="p-6">Page not found</div>} />
            </Routes>
          </div>
        </div>
      </Router>
    </I18nProvider>
  );
}

export default App;
