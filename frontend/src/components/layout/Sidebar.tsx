import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, PieChart, Settings,
  ChevronLeft, ChevronRight, UsersRound, Truck, ShoppingBag, ChartColumn,
  CreditCard, Tags, History, Boxes, Receipt, CircleDollarSign, Plus, UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

import zyncoLogo from '@/assets/icons/zyncoLogo.png';
import sidebarDropArrow from '@/assets/icons/sidebarDropArrow.png';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [salesDropdownOpen, setSalesDropdownOpen] = useState(
    location.pathname.includes('/add-sales') || location.pathname.includes('/sales') || location.pathname.includes('/payment-in-history')
  );
  const [purchaseDropdownOpen, setPurchaseDropdownOpen] = useState(
    location.pathname.includes('/purchase')
  );
  const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(
    location.pathname.includes('/inventory')
  );

  // Keep dropdowns open when navigating
  useEffect(() => {
    if (location.pathname.includes('/add-sales') || location.pathname.includes('/sales') || location.pathname.includes('/payment-in-history')) {
      setSalesDropdownOpen(true);
    } else {
      setSalesDropdownOpen(false);
    }
    if (location.pathname.includes('/payment-in')) {
      setSalesDropdownOpen(true);
    }
    if (location.pathname.includes('/purchase')) {
      setPurchaseDropdownOpen(true);
    }
    if (location.pathname.includes('/inventory')) {
      setInventoryDropdownOpen(true);
    }
    
  }, [location.pathname]);

  // Extract franchiseId from the URL
  const pathParts = location.pathname.split('/');
  const franchiseId = pathParts[1];

  const menuItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <LayoutDashboard size={20} /> },
    {
      name: 'Inventory',
      icon: <Package size={20} />,
      isDropdown: true,
      subItems: [
        { name: 'Products', path: 'inventory', icon: <Boxes size={16} /> },
        { name: 'Manage Category', path: 'inventory/category', icon: <Tags size={16} /> },
      ],
    },
    {
      name: 'Sales Management',
      icon: <ShoppingCart size={20} />,
      isDropdown: true,
      subItems: [
        { name: 'Add Sales', path: 'sales/add', icon: <Plus size={16} /> },
        { name: 'Sales History', path: 'sales', icon: <History size={16} /> },
        { name: 'Add Payment In', path: 'payment-in', icon: <Plus size={16} /> },
        { name: 'Payment In History', path: 'payment-in-history', icon: <Receipt size={16} /> },
      ],
    },
    { name: 'Customers', path: 'customers', icon: <UsersRound size={20} /> },
    {
      name: 'Purchase',
      icon: <ShoppingBag size={20} />,
      isDropdown: true,
      subItems: [
        { name: 'Purchase History', path: 'purchase/history', icon: <History size={16} /> },
        { name: 'Payment Out', path: 'purchase/payment-out', icon: <CircleDollarSign size={16} /> },
      ],
    },
    { name: 'Supplier', path: 'supplier', icon: <Truck size={20} /> },
    { name: 'Reports', path: 'reports', icon: <ChartColumn size={20} /> },
    { name: 'Manage BDE', path: 'bde', icon: <UserCheck size={20} /> },
    { name: 'Settings', path: 'settings', icon: <Settings size={20} /> },
  ];

  const handleSubItemClick = (path: string) => {
    navigate(`/${franchiseId}/${path}`);
  };

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col',
      collapsed ? 'w-[80px]' : 'w-[280px]' // Changed from w-[240px] to w-[280px]
    )}>
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <img src={zyncoLogo} alt="Zynco Logo" width={28} height={28} className="object-contain" />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold text-black">
              Zynco
            </h1>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className={cn(
            "ml-auto p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-transform duration-300",
            collapsed ? "rotate-180" : ""
          )}
        >
          <img
            src={sidebarDropArrow}
            alt="Toggle sidebar"
            width={18}
            height={18}
            className="transition-transform duration-300"
          />
        </button>
      </div>

      <div className="mt-2 px-2">
        {collapsed && <p className="text-xs text-gray-500 text-center mb-2">MENU</p>}
        {!collapsed && <p className="text-xs text-gray-500 px-3 py-2">MAIN MENU</p>}

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            if (item.isDropdown) {
              const isDropdownOpen = item.name === 'Sales Management' 
                ? salesDropdownOpen 
                : item.name === 'Purchase' 
                  ? purchaseDropdownOpen 
                  : item.name === 'Inventory'
                    ? inventoryDropdownOpen
                    : false;
              
              const setDropdownOpen = item.name === 'Sales Management'
                ? setSalesDropdownOpen
                : item.name === 'Purchase'
                  ? setPurchaseDropdownOpen
                  : item.name === 'Inventory'
                    ? setInventoryDropdownOpen
                    : () => {};

              return (
                <div key={item.name} className="flex flex-col">
                  <button
                    onClick={() => !collapsed && setDropdownOpen(!isDropdownOpen)}
                    className={cn(
                      'sidebar-item',
                      'flex items-center justify-between',
                      isDropdownOpen && !collapsed && 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronRight
                        size={16}
                        className={cn(
                          'transition-transform',
                          isDropdownOpen && 'rotate-90'
                        )}
                      />
                    )}
                  </button>
                  {!collapsed && isDropdownOpen && (
                    <div className="ml-6 flex flex-col gap-1 mt-1">
                      {item.subItems?.map((subItem) => (
                        <button
                          key={subItem.path}
                          onClick={() => handleSubItemClick(subItem.path)}
                          className={cn(
                            'sidebar-item text-sm py-2.5',
                            'flex items-center gap-3',
                            location.pathname === `/${franchiseId}/${subItem.path}` && 'active'
                          )}
                        >
                          <span className="text-gray-500">{subItem.icon}</span>
                          <span>{subItem.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const fullPath = `/${franchiseId}/${item.path}`;
            return (
              <button
                key={item.path}
                onClick={() => navigate(fullPath)}
                className={cn(
                  'sidebar-item',
                  location.pathname === fullPath && 'active'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
