import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiMessageSquare, 
  FiCheckSquare,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

export default function MainLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState('Project LSBU');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Messages', href: '/messages', icon: FiMessageSquare },
    { name: 'Tasks', href: '/tasks', icon: FiCheckSquare },
    { name: 'Members', href: '/members', icon: FiUsers },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  const projects = [
    { id: 1, name: 'Collaboration Tool', color: 'blue' },
    { id: 2, name: 'Website Redesign', color: 'yellow' },
    { id: 3, name: 'Design System', color: 'purple' },
    { id: 4, name: 'Wireframes', color: 'blue' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`w-64 bg-white border-r border-gray-200 fixed h-full transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
        <div className="p-4 flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
          <h1 className="text-lg font-semibold">{currentProject}</h1>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 ${location.pathname === item.href ? 'bg-gray-100 text-indigo-600' : ''}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-8 px-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Projects
          </h3>
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500 mb-2">MY PROJECTS</h4>
            <ul className="space-y-1">
              {projects.map((project) => (
                <li key={project.id} className="flex items-center">
                  <span 
                    className={`h-2 w-2 rounded-full ${project.color === 'blue' ? 'bg-blue-500' : project.color === 'yellow' ? 'bg-yellow-500' : project.color === 'purple' ? 'bg-purple-500' : 'bg-gray-500'} mr-2`}
                  ></span>
                  <button 
                    onClick={() => setCurrentProject(project.name)}
                    className={`text-sm ${currentProject === project.name ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-64 border-t border-gray-200">
          <div className="p-4">
            <div className="bg-yellow-100 rounded-lg p-4">
              <h4 className="font-medium text-sm">Feedback</h4>
              <p className="text-xs text-gray-600 mt-1">How can we improve?</p>
            </div>
            
            <button 
              onClick={signOut}
              className="mt-4 flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiLogOut className="h-4 w-4 mr-2" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto ml-64 sm:ml-0">
        <button 
          className="sm:hidden p-4 fixed top-0 left-0 z-50 bg-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
        <Outlet />
      </div>
    </div>
  );
}
