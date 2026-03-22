import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Map, UtensilsCrossed, Users, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: '지도', path: '/map', icon: Map },
  { label: '레시피', path: '/recipe', icon: UtensilsCrossed },
  { label: '커뮤니티', path: '/community', icon: Users },
];

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 h-14 flex items-center border-b border-border bg-card px-4 md:px-6 gap-4">
      <Link
        to="/"
        className="text-base font-bold text-foreground hover:text-primary transition-colors mr-2"
      >
        카페 도감
      </Link>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
