import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setEmail,
  setPassword,
  setError,
  resetErrors,
} from "../../redux/slices/userLogin"
import { useUserLogin } from '../../hooks/authHooks/useUserLogin';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function LoginForm() {
  const { mutate } = useUserLogin();
  const { Email, Password, Errors } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Email') dispatch(setEmail(value));
    if (name === 'Password') dispatch(setPassword(value));
    dispatch(resetErrors({ field: name, message: '' }));
  };

  const validateForm = () => {
    let isValid = true;

    if (!Email) {
      dispatch(setError({ field: 'Email', message: 'Email is required' }));
      isValid = false;
    }

    if (!Password) {
      dispatch(setError({ field: 'Password', message: 'Password is required' }));
      isValid = false;
    } else if (Password.length < 6) {
      dispatch(
        setError({
          field: 'Password',
          message: 'Password must include 6 characters',
        })
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitted) setIsSubmitted(true);

    if (validateForm()) {
      const formData = new FormData();
      formData.append('Email', Email);
      formData.append('Password', Password);

      mutate(formData, {
        onSuccess: (data) => {
            console.log(data.statusCode,"------");
      
          toast.success(data?.message || 'Login successful!');
          dispatch(resetErrors());
                if(data.statusCode!="400"){
          navigate('/create-purchase');
                }
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message || 'Login failed!';
          toast.error(message);
          dispatch(setEmail(''));
          dispatch(setPassword(''));
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md px-8">
      <h1 className="text-3xl font-bold mb-2">Hop in!</h1>
      <p className="mb-8 text-gray-600 text-center">
        Gain the upper hand – login to manage smarter.
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        {[
          { label: 'Email', name: 'Email', type: 'email', value: Email },
          { label: 'Password', name: 'Password', type: 'password', value: Password },
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
            {Errors?.[name] && (
              <p className="text-red-600 text-sm mt-1">{Errors[name]}</p>
            )}
          </div>
        ))}

        <div className="mb-4 text-right">
          <span
            className="text-blue-500 text-sm cursor-pointer hover:underline"
            onClick={() => navigate('/send-otp')}
          >
            Forgot Password?
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 font-medium transition-all duration-300"
        >
          Submit
        </button>
      </form>
      <div className="mt-6 text-center">
        <p>
          Join on the ledger –{' '}
          <span
            className="text-blue-500 font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
