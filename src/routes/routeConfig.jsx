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

function RouteConfig() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLogin/>} />
       <Route path="/register" element={<UserRegister/>} />
          <Route path="/send-otp" element={<SendOtp/>} />
             <Route path="/verify-otp" element={<VerifyOtp/>} />
               <Route path="/change-password" element={<ChangePassword/>} />
        <Route path="/create-company" element={<CreateCompany/>} />
         <Route path="/create-product-category" element={<CreateCategory/>} />
        <Route path="/create-product-unit" element={<CreateUnit/>} />
        <Route path="/create-product-warehouse" element={<CreateProductWarehouse/>} />
           <Route path="/product-display" element={<ProductDisplay/>} />
             <Route path="/create-purchase" element={<CreatePurchase/>} />
              <Route path="/create-sale" element={<CreateSale/>} />
                    <Route path="/sidebar" element={<Sidebar/>} />
      </Routes>
    </Router>
  );
}

export default RouteConfig;
