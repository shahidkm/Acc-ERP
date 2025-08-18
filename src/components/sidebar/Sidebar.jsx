import React, { useState } from 'react';
import { 
  Home, 
  Receipt, 
  TrendingUp, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  Menu, 
  X,
  DollarSign,
  PieChart,
  Calculator,
  Building,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Calendar,
  Eye,
  Plus,
  Edit,
  Archive,
  UserPlus,
  MessageSquare,
  FileBarChart,
  Wallet,
  Banknote,
  TrendingDown,
  Shield,
  Bell,
  User,
  Palette,
  Database
} from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import for navigation
import {
setSubModule
} from "../../redux/slices/sidebar"

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigation hook
  const { SubModule } = useSelector((state) => state.sidebar);
  console.log(SubModule);
  
  const [isOpen, setIsOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState({ 'Dashboard': true });

  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      subItems: [
        { icon: Eye, label: 'Overview', href: '#overview', navigate: 'register' },
        { icon: BarChart3, label: 'Analytics', href: '#analytics', navigate: 'dashboard/analytics' },
        { icon: Calendar, label: 'Calendar', href: '#calendar', navigate: 'dashboard/calendar' },
        { icon: Bell, label: 'Notifications', href: '#notifications', navigate: 'dashboard/notifications' }
      ]
    },
    { 
      icon: Receipt, 
      label: 'Items', 
      subItems: [
        { icon: Plus, label: 'Create Product', href: '#new-transaction', navigate: 'items/create-product' },
        { icon: Eye, label: 'Category', href: '#all-transactions', navigate: 'create-product-category' },
        { icon: Edit, label: 'Product Warehouse', href: '#pending-transactions', navigate: 'create-product-warehouse' },
        { icon: Archive, label: 'Unit', href: '#transaction-history', navigate: 'create-product-unit' }
      ]
    },
    { 
      icon: DollarSign, 
      label: 'Accounts', 
      subItems: [
        { icon: Wallet, label: 'Chart of Accounts', href: '#chart-accounts', navigate: 'accounts/chart-of-accounts' },
        { icon: Banknote, label: 'Bank Accounts', href: '#bank-accounts', navigate: 'accounts/bank-accounts' },
        { icon: CreditCard, label: 'Credit Cards', href: '#credit-cards', navigate: 'accounts/credit-cards' },
        { icon: Plus, label: 'Add Account', href: '#add-account', navigate: 'accounts/add-account' }
      ]
    },
    { 
      icon: FileText, 
      label: 'Sales', 
      subItems: [

         { icon: Archive, label: 'Paid', href: '#paid-invoices', navigate: 'invoices/paid' },
          { icon: Archive, label: 'Paid', href: '#paid-invoices', navigate: 'invoices/paid' },
             { icon: Archive, label: 'Paid', href: '#paid-invoices', navigate: 'invoices/paid' },
      ]
    },
        { 
      icon: FileText, 
      label: 'Customer', 
      subItems: [
       { icon: Plus, label: 'Customers', href: '#create-invoice', navigate: 'create-customer' },
        { icon: Eye, label: 'Add New Customer', href: '#all-invoices', navigate: '' },
        { icon: Edit, label: 'Edit Customer', href: '#draft-invoices', navigate: 'invoices/draft' },
        { icon: Archive, label: 'Remove Customer', href: '#paid-invoices', navigate: 'invoices/paid' },
         { icon: Archive, label: 'Customer Groups', href: '#paid-invoices', navigate: 'get-customer-groups' },
          { icon: Archive, label: 'Add New Customer Group', href: '#paid-invoices', navigate: 'create-customer-group' },
             { icon: Archive, label: 'Edit Customer Group', href: '#paid-invoices', navigate: 'invoices/paid' },
      ]
    },
    { 
      icon: CreditCard, 
      label: 'Expenses', 
      subItems: [
        { icon: Plus, label: 'Add Expense', href: '#add-expense', navigate: 'expenses/add' },
        { icon: Eye, label: 'View Expenses', href: '#view-expenses', navigate: 'expenses/view' },
        { icon: Receipt, label: 'Receipts', href: '#receipts', navigate: 'expenses/receipts' },
        { icon: TrendingDown, label: 'Categories', href: '#expense-categories', navigate: 'expenses/categories' }
      ]
    },
    { 
      icon: TrendingUp, 
      label: 'Reports', 
      subItems: [
        { icon: FileBarChart, label: 'Financial Reports', href: '#financial-reports', navigate: 'reports/financial' },
        { icon: PieChart, label: 'Profit & Loss', href: '#profit-loss', navigate: 'reports/profit-loss' },
        { icon: BarChart3, label: 'Cash Flow', href: '#cash-flow', navigate: 'reports/cash-flow' },
        { icon: Calendar, label: 'Tax Reports', href: '#tax-reports', navigate: 'reports/tax' }
      ]
    },
    { 
      icon: PieChart, 
      label: 'Analytics', 
      subItems: [
        { icon: TrendingUp, label: 'Revenue Trends', href: '#revenue-trends', navigate: 'analytics/revenue-trends' },
        { icon: BarChart3, label: 'Expense Analysis', href: '#expense-analysis', navigate: 'analytics/expense-analysis' },
        { icon: Eye, label: 'Performance', href: '#performance', navigate: 'analytics/performance' },
        { icon: Calendar, label: 'Forecasting', href: '#forecasting', navigate: 'analytics/forecasting' }
      ]
    },
    { 
      icon: Users, 
      label: 'Clients', 
      subItems: [
        { icon: Eye, label: 'All Clients', href: '#all-clients', navigate: 'clients/all' },
        { icon: UserPlus, label: 'Add Client', href: '#add-client', navigate: 'clients/add' },
        { icon: MessageSquare, label: 'Communications', href: '#communications', navigate: 'clients/communications' },
        { icon: FileText, label: 'Client Reports', href: '#client-reports', navigate: 'clients/reports' }
      ]
    },
    { 
      icon: Calculator, 
      label: 'Tax Center', 
      subItems: [
        { icon: FileText, label: 'Tax Returns', href: '#tax-returns', navigate: 'tax/returns' },
        { icon: Calendar, label: 'Tax Calendar', href: '#tax-calendar', navigate: 'tax/calendar' },
        { icon: Calculator, label: 'Calculations', href: '#tax-calculations', navigate: 'tax/calculations' },
        { icon: Archive, label: 'Archived Returns', href: '#archived-returns', navigate: 'tax/archived' }
      ]
    },
    { 
      icon: Building, 
      label: 'Assets', 
      subItems: [
        { icon: Eye, label: 'Fixed Assets', href: '#fixed-assets', navigate: 'assets/fixed' },
        { icon: TrendingDown, label: 'Depreciation', href: '#depreciation', navigate: 'assets/depreciation' },
        { icon: Plus, label: 'Add Asset', href: '#add-asset', navigate: 'assets/add' },
        { icon: FileText, label: 'Asset Reports', href: '#asset-reports', navigate: 'assets/reports' }
      ]
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      subItems: [
        { icon: User, label: 'Profile', href: '#profile', navigate: 'settings/profile' },
        { icon: Shield, label: 'Security', href: '#security', navigate: 'settings/security' },
        { icon: Palette, label: 'Preferences', href: '#preferences', navigate: 'settings/preferences' },
        { icon: Database, label: 'Backup', href: '#backup', navigate: 'settings/backup' }
      ]
    }
  ];

  const toggleModule = (moduleLabel) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleLabel]: !prev[moduleLabel]
    }));
  };

  const handleSubItemClick = (subItem) => {
    // Update Redux state
    dispatch(setSubModule(subItem.label));
    
    // Navigate to the specified route
    if (subItem.navigate) {
      navigate(`/${subItem.navigate}`);
    }
    
    // Close mobile menu when item is selected
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
        style={{ backgroundColor: '#f29f67' }}
      >
        <div className="relative w-6 h-6">
          <Menu 
            size={24} 
            className={`absolute text-white transition-all duration-300 ${isOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} 
          />
          <X 
            size={24} 
            className={`absolute text-white transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} 
          />
        </div>
      </button>

      {/* Sidebar - Enhanced Fixed Position */}
      <div 
        className={`
          fixed top-0 left-0 h-screen z-45 transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          w-72 flex flex-col shadow-2xl
          overflow-hidden
        `}
        style={{ 
          backgroundColor: '#1e1e2c',
          maxHeight: '100vh',
          minHeight: '100vh'
        }}
      >
        
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 p-8 border-b border-gray-700/30">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: '#f29f67' }}
            >
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold tracking-tight">AccuBooks</h2>
              <p className="text-gray-400 text-sm font-medium">Professional Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable middle section */}
        <nav className="flex-1 p-6 overflow-y-auto custom-scrollbar min-h-0">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isExpanded = expandedModules[item.label];
              
              return (
                <div key={index} className="mb-2">
                  {/* Main Module */}
                  <button
                    onClick={() => toggleModule(item.label)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                      text-gray-300 hover:text-white hover:bg-gray-700/30
                    `}
                  >
                    <IconComponent size={20} className="text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
                    <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400 transition-transform duration-200" />
                    )}
                  </button>

                  {/* Sub-modules */}
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-700/30 pl-4">
                      {item.subItems.map((subItem, subIndex) => {
                        const SubIconComponent = subItem.icon;
                        const isActive = SubModule === subItem.label;
                        
                        return (
                          <button
                            key={subIndex}
                            onClick={() => handleSubItemClick(subItem, item.label)}
                            className={`
                              w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group text-left
                              ${isActive 
                                ? 'text-white shadow-md transform scale-[1.02]' 
                                : 'text-gray-400 hover:text-white'
                              }
                            `}
                            style={{
                              backgroundColor: isActive ? '#f29f67' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'rgba(242, 159, 103, 0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <SubIconComponent 
                              size={16} 
                              className={`transition-colors duration-200 ${
                                isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-400'
                              }`} 
                            />
                            <span className="font-medium text-xs">{subItem.label}</span>
                            {isActive && (
                              <div className="ml-auto">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Profile Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-6 border-t border-gray-700/30">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/40 to-gray-700/20 border border-gray-600/20 hover:border-orange-400/30 transition-all duration-300 cursor-pointer group">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
              style={{ backgroundColor: '#f29f67' }}
            >
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">Administrator</p>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f29f67' }}></div>
          </div>
        </div>
      </div>

      {/* Content area for components like CreateCategory */}
      <div>
        {SubModule === "Category" && <CreateCategory/>}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #f29f67 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f29f67;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e8905a;
        }

        /* Ensure the sidebar stays fixed during scroll */
        body {
          overflow-x: hidden;
        }
        
        @media (min-width: 1024px) {
          body {
            padding-left: 288px; /* Width of sidebar (w-72 = 18rem = 288px) */
          }
        }
      `}</style>
    </>
  );
}