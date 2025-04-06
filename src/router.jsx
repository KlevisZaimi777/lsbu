import { createBrowserRouter } from 'react-router-dom';
import Home from './Home';
import About from './About';
import NotFound from './NotFound'; // A simple 404 page

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "*",  // Catch-all route for undefined routes
    element: <NotFound />,  // Render the 404 page
  },
]);

export default router;
