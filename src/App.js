import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import Tasks from "./components/Tasks";
import TaskDetails from "./components/TaskDetails"; 
import Dashboard from "./components/Dashboard";
import Hompage from "./components/Hompage";
import Forget from "./components/Forget-password";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      
      {
        path: "/",
        element: <Hompage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path:"/tasks",
        element: <Tasks />,
      },
      {
        path: "/task/:cardId",  
        element: <TaskDetails />,
      },
      {
        path: "/login",
        element:<Login/> ,
      },
      {
        path: "/forget-password",
        element: <Forget />,
      },
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
