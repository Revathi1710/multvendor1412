import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'; // Import your CSS for styling

const Sidebar = () => {
  // State to track the active submenu
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Function to handle submenu toggle
  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  return (
    <aside className="sidebar">
      <div id="leftside-navigation" className="nano">
        <ul className="nano-content">
          <li>
            <Link to="/SuperAdmin/AdminDashboard"><i className="fa fa-dashboard"></i><span>Dashboard</span></Link>
          </li>
          
          <li>
            <Link to="/SuperAdmin/Plandetails"><i className="fa fa-dashboard"></i><span>Plan Details</span></Link>
          </li>
          <li className={`sub-menu ${activeSubMenu === 0 ? 'active' : ''}`}>
            <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(0)}>
              <i className="fa fa-cogs"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
            </a>
            <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }}>
              <li><Link to="/SuperAdmin/AllCategories">All Categories</Link></li>
              <li><Link to="/SuperAdmin/AddCategory">Add Category</Link></li>
              <li><Link to="/SuperAdmin/AllSubCategory">All Subcategories</Link></li>
              <li><Link to="/SuperAdmin/AddSubCategoryAdmin">Add Subcategory</Link></li>
            </ul>
          </li>
          <li className={`sub-menu ${activeSubMenu ===7 ? 'active' : ''}`}>
            <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(7)}>
              <i className="fa fa-cogs"></i><span> Product</span><i className="arrow fa fa-angle-right pull-right"></i>
            </a>
            <ul style={{ display: activeSubMenu === 7 ? 'block' : 'none' }}>
              <li><Link to="/SuperAdmin/AllProduct">All Products</Link></li>
              <li><Link to="/SuperAdmin/AddProductAdmin">Add Product</Link></li>
            </ul>
          </li>
          <li className={`sub-menu ${activeSubMenu === 6 ? 'active' : ''}`}>
            <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(6)}>
              <i className="fa fa-cogs"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
            </a>
            <ul style={{ display: activeSubMenu === 6 ? 'block' : 'none' }}>
              <li><Link to="/SuperAdmin/AllService">All Service</Link></li>
              <li><Link to="/SuperAdmin/AddMainService">Add Service</Link></li>
            </ul>
          </li>
          <li className={`sub-menu ${activeSubMenu === 1 ? 'active' : ''}`}>
            <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(1)}>
              <i className="fa fa-cogs"></i><span>Vendors</span><i className="arrow fa fa-angle-right pull-right"></i>
            </a>
            <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }}>
              <li><Link to="/SuperAdmin/AllVendors">All Vendors</Link></li>
              <li><Link to="/SuperAdmin/AddVendor">Add Vendor</Link></li>
              <li><Link to=" /SuperAdmin/AddvendorBulk">Add Vendor Bulk</Link></li>
             
            </ul>
          </li>
          <li className={`sub-menu ${activeSubMenu === 2 ? 'active' : ''}`}>
            <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(2)}>
              <i className="fa fa-cogs"></i><span>User</span><i className="arrow fa fa-angle-right pull-right"></i>
            </a>
            <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }}>
              <li><Link to="/SuperAdmin/AllUser">All Users</Link></li>
              <li><Link to="/SuperAdmin/AddUser">Add User</Link></li>
            </ul>
          </li>
          <li className={`sub-menu ${activeSubMenu === 3? 'active' : ''}`}>
            <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(3)}>
              <i className="fa fa-cogs"></i><span>Homepage Setting</span><i className="arrow fa fa-angle-right pull-right"></i>
            </a>
            <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }}>
              <li><Link to="/SuperAdmin/AllSlider">All Slider</Link></li>
              <li><Link to="/SuperAdmin/AllBanner">All Banner</Link></li>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
