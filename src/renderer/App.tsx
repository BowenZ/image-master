import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Home from './pages/Home';
import SecondPageContainer from './pages/SecondPageContainer';
import ImageCompress from './pages/ImageCompress';
import ImageCrop from './pages/ImageCrop';
import ImageDiff from './pages/ImageDiff';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages" element={<SecondPageContainer />}>
          <Route path="img-compress" element={<ImageCompress />} />
          <Route path="img-crop" element={<ImageCrop />} />
          <Route path="img-diff" element={<ImageDiff />} />
        </Route>
      </Routes>
    </Router>
  );
}
