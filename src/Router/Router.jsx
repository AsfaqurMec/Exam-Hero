import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Components/Home";
import About from "../Pages/About";
import Register from "../Pages/Register";
import { path } from "framer-motion/client";
import Login from "../Pages/Login";
import Contact from "../Pages/Contact";
import ApplyTeacher from "../Pages/ApplyTeacher";
import DashBoardLayout from "../Pages/DashBoard/DashBoardLayout";
import AdminTeacherApplication from "../Pages/DashBoard/AdminTeacherApplication";
import ContactMessageAdmin from "../Pages/DashBoard/ContactMessageAdmin";
import UserRoleUpdate from "../Pages/DashBoard/UserRoleUpdate";
import ChangesBanners from "../Pages/DashBoard/ChangesBanners";
import Profile from "../Pages/DashBoard/Profile";
import AppLink from "../Pages/DashBoard/AppLink";
import SscScience from "../Components/Programe/SscScience";
import TeacherDetails from "../Pages/TeacherDetails";
import AllTeachersPage from "../Components/AllTeachersPage";
import SSCHumanities from "../Components/Programe/SSCHumanities";
import SSCBusiness from "../Components/Programe/SSCBusiness";
import HSCScience from "../Components/Programe/HSCScience";
import HSCHumanities from "../Components/Programe/HSCHumanities";
import HscBusiness from "../Components/Programe/HscBusiness";
import ExamHeroHighlight from "../Pages/ExamHeroHighlight";
import PrivacyPolicy from "../Components/PrivacyPolicy";
import TermsAndConditions from "../Components/TermsAndConditions";





export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path:"/about",
        element:<About></About>
      },
      {
        path: "/register",
        element: <Register></Register>
      },
      {
        path:"/login",
        element: <Login></Login>
      },
      {
        path:'/allteachers',
        element:<AllTeachersPage></AllTeachersPage>
      },
      {
        path:'/contact',
        element:<Contact></Contact>
      },
      {
        path:"/applyteacher",
        element:<ApplyTeacher></ApplyTeacher>

      },
      {
        path:'teachers/:id',
        element:<TeacherDetails></TeacherDetails>

      },
      {
        path:'/sscscience',
        element: <SscScience></SscScience>
      },
      {
        path:'/sschumanities',
        element: <SSCHumanities></SSCHumanities>
      },
      {
        path:'/sscbusiness',
        element:<SSCBusiness></SSCBusiness>
      },
      {
        path:'/hscscience',
        element:<HSCScience></HSCScience>
      },
      {
        path:'/hschumanities',
        element:<HSCHumanities></HSCHumanities>
      },
      {
        path:'/hscbusiness',
        element:<HscBusiness></HscBusiness>
      },
      {
        path:'/privicrpolicy',
        element:<PrivacyPolicy></PrivacyPolicy>
      },
      {
        path:'/termsandconditions',
        element:<TermsAndConditions></TermsAndConditions>
      }
      
      
    ],
  },
  {
    path:'/dashboard',
    element: <DashBoardLayout></DashBoardLayout>,
    children:[
      {
        path:"teacherapplications",
        element:<AdminTeacherApplication></AdminTeacherApplication>
      },
      {
        path:'contactmessages',
        element: <ContactMessageAdmin></ContactMessageAdmin>
      },
      {
        path:'userroleupdate',
        element:<UserRoleUpdate></UserRoleUpdate>
      },
      {
        path:'changesbanners',
        element:<ChangesBanners></ChangesBanners>
      },
      {
        path:"examherohighlight",
        element:<ExamHeroHighlight></ExamHeroHighlight>

      },
      {
        path:'profile',
        element:<Profile></Profile>
      },
      {
        path:'applink',
        element:<AppLink></AppLink>
      }
      
    ]
   
  }
]);
