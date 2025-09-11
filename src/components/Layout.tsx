import React from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠', permission: 'read', resource: 'dashboard' },
    { name: 'Courses', path: '/courses', icon: '📚', permission: 'read', resource: 'courses' },
    { name: 'Students', path: '/students', icon: '👥', permission: 'read', resource: 'students' },
    { name: 'Attendance', path: '/attendance', icon: '✅', permission: 'read', resource: 'attendance' },
    { name: 'Performance', path: '/performance', icon: '📊', permission: 'read', resource: 'performance' },
  ].filter(item => hasPermission(user, item.permission, item.resource));

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h5 className="text-white">ERP System</h5>
              <small className="text-muted">Welcome, {user.fullName}</small>
            </div>
            
            <ul className="nav flex-column">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('navigate', { detail: item.path }));
                    }}
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            
            <hr className="text-muted" />
            
            <ul className="nav flex-column">
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light btn-sm w-100"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
          <div className="pt-3 pb-2 mb-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Student Management ERP</h2>
              <span className="badge bg-primary">{user.role.toUpperCase()}</span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;