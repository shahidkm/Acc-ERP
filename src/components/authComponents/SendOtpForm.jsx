import React, { useState } from 'react';
import { useSendOtp } from '../../hooks/authHooks/useSendOtp';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SendOtpForm() {
  const { mutate } = useSendOtp();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!email || email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (email.length < 4) {
      newErrors.email = 'Email must be at least 4 characters';
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
      formData.append('email', email);

      mutate(formData, {
        onSuccess: (data) => {
          console.log(data.statusCode, "------");
          toast.success(data || 'OTP sent successfully!');
          
          if (data.statusCode !== "400") {
            navigate('/verify-otp');
          }
        },
        onError: (error) => {
          const message = error?.response?.data || 'OTP send failed!';
          toast.error(message);
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md px-8">
      <h1 className="text-3xl font-bold mb-2">Send OTP</h1>
      <p className="mb-8 text-gray-600 text-center">
        Enter the OTP sent to your registered email or phone.
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        {[
          { label: 'Email', name: 'email', type: 'text', value: email },
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
              className={`w-full bg-gray-100 p-3 rounded-lg h-12 border ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:outline-none`}
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
          Send OTP
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

export default SendOtpForm;
