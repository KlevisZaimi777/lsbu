import { createBrowserRouter } from 'react-router-dom';
import Home from './Home';
import About from './About';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/about",
    element: <About />
  }
]);

export default router;