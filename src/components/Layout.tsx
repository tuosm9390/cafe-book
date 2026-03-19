import React, { ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 flex-col md:flex-row">
      {/* Sidebar Area */}
      <aside className="w-full md:w-80 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-gray-200 bg-white shadow-lg z-10 overflow-y-auto">
        {sidebar}
      </aside>

      {/* Main Content Area (Map) */}
      <main className="flex-1 relative h-2/3 md:h-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
