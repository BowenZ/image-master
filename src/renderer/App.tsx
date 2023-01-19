import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Home from './pages/Home';
import SecondPageContainer from './pages/SecondPageContainer';
import ImageCompress from './pages/ImageCompress';
import ImageCrop from './pages/ImageCrop';
import ImageDiff from './pages/ImageDiff';
import ImageCompare from './pages/ImageCompare';
import ImageInfo from './pages/ImageInfo';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages" element={<SecondPageContainer />}>
          <Route path="img-compress" element={<ImageCompress />} />
          <Route path="img-crop" element={<ImageCrop />} />
          <Route path="img-diff" element={<ImageDiff />} />
          <Route path="img-compare" element={<ImageCompare />} />
          <Route path="img-info" element={<ImageInfo />} />
        </Route>
        <Route path="/img-compare" element={<ImageCompare />} />
      </Routes>
    </Router>
  );
}
