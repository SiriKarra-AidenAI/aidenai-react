import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Layout store — replaces ExtJS ViewModel shared state:
//   navCollapsed, heading, navview_width, headerview_height, footerview_height
// ---------------------------------------------------------------------------

interface MenuItem {
  id: string;
  text: string;
  icon: string;
  path: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'home', text: 'Home', icon: 'Home', path: '/' },
  { id: 'request-form', text: 'Request Form', icon: 'FileText', path: '/requests/new' },
  { id: 'tracking', text: 'Tracking Panel', icon: 'TrendingUp', path: '/tracking' },
  { id: 'dashboard', text: 'Dashboard', icon: 'PieChart', path: '/dashboard' },
  // Note: TechD and TX menu items in ExtJS are duplicates pointing to dashboard — likely WIP
];

interface LayoutState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  toggleSidebar: () => void;

  // Header heading (dynamic, set by each page)
  heading: string;
  setHeading: (heading: string) => void;

  // Active menu item
  activeMenuItemId: string;
  setActiveMenuItemId: (id: string) => void;

  // Menu config (static, replaces inline ExtJS tree store)
  menuItems: MenuItem[];
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  sidebarCollapsed: false,
  sidebarWidth: 260,
  heading: 'Dashboard',
  activeMenuItemId: 'home',
  menuItems: MENU_ITEMS,

  toggleSidebar: () => {
    const collapsed = !get().sidebarCollapsed;
    set({
      sidebarCollapsed: collapsed,
      sidebarWidth: collapsed ? 64 : 260,
    });
  },

  setHeading: (heading) => set({ heading }),

  setActiveMenuItemId: (id) => set({ activeMenuItemId: id }),
}));
