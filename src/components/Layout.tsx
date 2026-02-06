import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, PackagePlus, ClipboardList, ClipboardCheck, 
  Wrench, Package, ArrowUpDown, History, Menu, X, Search, Cog
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/component-in', label: 'Component In', icon: PackagePlus },
  { path: '/registration', label: 'Registration', icon: ClipboardList },
  { path: '/qa-tracker', label: 'QA Tracker', icon: ClipboardCheck },
  { path: '/fabrication', label: 'Fabrication Request', icon: Wrench },
  { path: '/rfu-stock', label: 'RFU Stock', icon: Package },
  { path: '/install-remove', label: 'Install / Remove', icon: ArrowUpDown },
  { path: '/timeline', label: 'Component History', icon: History },
];

function SidebarContent({ currentPath }: { currentPath: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Cog className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">ROTABLE</h1>
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Component Tracking</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Navigation
        </p>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = currentPath === path || (path !== '/' && currentPath.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-foreground">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">Ahmad Kurniawan</p>
            <p className="text-[10px] text-sidebar-foreground/50">Mechanic</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-shrink-0 bg-sidebar flex-col">
        <SidebarContent currentPath={location.pathname} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-card border-b flex items-center gap-4 px-4 lg:px-6 flex-shrink-0">
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 -ml-2 rounded-md hover:bg-muted transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px] bg-sidebar border-sidebar-border">
              <SidebarContent currentPath={location.pathname} />
            </SheetContent>
          </Sheet>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search component ID, serial number..." 
                className="pl-9 h-9 bg-muted/50 border-0 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">Track Component Workshop</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
