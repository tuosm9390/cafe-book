import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, children, className }) => {
  return (
    <div
      className={cn(
        "flex h-full w-full overflow-hidden bg-background flex-col md:flex-row",
        className,
      )}
    >
      {/* Sidebar Area */}
      <aside className="w-full md:w-96 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-border bg-card shadow-lg z-10 overflow-y-auto">
        {sidebar}
      </aside>

      {/* Main Content Area (Map) */}
      <main className="flex-1 relative h-2/3 md:h-full">{children}</main>
    </div>
  );
};

export default Layout;
