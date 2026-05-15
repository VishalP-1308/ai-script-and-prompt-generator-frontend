import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import IdeaGenerator from './pages/IdeaGenerator';
import ScriptGenerator from './pages/ScriptGenerator';
import ThumbnailGenerator from './pages/ThumbnailGenerator';
import SEOGenerator from './pages/SEOGenerator';
import ShortsGenerator from './pages/ShortsGenerator';
import InstagramGenerator from './pages/InstagramGenerator';
import PromptBuilder from './pages/PromptBuilder';
import TrendingTopics from './pages/TrendingTopics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ideas" element={<IdeaGenerator />} />
          <Route path="/trending" element={<TrendingTopics />} />
          <Route path="/scripts" element={<ScriptGenerator />} />
          <Route path="/thumbnails" element={<ThumbnailGenerator />} />
          <Route path="/seo" element={<SEOGenerator />} />
          <Route path="/shorts" element={<ShortsGenerator />} />
          <Route path="/instagram" element={<InstagramGenerator />} />
          <Route path="/prompts" element={<PromptBuilder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;