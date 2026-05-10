import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import BoardPage from './pages/BoardPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ExplorePage from './pages/ExplorePage';
import LendPage from './pages/LendPage';
import ProfilePage from './pages/ProfilePage';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageTransition><BoardPage /></PageTransition>} />
          <Route path="explore" element={<PageTransition><ExplorePage /></PageTransition>} />
          <Route path="board" element={<PageTransition><BoardPage /></PageTransition>} />
          <Route path="product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
          <Route path="checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
          <Route path="lend" element={<PageTransition><LendPage /></PageTransition>} />
          <Route path="profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
