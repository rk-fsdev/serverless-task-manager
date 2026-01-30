import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  PlusIcon, 
  UserIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, mobile = false }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'All Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'New Task', href: '/tasks/new', icon: PlusIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-primary-600">
          Task Manager
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={mobile ? onClose : undefined}
                >
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${
                      active ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6">
        <div className="text-xs text-gray-500">
          <p>Task Manager v1.0.0</p>
          <p>Built with React & AWS</p>
        </div>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <>
        {/* Mobile backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-500 bg-opacity-75 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </div>
      </>
    );
  }

  return <SidebarContent />;
};

export default Sidebar;
