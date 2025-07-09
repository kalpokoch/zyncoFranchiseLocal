
import React, { useState, useEffect, useRef } from 'react';
import { Search, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FranchiseSwitcher: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="relative select-none" ref={ref}>
      <button
        className="flex items-center justify-center p-2 rounded-full hover:bg-blue-50 border border-blue-100 shadow-sm"
        onClick={() => setDropdownOpen((open) => !open)}
        aria-label="Switch Franchise"
      >
        <UserCog className="w-6 h-6 text-blue-600" />
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 font-medium"
            onClick={() => {
              setDropdownOpen(false);
              navigate('/franchise-select');
            }}
          >
            Switch Franchise
          </button>
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="relative w-[300px]">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="search"
          placeholder="Search product, order"
          className="bg-gray-50 pl-10 w-full border border-gray-200 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center justify-end flex-1">
        <FranchiseSwitcher />
      </div>
    </header>
  );
};

export default Header;
