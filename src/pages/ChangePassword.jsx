import React from "react";
import ChangePasswordForm from "../components/authComponents/ChangePasswordForm";

function ChangePassword() {
  return (
    <div className="flex w-screen overflow-hidden flex-col lg:flex-row h-screen">
      {/* Form Section */}
      <div
        className="w-full lg:w-1/2 h-screen flex items-center justify-center bg-white bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/RegisterBg.avif')" }}
      >
        <ChangePasswordForm/>
      </div>

      {/* Image Section - Hidden on sm and md */}
      <div
        className="w-1/2 h-screen bg-cover bg-center hidden lg:flex items-center justify-center"
        style={{ backgroundImage: "url('/assets/RegisterBg.avif')" }}
      >
        <img
          src="/assets/RegisterImage.jpg"
          alt="Main"
          className="w-[98%] h-[95%] object-fill rounded-lg"
        />
      </div>
    </div>
  );
}

export default ChangePassword;
