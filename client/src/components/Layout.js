import React, { useState } from 'react';
import '../layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const userMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-line'
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: 'ri-calendar-line'
    },
    {
      name: 'Apply Doctor',
      path: '/apply-doctor',
      icon: 'ri-hospital-line'
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: 'ri-user-line'
    }
  ];

  const doctorMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-line'
    },
    {
      name: 'Appointments',
      path: '/doctor/appointments',
      icon: 'ri-calendar-line'
    },
    {
      name: 'Profile',
      path: '/doctor/profile',
      icon: 'ri-user-line'
    }
  ];

  const adminMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'ri-home-line'
    },
    {
      name: 'Users',
      path: '/admin/userslist',
      icon: 'ri-user-line'
    },
    {
      name: 'Doctors',
      path: '/admin/doctorslist',
      icon: 'ri-hospital-line'
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: 'ri-user-line'
    }
  ];

  const menuToBeRendered = user?.role === 'admin' ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;

  return (
    <div className='main'>
      <div className='d-flex layout'>
        <div className={`sidebar ${collapsed ? 'collapsed-sidebar' : ''}`}>
          <div className='sidebar-header'>
            <h1 className='logo'>StayHealthy</h1>
          </div>

          <div className='menu'>
            {menuToBeRendered.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`d-flex menu-item ${isActive ? 'active-menu-item' : ''}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            <div
              className='d-flex menu-item'
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              <i className='ri-logout-box-line'></i>
              <span style={{ cursor: 'pointer' }}>Logout</span>
            </div>
          </div>
        </div>

        <div className='content'>
          <div className='header'>
            <div className='d-flex align-items-center justify-content-between w-100'>
              <i
                className={`${collapsed ? 'ri-menu-line' : 'ri-menu-fold-line'} header-action-icon`}
                onClick={() => setCollapsed(!collapsed)}
              ></i>

              <div className='d-flex align-items-center'>
                <div className='header-user-info'>
                  <span className='user-name'>{user?.name}</span>
                  <span className='user-role'>{user?.role === 'admin' ? 'Admin' : user?.isDoctor ? 'Doctor' : 'User'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='body'>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
