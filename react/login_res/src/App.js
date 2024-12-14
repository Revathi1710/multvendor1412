import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/index';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SignUp from './components/signup_component';
import Login from './components/login_component';
import UserDetails from './components/userDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './SuperAdmin/sidebar.css';
import './Vendors/vendorsidebar.css';
import './Vendors/login.css';
import './Vendors/table.css';
import SuperAdmin from './SuperAdmin/Login';
import Sidebar from './SuperAdmin/sidebar';  // Corrected path
import AddCategory from './SuperAdmin/AddCategory';
import AllCategory from './SuperAdmin/AllCategory';
import AllUser from './SuperAdmin/Alluser';
import AddPlan from './SuperAdmin/AddPlan';
import Plandetails from './SuperAdmin/Plandetails';
import UpdatePlan from "./SuperAdmin/EditPlanSuperAdmin";
import MainCategory from './SuperAdmin/AddMainCategory';
import AddSlider from './SuperAdmin/AddSilder';
import AddBanner from './SuperAdmin/AddBanner';
import AllSlider  from './SuperAdmin/AllSlider';
import UpdateSlider from './SuperAdmin/UpdateSlider';
import AllBannerSuperAdmin from './SuperAdmin/AllBanner';
import UpdateBanner from './SuperAdmin/UpdateBanner';
import AddMainService from './SuperAdmin/AddMainService';
import AllMainService from './SuperAdmin/AllService';
import AddProductAdmin from './SuperAdmin/AddProductAdmin';
import AllVendor from './SuperAdmin/AllVendors';
import ViewVendor from './SuperAdmin/ViewVendor';
import VendorBusiness from './SuperAdmin/VendorBusiness';
import VendorCategory from './SuperAdmin/VendorCategory';
import AdminDashboard from './SuperAdmin/AdminDashboard';

import UpdateCategorySuperAdmin from './SuperAdmin/UpdateCategory';
import AllProductSuperAdmin from './SuperAdmin/AllProduct';
import AddvendorBulk from './SuperAdmin/AddvendorBulk';

import VendorLogin from './Vendors/VendorLogin';
import VendorSignup from './Vendors/VendorSignup';
import BusinessDetails  from './Vendors/BusinessDetails';
import AddCategoryVendor from './Vendors/addCategory';
import AllCategoryVendor from './Vendors/AllCategory';
import Vendorsidebar from './Vendors/Vendorsidebar ';
import AddProductVendor from './Vendors/Addproduct';
import AllProductVendor from './Vendors/Allproducts';
import UpdateProductVendor from './Vendors/UpdateProduct';
import UpdateCategoryVendor from './Vendors/UpdateCategory';
import VendorDashboard from './Vendors/Dashboard';
import EditProfileVendor from './Vendors/EditProfile';
import ImageSlider from './components/ImageSlider';
import VendorAllEnquiry from './SuperAdmin/VendorEnquiry';
import AllEnquiry from './Vendors/AllEnquiry';
import AddSubCategoryAdmin from './SuperAdmin/AddSubCategoryAdmin';
import AllSubcategory from './SuperAdmin/AllSubCategory';


import ForgetPassword from './Vendors/ForgetPassword';
import ResetPassword from './Vendors/ResetPassword';
import VendorSelectPlan from './Vendors/PlanDetails';
import UserProfile from './Vendors/UserProfile';
import VendorHeader from './Vendors/vendorHeader';

import SelectBusiness from './Vendors/Business';
import AddService from './Vendors/AddService';
import AllService from './Vendors/AllService';
import BusinessProfile from './Vendors/BusinessProfile';
import AddProductVendor2 from './Vendors/AddProductVendor';
import MyOrders from './Vendors/MyOrders';
import WebsitePage from './Vendors/websitepage';
import HomePageForm from './Vendors/Homepage';
import AboutPageForm from './Vendors/aboutpage';
import VendorWebAbout from './Vendors/about';
import VendorWebProduct from './Vendors/AllProductWeb';
import VendorWebContact from './Vendors/contact';

import CategoryView from './components/CategoryView';

import ProductView from './components/ProductView';

import UserDashboard from './components/UserDashboard';
import ServiceView from './components/ServiceView';
import  VendorWebsite from './Vendors/Index';
import LeadForm from './components/leadForm';


