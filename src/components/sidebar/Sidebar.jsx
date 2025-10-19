import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home, Receipt, TrendingUp, Users, CreditCard, FileText, Settings,
  Menu, X, DollarSign, PieChart, Calculator, Building, ChevronDown,
  ChevronRight, BarChart3, Calendar, Eye, Plus, Edit, Archive,
  UserPlus, MessageSquare, FileBarChart, Wallet, Banknote, TrendingDown,
  Shield, Bell, User, Palette, Database, Package, ShoppingCart, Truck,
  FileInput, FileOutput, ArrowUpRight, ArrowDownLeft,
  Wallet as CreditCardIcon, BookOpen, Users2, Building2, Briefcase,
  Target, Activity, Layers, Grid3x3, Package2, Tags, Boxes,
  ClipboardList, ShoppingBag, FileCheck, RotateCcw, ArrowUpDown,
  GitBranch, Factory, MapPin, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  setSubModule,
  setMainModule,
  setActiveModules,
  setExpandedModules,
  toggleModule
} from "../../redux/slices/sidebar";

export default function EnhancedSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const { SubModule, MainModule, expandedModules } = useSelector(state => state.sidebar);

  // Local state only for mobile menu
  const [isOpen, setIsOpen] = React.useState(false);

  const SIDEBAR_WIDTH = 'w-72';

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      color: '#3b82f6',
      subItems: [
        { icon: Eye, label: 'Overview', href: '#overview', navigate: ' ' },
      
      ]
    },
    {
      icon: Wallet,
      label: 'Accounts',
      color: '#10b981',
      subItems: [
        { icon: BookOpen, label: 'Account Category', href: '#chart-accounts', navigate: 'get-account-categories' },
        { icon: Building2, label: 'Account Group', href: '#bank-accounts', navigate: 'get-account-groups' },
        { icon: CreditCardIcon, label: 'Account Master', href: '#credit-cards', navigate: 'get-account-masters' },
        { icon: Plus, label: 'Account Enquiry', href: '#add-account', navigate: 'account-enquiry' },
        { icon: Plus, label: 'Address List', href: '#add-account', navigate: 'address-list' },
        { icon: Plus, label: 'Reconciliation', href: '#add-account', navigate: 'reconciliation' }
      ]
    },
    {
      icon: TrendingUp,
      label: 'Maintenance',
      color: '#f59e0b',
      subItems: [
        { icon: Receipt, label: 'Job Master', href: '#paid-invoices', navigate: 'get-job-masters' },
        { icon: FileCheck, label: 'Salesman', href: '#paid-invoices', navigate: 'get-salesmen' },
        { icon: BarChart3, label: 'Department', href: '#paid-invoices', navigate: 'get-departments' },
        { icon: BarChart3, label: 'Bank', href: '#paid-invoices', navigate: 'get-banks' },
        { icon: BarChart3, label: 'Currency', href: '#paid-invoices', navigate: 'get-currencies' },
        { icon: BarChart3, label: 'Area', href: '#paid-invoices', navigate: 'get-areas' },
        { icon: BarChart3, label: 'Location', href: '#paid-invoices', navigate: 'get-locations' },
        { icon: BarChart3, label: 'Country', href: '#paid-invoices', navigate: 'get-countries' },
        { icon: BarChart3, label: 'Vat Master', href: '#paid-invoices', navigate: 'get-vat-masters' },
      ]
    },
    {
      icon: Package,
      label: 'Inventory',
      color: '#8b5cf6',
      subItems: [
        { icon: Layers, label: 'Group', href: '#chart-accounts', navigate: 'get-groups' },
        { icon: Grid3x3, label: 'Sub Group', href: '#bank-accounts', navigate: 'get-sub-groups' },
        { icon: Tags, label: 'Category', href: '#credit-cards', navigate: 'get-categories' },
        { icon: Package2, label: 'Sub Category', href: '#add-account', navigate: 'get-sub-categories' },
        { icon: Boxes, label: 'Unit', href: '#add-account', navigate: 'get-units' },
        { icon: ClipboardList, label: 'Item Master', href: '#add-account', navigate: 'get-items' },
        { icon: Eye, label: 'Item Enquiry', href: '#add-account', navigate: 'accounts/add-account' },
        { icon: FileInput, label: 'Material Requisition', href: '#add-account', navigate: 'accounts/add-account' },
        { icon: FileText, label: 'Quotation Purchase', href: '#add-account', navigate: 'create-quotation-purchase' },
        { icon: ShoppingCart, label: 'Purchase Order', href: '#add-account', navigate: 'purchase-orders' },
        { icon: Truck, label: 'Goods Receipt Note', href: '#add-account', navigate: 'goods-receipt-notes' },
        { icon: FileCheck, label: 'Purchase Invoice', href: '#add-account', navigate: 'get-purchase-invoices' },
        { icon: RotateCcw, label: 'Purchase Return', href: '#add-account', navigate: 'get-purchase-return-invoices' },
        { icon: MessageSquare, label: 'Customer Enquiry', href: '#add-account', navigate: 'customer-enquiries' },
        { icon: FileText, label: 'Quotation Sales', href: '#add-account', navigate: 'quotation-sales' },
        { icon: Building, label: 'Quotation Rental', href: '#add-account', navigate: 'quotation-rental' },
        { icon: ShoppingBag, label: 'Sales Order', href: '#add-account', navigate: 'sales-orders' },
        { icon: Truck, label: 'Delivery Order', href: '#add-account', navigate: 'create-delivery-order' },
        { icon: Receipt, label: 'Sales Invoice', href: '#add-account', navigate: 'sales-vouchers' },
        { icon: RotateCcw, label: 'Sales Return', href: '#add-account', navigate: 'sales-return' },
        { icon: ArrowUpRight, label: 'Stock Transfer in', href: '#add-account', navigate: 'stock-transfer-in' },
        { icon: ArrowDownLeft, label: 'Stock Transfer out', href: '#add-account', navigate: 'stock-transfer-out' },
        { icon: FileOutput, label: 'Goods Issued Note', href: '#add-account', navigate: 'accounts/add-account' },
        { icon: RotateCcw, label: 'Goods Return', href: '#add-account', navigate: 'accounts/add-account' },
        { icon: Factory, label: 'Manufacture Voucher', href: '#add-account', navigate: 'accounts/add-account' },
        { icon: MapPin, label: 'Location Transfer', href: '#add-account', navigate: 'accounts/add-account' },
      ]
    },
    {
      icon: ShoppingCart,
      label: 'Transactions',
      color: '#ef4444',
      subItems: [
        { icon: FileInput, label: 'Journal', href: '#paid-invoices', navigate: 'journal-vouchers' },
        { icon: FileCheck, label: 'Receipt Voucher', href: '#paid-invoices', navigate: 'receipt-vouchers' },
        { icon: BarChart3, label: 'Payment Voucher', href: '#paid-invoices', navigate: 'payment-vouchers' },
        { icon: BarChart3, label: 'Purchase Voucher', href: '#paid-invoices', navigate: 'purchase-non-stock-vouchers' },
        { icon: BarChart3, label: 'Sales Voucher', href: '#paid-invoices', navigate: 'sales-non-stock-vouchers' },
        { icon: BarChart3, label: 'Customer Receipt', href: '#paid-invoices', navigate: 'customer-receipt-vouchers' },
        { icon: BarChart3, label: 'Supplier Payment', href: '#paid-invoices', navigate: 'supplier-payment-vouchers' },
        { icon: BarChart3, label: 'Contra Voucher', href: '#paid-invoices', navigate: 'contra-vouchers' },
        { icon: BarChart3, label: 'Print Cheque', href: '#paid-invoices', navigate: 'cheques' },
        { icon: BarChart3, label: 'Advance Set Off', href: '#paid-invoices', navigate: 'invoices/paid' },
        { icon: BarChart3, label: 'Petty Cash', href: '#paid-invoices', navigate: 'invoices/paid' },
      ]
    },
    {
      icon: ArrowDownLeft,
      label: 'Reports',
      color: '#dc2626',
      subItems: [
        { icon: CreditCard, label: 'Voucherwise Report', href: '#paid-invoices', navigate: 'voucher-reports' },
        { icon: FileCheck, label: 'Account Statement', href: '#paid-invoices', navigate: 'account-enquiry' },
        { icon: BarChart3, label: 'Trial Balance', href: '#paid-invoices', navigate: 'trial-balance' },
        { icon: BarChart3, label: 'Balance Sheet', href: '#paid-invoices', navigate: 'balance-sheet' },
         { icon: BarChart3, label: 'Quantity Report', href: '#paid-invoices', navigate: 'quantity-report' }
      ]
    }
  ];

  const handleMainModuleClick = (moduleLabel) => {
    dispatch(setMainModule(moduleLabel));
    dispatch(setSubModule(null));
  };

  const handleBackToMain = () => {
    dispatch(setMainModule(null));
    dispatch(setSubModule(null));
  };

  const handleSubItemClick = (subItem, mainModuleLabel) => {
    dispatch(setActiveModules({
      mainModule: mainModuleLabel,
      subModule: subItem.label
    }));
    setIsOpen(false);

    if (subItem.navigate) {
      navigate(`/${subItem.navigate}`);
    }
  };

  const currentModule = menuItems.find(item => item.label === MainModule);
  const showSubSidebar = !!MainModule;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu button */}
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

      {/* Main Sidebar */}
      {!showSubSidebar && (
        <div
          className={`
            fixed top-0 left-0 h-screen z-45 transform transition-all duration-300 ease-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            ${SIDEBAR_WIDTH} flex flex-col shadow-2xl
            overflow-hidden
          `}
          style={{
            backgroundColor: '#1e1e2c',
            maxHeight: '100vh',
            minHeight: '100vh'
          }}
        >
          {/* Header */}
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

          {/* Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto custom-scrollbar min-h-0">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                const isMainModuleActive = MainModule === item.label;

                return (
                  <div key={index} className="mb-2">
                    <button
                      onClick={() => handleMainModuleClick(item.label)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                        ${isMainModuleActive
                          ? 'text-white shadow-lg transform scale-[1.02]'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                        }
                      `}
                      style={{
                        backgroundColor: isMainModuleActive ? item.color : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!isMainModuleActive) {
                          e.currentTarget.style.backgroundColor = `${item.color}20`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMainModuleActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <IconComponent
                        size={20}
                        className={`transition-colors duration-200 ${isMainModuleActive ? 'text-white' : 'text-gray-400'}`}
                        style={{ color: isMainModuleActive ? 'white' : item.color }}
                      />
                      <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                      {isMainModuleActive && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${isMainModuleActive ? 'text-white' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* User Profile Footer */}
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
      )}

      {/* Sub-navigation Sidebar */}
      {showSubSidebar && currentModule && (
        <div
          className={`
            fixed top-0 left-0 h-screen z-45 transform transition-all duration-300 ease-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            ${SIDEBAR_WIDTH} flex flex-col shadow-2xl
            overflow-hidden
          `}
          style={{
            backgroundColor: '#2a2a3e',
            maxHeight: '100vh',
            minHeight: '100vh'
          }}
        >
          {/* Sub Header with Back Button */}
          <div className="flex-shrink-0 p-6 border-b border-gray-600/30">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={handleBackToMain}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
                title="Back to main menu"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Main Menu
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: currentModule.color }}
              >
                <currentModule.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentModule.label}</h3>
                <p className="text-xs text-gray-400">{currentModule.subItems.length} items</p>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar min-h-0">
            <div className="space-y-1">
              {currentModule.subItems.map((subItem, subIndex) => {
                const SubIconComponent = subItem.icon;
                const isSubItemActive = SubModule === subItem.label && MainModule === currentModule.label;

                return (
                  <button
                    key={subIndex}
                    onClick={() => handleSubItemClick(subItem, currentModule.label)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group text-left
                      ${isSubItemActive
                        ? 'text-white shadow-md transform scale-[1.02]'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                      }
                    `}
                    style={{
                      backgroundColor: isSubItemActive ? currentModule.color : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubItemActive) {
                        e.currentTarget.style.backgroundColor = `${currentModule.color}20`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubItemActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <SubIconComponent
                      size={18}
                      className={`transition-colors duration-200 ${isSubItemActive ? 'text-white' : 'text-gray-500'}`}
                      style={{ color: isSubItemActive ? 'white' : currentModule.color }}
                    />
                    <span className="font-medium text-sm">{subItem.label}</span>
                    {isSubItemActive && (
                      <div className="ml-auto">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile Footer */}
          <div className="flex-shrink-0 p-6 border-t border-gray-600/30">
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
      )}

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

        body {
          overflow-x: hidden;
        }
        
        @media (min-width: 1024px) {
          body {
            padding-left: 288px;
          }
        }
      `}</style>
    </>
  );
}