import React, { useState } from 'react';

import { useVerifyOtp } from '../../hooks/authHooks/useVerifyOtp';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function VerifyOtpForm() {
  const { mutate } = useVerifyOtp();
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtp(value);

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!otp || otp.trim() === '') {
      newErrors.Otp = 'OTP is required';
      isValid = false;
    } else if (otp.length < 4) {
      newErrors.Otp = 'OTP must be at least 4 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitted) setIsSubmitted(true);

    if (validateForm()) {
      const formData = new FormData();
      formData.append('otp', otp);

      mutate(formData, {
        onSuccess: (data) => {
          console.log(data.statusCode, "------");
          toast.success(data || 'OTP verification successful!');
          
          if (data.statusCode !== "400") {
            navigate('/change-password'); 
          }
        },
        onError: (error) => {
          const message = error?.response?.data || 'OTP verification failed!';
          toast.error(message);
      
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md px-8">
      <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
      <p className="mb-8 text-gray-600 text-center">
        Enter the OTP sent to your registered email or phone.
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        {[
          { label: 'Otp', name: 'Otp', type: 'text', value:otp },
        ].map(({ label, name, type, value }) => (
          <div className="mb-4" key={name}>
            <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              placeholder={label}
              value={value}
              onChange={handleChange}
              className="w-full bg-gray-100 p-3 rounded-lg h-12 border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            {errors?.[name] && (
              <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 font-medium transition-all duration-300"
        >
          Verify OTP
        </button>
      </form>
      <div className="mt-6 text-center">
        <p>
          Need to login?{' '}
          <span
            className="text-blue-500 font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtpForm;