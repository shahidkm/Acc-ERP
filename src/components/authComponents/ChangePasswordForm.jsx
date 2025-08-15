import React, { useState } from 'react';
import { useChangePassword } from '../../hooks/authHooks/useChangePassword';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ChangePasswordForm() {
  const { mutate } = useChangePassword();
  const [formValues, setFormValues] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    if (!formValues.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formValues.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formValues.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
           formData.append('ConfirmPassword', formValues.confirmPassword);
      formData.append('Password', formValues.password);
console.log(formData);

      mutate(formData, {
        onSuccess: (data) => {
          toast.success(data || 'Password change successful!');
          if (data.statusCode !== '400') {
            navigate('/login');
          }
        },
        onError: (error) => {
          const message = error?.response?.data || 'Password change failed!';
          toast.error(message);
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md px-8">
      <h1 className="text-3xl font-bold mb-2">Change Password</h1>
      <p className="mb-8 text-gray-600 text-center">
        Enter and confirm your new password.
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        {[
          { label: 'Password', name: 'password', type: 'password', value: formValues.password },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password', value: formValues.confirmPassword },
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
          Change Password
        </button>
      </form>
      <div className="mt-6 text-center">
        <p>
          Need to login?{' '}
          <span
            className="text-blue-500 font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/sidebar')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
