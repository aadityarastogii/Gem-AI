import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Homepage from './routes/homepage/Homepage.jsx';
import Dashboard from './routes/dashboardPage/Dashboard.jsx';
import Chatpage from './routes/chatpage/Chatpage.jsx';
// import Dashboard from './routes/dashboard/Dashboard.jsx';
import Rootlayout from './layouts/rootlayout/rootlayout.jsx';
import DashboardLayout from './layouts/dashboardlayout/DashboardLayout.jsx';
import SignInPage from './routes/signinPage/Signin.jsx';
import SignUpPage from './routes/SignupPage/Signup.jsx';
// import { SignIn, SignUp } from '@clerk/clerk-react';





let router = createBrowserRouter([
  {
    element:<Rootlayout/>,
    children:[
      {
        path:"/",element:<Homepage/>
      },
      {
        path:"/sign-in/*",
        element:<SignInPage/>
      },
      {
        path:"/sign-up/*",
        element:<SignUpPage/>
      },
      {
        element:<DashboardLayout/>,
        children:[
          {
            path:"/dashboard",
            element:<Dashboard/>,
          },
          {
            path:"/dashboard/chats/:id",
            element:<Chatpage/>
          }
        ]
      }
    ]
  }
  // {
  //   path: "/dashboard",
  //   element:(
  //     <Dashboard/>
  //   )
  // },
]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
