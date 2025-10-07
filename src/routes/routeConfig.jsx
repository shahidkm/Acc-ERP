import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "../pages/UserLogin";
import UserRegister from "../pages/UserRegister";
import CreateCompany from "../pages/CreateCompany";
import CreateCategory from "../pages/CreateCategory";
import CreateUnit from "../pages/CreateUnit";
import CreateProductWarehouse from "../pages/CreateProductWarehouse";
import ProductDisplay from "../components/productComponent/productDisplay";
import CreatePurchase from "../pages/CreatePurchase";
import CreateSale from "../pages/CreateSale";
import Sidebar from "../components/sidebar/Sidebar";
import SendOtp from "../pages/SendOtp";
import VerifyOtp from "../pages/VerifyOtp";
import ChangePassword from "../pages/ChangePassword";
import CreateCustomer from "../pages/CreateCustomer";
import CreateCustomerGroup from "../pages/CreateCustomerGroup";
import CustomerGroupsTable from "../pages/CustomerGroupsTable";
import CustomerGroupMembersTable from "../pages/CustomerGroupMembersTable";
import CustomerGroupDetails from "../pages/CustomerGroupDetails";
import CustomersTable from "../pages/CustomersTable";
import CustomerDetails from "../pages/CustomerDetails";
import CreateLedgerGroup from "../pages/CreateLedgerGroup";
import LedgerGroupsTable from "../pages/LedgerGroupsTable";
import LedgersTable from "../pages/LedgersTable";
import VendorsTable from "../pages/VendorsTable";
import PaymentVoucher from "../pages/vouchersPages/PaymentVoucher";
import ReceiptVoucher from "../pages/vouchersPages/ReceiptVoucher";
import SalesVoucher from "../pages/voucherPages/Sales/SalesVoucher";
import PurchaseVoucher from "../pages/voucherPages/purchase/PurchaseVoucher";
import PurchaseReturnVoucher from "../pages/voucherPages/PurchaseReturnVoucher";
import VouchersTable from "../pages/voucherPages/AllVouchersTable";
import CreateGroup from "../pages/inventoryPages/CreateGroup";
import InventoryGroupsTable from "../pages/inventoryPages/InventoryGroupsTable";
import InventoryCategoriesTable from "../pages/inventoryPages/InventoryCategoriesTable";
import InventorySubGroupsTable from "../pages/inventoryPages/InventorySubGroupTable";
import CreateSubGroup from "../pages/inventoryPages/CreateSubGroup";
import InventorySubCategoriesTable from "../pages/inventoryPages/InventorySubCategoriesTable";
import CreateSubCategory from "../pages/inventoryPages/CreateSubCategory";
import InventoryUnitsTable from "../pages/inventoryPages/InventoryUnitsTable";
import CreateItemMaster from "../pages/inventoryPages/CreateItemMaster";
import InventoryItemMastersTable from "../pages/inventoryPages/InventoryItemMastersTable";
import CreateAccountCategory from "../pages/accountPages/CreateAccountCategory";
import AccountCategoriesTable from "../pages/accountPages/AccountCategoriesTable.JSX";
import CreateAccountGroup from "../pages/accountPages/CreateAccountGroup";
import AccountGroupsTable from "../pages/accountPages/AccountGroupTable";
import CreateAccountMaster from "../pages/accountPages/CreateAccountMaster";
import AccountMastersTable from "../pages/accountPages/AccountMastersTable";
import CreatePurchaseInvoice from "../pages/invoicePages/CreatePurchaseInvoice";
import PurchaseInvoiceTable from "../pages/invoicePages/PurchaseInvoiceTable";
import PurchaseInvoiceDetail from "../pages/invoicePages/PurchaseInvoiceDetail";
import CreatePurchaseReturnInvoice from "../pages/invoicePages/CreatePurchaseReturnInvoice";
import PurchaseReturnInvoiceTable from "../pages/invoicePages/PurchaseReturnInvoiceTable";
import CreateJobMaster from "../pages/jobMasterPages/CreateJobMaster";
import CreateSalesman from "../pages/salesmanPages/CreateSalesman";
import SalesmenTable from "../pages/salesmanPages/SalesmanTable";
import JobMastersTable from "../pages/jobMasterPages/JobMastersTable";
import CreateDepartment from "../pages/departmentPages/CreateDepartment";
import DepartmentsTable from "../pages/departmentPages/DepartmentsTable";
import CreateBank from "../pages/bankPages/CreateBank";
import BanksTable from "../pages/bankPages/BanksTable";
import CreateCurrency from "../pages/currencyPages/CreateCurrency";
import CurrenciesTable from "../pages/currencyPages/CurrenciesTable";
import CreateArea from "../pages/areaPages/CreateArea";
import AreasTable from "../pages/areaPages/AreasTable";
import CreateLocation from "../pages/locationPages/CreateLocation";
import LocationsTable from "../pages/locationPages/LocationsTable";
import CreateCountry from "../pages/countryPages/CreateCountry";
import CountriesTable from "../pages/countryPages/CountriesTable";
import CreateVatMaster from "../pages/vatMasterPages/CreateVatMaster";
import VatMastersTable from "../pages/vatMasterPages/VatMastersTable";
import PurchaseNonStockVoucher from "../pages/vouchersPages/PurchaseNonStockVoucher";
import SalesNonStockVoucher from "../pages/vouchersPages/SalesNonStockVoucher";
import CustomerReceipt from "../pages/vouchersPages/CustomerReceiptVoucher";
import VoucherReports from "../pages/vouchersPages/VoucherReports";
import SupplierPayment from "../pages/vouchersPages/SupplierPaymentVoucher";
import ContraVoucher from "../pages/vouchersPages/ContraVoucher";
import AccountEnquiry from "../pages/accountPages/AccountEnquiry";
import AddressList from "../pages/accountPages/AddressList";
import CreateSalesInvoice from "../pages/invoicePages/CreateSalesInvoice";
import SalesInvoiceTable from "../pages/invoicePages/SalesInvoiceTable";
import QuotationSale from "../pages/inventoryPages/QuotationSale";
import QuotationRental from "../pages/inventoryPages/QuotationRental";
import QuotationSalesTable from "../pages/inventoryPages/QuotatinSalesTable";
import QuotationRentalTable from "../pages/inventoryPages/QuotationRentalTable.JSX";
import CreateSalesOrder from "../pages/inventoryPages/CreateSalesOrder";
import CreateDeliveryOrder from "../pages/inventoryPages/CreateDeliveryOrder";
import SalesOrderTable from "../pages/inventoryPages/SalesOrderTable";
import Reconciliation from "../pages/accountPages/Reconciliation";
import JournalVoucher from "../pages/vouchersPages/JournalVoucher";
import JournalVoucherTable from "../pages/vouchersPages/JournalVouchersTable";
import ReceiptVoucherTable from "../pages/vouchersPages/ReceiptVouchersTable";
import PaymentVoucherTable from "../pages/vouchersPages/PaymentVochersTable";
import PurchaseNonStockVouchersTable from "../pages/vouchersPages/PurchaseNonStockVouchersTable";
import SalesNonStockVouchersTable from "../pages/vouchersPages/SalesNonStockVouchersTable";
import CustomerReceiptVoucherTable from "../pages/vouchersPages/CustomerReceiptVouchersTable";
import CreatePurchaseOrder from "../pages/inventoryPages/CreatePurchaseOrder";
import PurchaseOrdersTable from "../pages/inventoryPages/PurchaseOrdersTable";
import SalesOrdersTable from "../pages/inventoryPages/SalesOrdersTable";
import QuotationPurchase from "../pages/inventoryPages/QuotationPurchase";
import TrialBalance from "../pages/vouchersPages/TrialBalance";
import CreateSalesReturn from "../pages/invoicePages/SalesReturnInvoice";
import ContraVouchersTable from "../pages/vouchersPages/ContraVouchersTable";
import SupplierPaymentsTable from "../pages/vouchersPages/SupplierPaymentVouchersTable";
import CreateGoodsReceiptNote from "../pages/inventoryPages/CreateGoodsReceiptNote";
import GoodsReceiptNotesTable from "../pages/inventoryPages/GoodsReceiptNotesTable.JSX";
import BalanceSheet from "../pages/vouchersPages/BalanceSheet.jsx";
import CreateCheque from "../pages/vouchersPages/CreateCheque.jsx";
import ChequesTable from "../pages/vouchersPages/ChequesTable.jsx";