function App() {
  const isLoggedIn = window.localStorage.getItem('loggedIn');

  return (
    <Router>
      <div className="App">
        {/* Navbar is included on all pages */}
      
        {/* Define application routes */}
        <Routes>
          {/* Default route based on login status */}
          
          {/* <Route path="/" element={isLoggedIn === 'true' ? <UserDetails /> : <Login />} /> */}

          {/* Login route */}
          <Route path="/login" element={<Login />} />
          {/* Signup route */}
          <Route path="/signup" element={<SignUp />} />
          {/* User Details route */}
          <Route path="/userDetails" element={<UserDetails />} />
          {/* SuperAdmin route */}
          <Route path="/SuperAdmin" element={<SuperAdmin />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/SuperAdmin/AddCategory" element={<AddCategory />} />
          <Route path="/SuperAdmin/AllCategories" element={< AllCategory />} />
          <Route path="/SuperAdmin/AllUser" element={< AllUser />} />
          <Route path="/SuperAdmin/AddPlan" element={<   AddPlan />} />
          <Route path="/SuperAdmin/Plandetails" element={< Plandetails/>} />
          <Route path="/SuperAdmin/EditPlan/:planId" element={<UpdatePlan />} />
          <Route path="/SuperAdmin/Plandetails" element={< Plandetails/>} />
          <Route path="/SuperAdmin/MainCategory" element={< MainCategory/>} />
          <Route path="/SuperAdmin/AddSlider" element={< AddSlider/>} />
          <Route path="/SuperAdmin/AddBanner" element={< AddBanner/>} />
          <Route path="/SuperAdmin/AllSlider" element={< AllSlider/>} />
          <Route path="/SuperAdmin/UpdateSlider/:id" element={< UpdateSlider/>} />
          <Route path="/SuperAdmin/AllBanner" element={< AllBannerSuperAdmin/>} />
          <Route path="/SuperAdmin/AllVendors" element={< AllVendor/>} />
             <Route path="/SuperAdmin/AddMainService" element={< AddMainService/>} />
             <Route path="/SuperAdmin/AllService" element={< AllMainService/>} />
             <Route path="/SuperAdmin/AddProductAdmin" element={< AddProductAdmin/>} />
             <Route path="/SuperAdmin/VendorCategory/:id" element={<  VendorCategory />} />
             <Route path="/SuperAdmin/VendorEnquiry/:id" element={< VendorAllEnquiry/>} />
          <Route path="/SuperAdmin/UpdateBanner/:id" element={< UpdateBanner/>} />
          <Route path="/SuperAdmin/AddSubCategoryAdmin" element={< AddSubCategoryAdmin/>} />
          
          <Route path="/SuperAdmin/ViewVendor/:id" element={< ViewVendor/>} />
          
          <Route path="/SuperAdmin/VendorBusiness/:id" element={< VendorBusiness/>} />
          <Route path="/SuperAdmin/AdminDashboard" element={< AdminDashboard />} />

          <Route path="/SuperAdmin/UpdateCategory/:id" element={< UpdateCategorySuperAdmin/>} />
          <Route path="/SuperAdmin/AllProduct" element={< AllProductSuperAdmin />} />
          <Route path="/SuperAdmin/AllSubcategory" element={< AllSubcategory />} />
          <Route path="/SuperAdmin/AddvendorBulk" element={<  AddvendorBulk />} />

         
          
          
          <Route path="/Vendor/Login" element={< VendorLogin />} />
          <Route path="/Vendor/Signup" element={< VendorSignup />} />
          <Route path="/ForgetPassword" element={< ForgetPassword />} />
          <Route path="/reset-password/:token" element={< ResetPassword />} />
          
          <Route path="/Vendor/businessDetails" element={< BusinessDetails />} />
          <Route path="/Vendor/sidebar" element={< Vendorsidebar />} />
          <Route path="/Vendor/AddCategory" element={< AddCategoryVendor />} />
          <Route path="/Vendor/AllCategory" element={< AllCategoryVendor />} />
          <Route path="/Vendor/UpdateCategory/:id" element={< UpdateCategoryVendor/>} />
        
          <Route path="/Vendor/Addproduct" element={< AddProductVendor />} /> 
          <Route path="/Vendor/AllProduct" element={< AllProductVendor />} />
          <Route path="/Vendor/UpdateProduct/:id" element={<UpdateProductVendor />} />
          <Route path="/Vendor/Dashboard" element={< VendorDashboard />} />
          <Route path="/Vendor/EditProfile" element={<  EditProfileVendor />} />
          <Route path="/Vendor/AllEnquiryVendor" element={<  AllEnquiry  />} />
          <Route path="/Vendor/VendorSelectPlan" element={<   VendorSelectPlan  />} />
          <Route path="/Vendor/SelectBusiness" element={<   SelectBusiness  />} />
          <Route path="/Vendor/AddService" element={<   AddService  />} />
          <Route path="/Vendor/AllService" element={<   AllService  />} />
          <Route path="/Vendor/UserProfile" element={<   UserProfile  />} />
          <Route path="/Vendor/VendorHeader" element={<   VendorHeader  />} />
          <Route path="/Vendor/BusinessProfile" element={<  BusinessProfile />} />
          <Route path="/Vendor/AddProductVendor" element={<  AddProductVendor2 />} />
          <Route path="/Vendor/MyOrders" element={<  MyOrders />} />
          
          
          <Route path="/Vendor/Websitepage" element={<  WebsitePage />} />
         
          <Route path="/Vendor/Homepage" element={<  HomePageForm />} />
          <Route path="/Vendor/AboutPage" element={< AboutPageForm />} />
          
        
          



          <Route path="/ImageSlider" element={<  ImageSlider />} />
          <Route path="/CategoryView/:category" element={< CategoryView/>} />
        
          <Route path="/ServiceView/:service" element={<ServiceView />} />

          <Route path="/ProductView/:id" element={<  ProductView/>} />

          <Route path="/UserDashboard/" element={< UserDashboard />}/>
          <Route path="/" element={<  Home />} />
          <Route path="/:businessName" element={<  VendorWebsite />} />
          <Route path="/:businessName/about" element={< VendorWebAbout />} />
          <Route path="/:businessName/product" element={<  VendorWebProduct />} />
          <Route path="/:businessName/contact" element={<   VendorWebContact />} />
          <Route path="/leadform" element={<   LeadForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
