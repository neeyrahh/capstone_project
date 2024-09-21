import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import Tasks from "./components/Tasks";
import Homepage from "./components/Homepage";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path:"/tasks",
        element: <Tasks/>,
      },
      {
        path: "/login",
        element:<Login/> ,
      },
    
      // {
      //   path:,
      //   element: ,
      // },
      // {
      //   path: ,
      //   element:,
      // },
      // {
      //   path: ,
      //   element: ,
      // },
      {
        path: "*",
        element: <p>404 Page Not Found</p>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
