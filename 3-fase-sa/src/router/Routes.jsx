import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home'

const Routes = createBrowserRouter([
  { path: '/', element: <PageWrapper element={ <Home /> } /> },

]);

export default Routes;