function RouteConfig() {
  return (
    <Router>
      <Routes>
        <Route path="/get-customers" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/send-otp" element={<SendOtp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-customer" element={<CreateCustomer />} />
        <Route path="/get-customers" element={<CustomersTable />} />
        <Route path="/get-customer" element={<CustomerDetails />} />
        <Route path="/create-customer-group" element={<CreateCustomerGroup />} />
        <Route path="/get-customer-groups" element={<CustomerGroupsTable />} />
        <Route path="/get-customer-group-members" element={<CustomerGroupMembersTable />} />
        <Route path="/customer-group-details" element={<CustomerGroupDetails />} />
        <Route path="/create-company" element={<CreateCompany />} />
        <Route path="/create-product-category" element={<CreateCategory />} />
        <Route path="/create-product-unit" element={<CreateUnit />} />
        <Route path="/create-product-warehouse" element={<CreateProductWarehouse />} />
        <Route path="/product-display" element={<ProductDisplay />} />
        <Route path="/create-purchase" element={<CreatePurchase />} />
        <Route path="/create-sale" element={<CreateSale />} />
        <Route path="/sidebar" element={<Sidebar />} />

        <Route path="/create-ledger-group" element={<CreateLedgerGroup />} />

        <Route path="/get-ledger-groups" element={<LedgerGroupsTable />} />
        <Route path="/get-ledgers" element={<LedgersTable />} />
        <Route path="/get-vendors" element={<VendorsTable />} />
        {/* <Route path="/payment-voucher" element={<PaymentVoucher />} /> */}
        {/* <Route path="/receipt-voucher" element={<ReceiptVoucher />} /> */}
        <Route path="/sale-voucher" element={<SalesVoucher />} />
        {/* <Route path="/purchase-voucher" element={<PurchaseVoucher />} /> */}
        <Route path="/purchase-return-voucher" element={<PurchaseReturnVoucher />} />
        <Route path="/all-vouchers" element={<VouchersTable />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/get-groups" element={<InventoryGroupsTable />} />
        <Route path="/get-categories" element={<InventoryCategoriesTable />} />
        <Route path="/create-category" element={<CreateCategory />} />
        <Route path="/get-sub-groups" element={<InventorySubGroupsTable />} />
        <Route path="/create-sub-group" element={<CreateSubGroup />} />
        <Route path="/get-sub-categories" element={<InventorySubCategoriesTable />} />
        <Route path="/create-sub-category" element={<CreateSubCategory />} />
        <Route path="/create-unit" element={<CreateUnit />} />
        <Route path="/get-units" element={<InventoryUnitsTable />} />
        <Route path="/create-item" element={<CreateItemMaster />} />
        <Route path="/get-items" element={<InventoryItemMastersTable />} />
        <Route path="/create-account-category" element={<CreateAccountCategory />} />
        <Route path="/get-account-categories" element={<AccountCategoriesTable />} />
        <Route path="/create-account-group" element={<CreateAccountGroup />} />
        <Route path="/get-account-groups" element={<AccountGroupsTable />} />
        <Route path="/create-account-master" element={<CreateAccountMaster />} />
        <Route path="/get-account-masters" element={<AccountMastersTable />} />
        <Route path="/create-purchase-invoice" element={<CreatePurchaseInvoice />} />
        <Route path="/get-purchase-invoices" element={<PurchaseInvoiceTable />} />
        <Route path="/purchase-invoice/:invoiceId" element={<PurchaseInvoiceDetail />} />
        <Route path="/create-purchase-return-invoice" element={<CreatePurchaseReturnInvoice />} />
        <Route path="/get-purchase-return-invoices" element={<PurchaseReturnInvoiceTable />} />
        <Route path="/create-job-master" element={<CreateJobMaster />} />
        <Route path="/get-job-masters" element={<JobMastersTable />} />
        <Route path="/create-salesman" element={<CreateSalesman />} />
        <Route path="/get-salesmen" element={<SalesmenTable />} />
        <Route path="/create-department" element={<CreateDepartment />} />
        <Route path="/get-departments" element={<DepartmentsTable />} />
        <Route path="/create-bank" element={<CreateBank />} />
        <Route path="/get-banks" element={<BanksTable />} />
        <Route path="/create-currency" element={<CreateCurrency />} />
        <Route path="/get-currencies" element={<CurrenciesTable />} />
        <Route path="/create-area" element={<CreateArea />} />
        <Route path="/get-areas" element={<AreasTable />} />
        <Route path="/create-location" element={<CreateLocation />} />
        <Route path="/get-locations" element={<LocationsTable />} />
        <Route path="/create-country" element={<CreateCountry />} />
        <Route path="/get-countries" element={<CountriesTable />} />
        <Route path="/create-vat-master" element={<CreateVatMaster />} />
        <Route path="/get-vat-masters" element={<VatMastersTable />} />
        <Route path="/receipt-voucher" element={<ReceiptVoucher />} />
        <Route path="/payment-voucher" element={<PaymentVoucher />} />
        <Route path="/purchase-non-stock-voucher" element={<PurchaseNonStockVoucher />} />
        <Route path="/sales-non-stock-voucher" element={<SalesNonStockVoucher />} />
        <Route path="/customer-receipt-voucher" element={<CustomerReceipt />} />
        <Route path="/voucher-reports" element={<VoucherReports />} />
        <Route path="/supplier-payment-voucher" element={<SupplierPayment />} />
        <Route path="/contra-voucher" element={<ContraVoucher />} />
        <Route path="/account-enquiry" element={<AccountEnquiry />} />
        <Route path="/address-list" element={<AddressList />} />
        <Route path="/create-sales-invoice" element={<CreateSalesInvoice />} />
        <Route path="/sales-vouchers" element={<SalesInvoiceTable />} />
        <Route path="/create-quotation-sale" element={<QuotationSale />} />
        <Route path="/create-quotation-rental" element={<QuotationRental />} />
        <Route path="/quotation-sales" element={<QuotationSalesTable />} />
        <Route path="/quotation-rental" element={<QuotationRentalTable />} />
        <Route path="/create-sales-order" element={<CreateSalesOrder />} />
        <Route path="/create-delivery-order" element={<CreateDeliveryOrder />} />
        <Route path="/sales-orders" element={<SalesOrderTable />} />
        <Route path="/reconciliation" element={<Reconciliation />} />
        <Route path="/create-journal-voucher" element={<JournalVoucher />} />
        <Route path="/journal-vouchers" element={<JournalVoucherTable />} />
        <Route path="/receipt-vouchers" element={<ReceiptVoucherTable />} />
        <Route path="/payment-vouchers" element={<PaymentVoucherTable />} />
        <Route path="/purchase-non-stock-vouchers" element={<PurchaseNonStockVouchersTable />} />
        <Route path="/sales-non-stock-vouchers" element={<SalesNonStockVouchersTable />} />
        <Route path="/customer-receipt-vouchers" element={<CustomerReceiptVoucherTable />} />
        <Route path="/create-purchase-order" element={<CreatePurchaseOrder />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersTable />} />
        <Route path="/sales-orders" element={<SalesOrdersTable />} />
        <Route path="/create-quotation-purchase" element={<QuotationPurchase />} />
         <Route path="/trial-balance" element={<TrialBalance />} />
          <Route path="/sales-return" element={<CreateSalesReturn />} />
                <Route path="/contra-vouchers" element={<ContraVouchersTable />} />
                  <Route path="/supplier-payment-vouchers" element={<SupplierPaymentsTable />} />
                    <Route path="/create-goods-receipt-note" element={<CreateGoodsReceiptNote />} />
                     <Route path="/goods-receipt-notes" element={<GoodsReceiptNotesTable />} />
                       <Route path="/balance-sheet" element={<BalanceSheet />} />
                         <Route path="/create-cheque" element={<CreateCheque />} />
                             <Route path="/cheques" element={<ChequesTable />} />
      </Routes>
    </Router>
  );
}

export default RouteConfig;
