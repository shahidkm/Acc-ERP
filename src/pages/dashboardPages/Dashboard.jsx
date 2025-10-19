import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, FileText, Users, Warehouse, DollarSign, TrendingUp, BarChart3, ClipboardList, UserCircle, Building2, Receipt, CreditCard, Wallet, FileSpreadsheet, PieChart, Calculator, BookOpen } from 'lucide-react';
import Sidebar from "../../components/sidebar/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {/* Sales Order Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Sales Order</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-sales-order')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileText className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Sale</span>
              </button>
              <button 
                onClick={() => navigate('/sales-orders')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <ClipboardList className="w-5 h-5 text-orange-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Sale</span>
              </button>
            </div>
          </div>

          {/* New Order Section */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-500 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Purchase Order</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-purchase-order')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileText className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Order</span>
              </button>
              <button 
                onClick={() => navigate('/purchase-orders')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <ClipboardList className="w-5 h-5 text-amber-700 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Order</span>
              </button>
            </div>
          </div>

          {/* Delivery Order */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-sky-500 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delivery Order</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-delivery-order')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileText className="w-5 h-5 text-gray-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New DO</span>
              </button>
              <button 
                onClick={() => navigate('/goods-receipt-notes')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <ClipboardList className="w-5 h-5 text-sky-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View DO</span>
              </button>
            </div>
          </div>

          {/* Quotation Sales */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyan-500 p-3 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Quotation Sales</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-quotation-sale')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileText className="w-5 h-5 text-green-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Quote</span>
              </button>
              <button 
                onClick={() => navigate('/quotation-sales')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <ClipboardList className="w-5 h-5 text-cyan-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Quote</span>
              </button>
            </div>
          </div>

          {/* Purchase Order */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-500 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Quotation Purchase</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-quotation-purchase')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileText className="w-5 h-5 text-gray-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Purchase</span>
              </button>
              <button 
                onClick={() => navigate('/purchase-orders')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <ClipboardList className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Purchase</span>
              </button>
            </div>
          </div>

          {/* Purchase Invoice */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500 p-3 rounded-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Purchase Invoice</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-purchase-invoice')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileText className="w-5 h-5 text-orange-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Invoice</span>
              </button>
              <button 
                onClick={() => navigate('/get-purchase-invoices')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <ClipboardList className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Invoice</span>
              </button>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Customers</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-customer')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <UserCircle className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Customer</span>
              </button>
              <button 
                onClick={() => navigate('/get-customers')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Users className="w-5 h-5 text-orange-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Customers</span>
              </button>
            </div>
          </div>

          {/* Suppliers */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Suppliers</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-account-master')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Building2 className="w-5 h-5 text-gray-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Supplier</span>
              </button>
              <button 
                onClick={() => navigate('/get-vendors')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <ClipboardList className="w-5 h-5 text-yellow-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Suppliers</span>
              </button>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Warehouse className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Inventory</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-item')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Package className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Item</span>
              </button>
              <button 
                onClick={() => navigate('/get-items')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Warehouse className="w-5 h-5 text-green-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Items</span>
              </button>
            </div>
          </div>

          {/* Employees */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500 p-3 rounded-lg">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Employees</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-salesman')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <UserCircle className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Employee</span>
              </button>
              <button 
                onClick={() => navigate('/get-salesmen')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Users className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Employees</span>
              </button>
            </div>
          </div>

          {/* Bank */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-pink-500 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Bank</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-bank')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <CreditCard className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Bank Accounts</span>
              </button>
              <button 
                onClick={() => navigate('/get-banks')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileSpreadsheet className="w-5 h-5 text-pink-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Statements</span>
              </button>
            </div>
          </div>

          {/* Cash */}
          <div className="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-fuchsia-500 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Cash</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/receipt-voucher')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <DollarSign className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Cash Receipts</span>
              </button>
              <button 
                onClick={() => navigate('/payment-voucher')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Wallet className="w-5 h-5 text-fuchsia-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Cash Payments</span>
              </button>
            </div>
          </div>

          {/* Vouchers */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500 p-3 rounded-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Vouchers</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/customer-receipt-voucher')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Receipt className="w-5 h-5 text-gray-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Customer Receipt</span>
              </button>
              <button 
                onClick={() => navigate('/supplier-payment-voucher')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <CreditCard className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Supplier Payment</span>
              </button>
            </div>
          </div>

          {/* Account Master */}
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-violet-500 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Account Master</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/create-account-master')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileText className="w-5 h-5 text-gray-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">New Account</span>
              </button>
              <button 
                onClick={() => navigate('/get-account-masters')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <BookOpen className="w-5 h-5 text-violet-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">View Accounts</span>
              </button>
            </div>
          </div>

          {/* Accounting Reports */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-500 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Accounting Reports</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/account-enquiry')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileSpreadsheet className="w-5 h-5 text-gray-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Statements</span>
              </button>
              <button 
                onClick={() => navigate('/balance-sheet')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <TrendingUp className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Profit & Loss</span>
              </button>
            </div>
          </div>

          {/* Trial Balance */}
          <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyan-600 p-3 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Trial Balance</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/trial-balance')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <Calculator className="w-5 h-5 text-cyan-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Trial Balance</span>
              </button>
              <button 
                onClick={() => navigate('/balance-sheet')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <FileSpreadsheet className="w-5 h-5 text-cyan-700 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Balance Sheet</span>
              </button>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-600 p-3 rounded-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Analysis Reports</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/voucher-reports')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <TrendingUp className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Profit Analysis</span>
              </button>
              <button 
                onClick={() => navigate('/all-vouchers')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <BarChart3 className="w-5 h-5 text-orange-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Transactions</span>
              </button>
            </div>
          </div>

          {/* Stock Ledger */}
          <div className="bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-600 p-3 rounded-lg">
                <Warehouse className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Stock Reports</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/quantity-report')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <BarChart3 className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Quantity Report</span>
              </button>
              <button 
                onClick={() => navigate('/get-items')}
                className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition group"
              >
                <BookOpen className="w-5 h-5 text-rose-700 mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-700">Stock Ledger</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;