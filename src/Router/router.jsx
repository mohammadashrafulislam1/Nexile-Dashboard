import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Components/Dashboard/Dashboard";
import Hero from "../Pages/Hero";
import Services from "../Pages/Services";
import About from "../Pages/About";
import HowWeWork from "../Pages/HowWeWork";
import Founder from "../Pages/Founder";
import Team from "../Pages/Team";
import Work from "../Pages/Work";
import ManageWorks from "../Pages/ManageWorks";
import Testimonials from "../Pages/Testimonials";
import AddTestimonial from "../Pages/AddTestimonial";
import Clients from "../Pages/Clients";
import Faq from "../Pages/Faq";
import AddBlog from "../Pages/AddBlog";
import Blogs from "../Pages/Blogs";
import Footer from "../Pages/Footer";
import TechStack from "../Pages/TechStack";
import TechCategories from "../Pages/TechCategories";
import BlogCategories from "../Pages/BlogCategories";
import Contact from "../Pages/Contact";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Dashboard/>,
        errorElement:<h1>Error</h1>,
        children:[
            {
                path:'/',
                element:<h2>Text</h2>
            },
            {
                path:'hero',
                element:<Hero/>
            },
            {
                path:'services',
                element:<Services/>
            },
            {
                path:'about',
                element:<About/>
            },
            {
                path:'howwework',
                element:<HowWeWork/>
            },
            {
                path:'founder',
                element:<Founder/>
            },
            {
                path:'team',
                element:<Team/>
            },
            {
                path:'work',
                element:<Work/>
            },
            {
                path:'manageworks',
                element:<ManageWorks/>
            },
            {
                path:'testimonials',
                element:<Testimonials/>
            },
            {
                path:'addTestimonial',
                element:<AddTestimonial/>
            },
            {
                path:'clients',
                element:<Clients/>
            },
            {
                path:'faq',
                element:<Faq/>
            },
            {
                path:'addBlog',
                element:<AddBlog/>
            },
            
            {
                path:'techStack',
                element:<TechStack/>
            },
            {
                path:'blogs',
                element:<Blogs/>
            },
            
            {
                path:'footer',
                element:<Footer/>
            },
            {
                path:'techCategory',
                element:<TechCategories/>
            },
            {
                path:'blogCategories',
                element:<BlogCategories/>
            },
            {
                path:'inquiries',
                element:<Contact/>
            },
        ],
    }
 ])