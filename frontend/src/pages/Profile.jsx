// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getEnv } from '../utils/env';
import axios from 'axios';
import '../Styles/form.css';
import { useAuth } from '../context/AuthContext';
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const Profile = () => {
  const { user, setUser } = useAuth();
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setInitialValues({
        name: user.name || '',
        email: user.email || '',
        street: user.street || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [user]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zip: Yup.string().required('Required'),
      dateOfBirth: Yup.date().required('Required'),
      currentPassword: Yup.string().test(
        'passwords-match',
        'Current Password Required to Change Password',
        function(value) {
          const { newPassword, confirmNewPassword } = this.parent;
          if (newPassword || confirmNewPassword) {
            return value !== undefined;
          }
          return true;
        }
      ),
      newPassword: Yup.string().test(
        'passwords-match',
        'New password and confirmation must match',
        function(value) {
          const { confirmNewPassword } = this.parent;
          if (value) {
            return confirmNewPassword === value;
          }
          return true;
        }
      ),
      confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/api/users/profile`, values, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUser(response.data);
        setMessage('Profile updated successfully');
      } catch (error) {
        setErrors({ submit: error.response.data.message || error.message });
        setMessage('');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="form-container">
      <h2>Profile</h2>
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
          <label htmlFor="zip">Zip Code:</label>
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
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            id="currentPassword"
            type="password"
            {...formik.getFieldProps('currentPassword')}
          />
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <div className="error-message">{formik.errors.currentPassword}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            id="newPassword"
            type="password"
            {...formik.getFieldProps('newPassword')}
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="error-message">{formik.errors.newPassword}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            id="confirmNewPassword"
            type="password"
            {...formik.getFieldProps('confirmNewPassword')}
          />
          {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? (
            <div className="error-message">{formik.errors.confirmNewPassword}</div>
          ) : null}
        </div>
        <button type="submit" disabled={formik.isSubmitting}>
          Update Profile
        </button>
        {formik.errors.submit && <div className="error-message">{formik.errors.submit}</div>}
        {message && <div className="success-message">{message}</div>}
      </form>
    </div>
  );
};

export default Profile;


