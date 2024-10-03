import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import Tasks from "./components/Tasks";
import TaskDetails from "./components/TaskDetails";  // Import TaskDetails component
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
        element: <Tasks />,
      },
      {
        path: "/task/:cardId",  // Add the route for Task Details
        element: <TaskDetails />,
      },
      {
        path: "/login",
        element:<Login/> ,
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
