import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../Styles/form.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login method to set user and handle cookies

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      dateOfBirth: '',
      role: 'user', // default to 'user'
      rememberMe: false, // Add rememberMe field
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
      dateOfBirth: Yup.date().required('Required'),
      role: Yup.string().required('Required'),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/users`, values);
        const userData = response.data;
        login(userData, values.rememberMe); // Use the login method from the context

        // Redirect based on user role
        if (userData.role === 'manager') {
          navigate('/manager-dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        setErrors({ submit: error.response ? error.response.data.message : error.message });
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="form-container">
      <h2>Register</h2>
      {formik.errors.submit && <p className="error">{formik.errors.submit}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error-message">{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            {...formik.getFieldProps('confirmPassword')}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error-message">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="street">Street:</label>
          <input
            id="street"
            type="text"
            {...formik.getFieldProps('street')}
          />
          {formik.touched.street && formik.errors.street ? (
            <div className="error-message">{formik.errors.street}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            id="city"
            type="text"
            {...formik.getFieldProps('city')}
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="error-message">{formik.errors.city}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <input
            id="state"
            type="text"
            {...formik.getFieldProps('state')}
          />
          {formik.touched.state && formik.errors.state ? (
            <div className="error-message">{formik.errors.state}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="zip">ZIP Code:</label>
          <input
            id="zip"
            type="text"
            {...formik.getFieldProps('zip')}
          />
          {formik.touched.zip && formik.errors.zip ? (
            <div className="error-message">{formik.errors.zip}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            id="dateOfBirth"
            type="date"
            {...formik.getFieldProps('dateOfBirth')}
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
            <div className="error-message">{formik.errors.dateOfBirth}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            {...formik.getFieldProps('role')}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
          {formik.touched.role && formik.errors.role ? (
            <div className="error-message">{formik.errors.role}</div>
          ) : null}
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="rememberMe"
            {...formik.getFieldProps('rememberMe')}
          />
          <label htmlFor="rememberMe">Remember me for 30 days</label>
        </div>
        <button type="submit" disabled={formik.isSubmitting}>Register</button>
      </form>
    </div>
  );
};

export default Register;




