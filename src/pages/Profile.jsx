import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './form.css';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: user.name || '',
      email: user.email || '',
      street: user.street || '',
      city: user.city || '',
      state: user.state || '',
      zip: user.zip || '',
      dateOfBirth: user.dateOfBirth || '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zip: Yup.string().required('Required'),
      dateOfBirth: Yup.date().required('Required'),
      password: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.put('http://localhost:5000/api/users/profile', values, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUser(response.data);
      } catch (error) {
        setErrors({ submit: error.response.data.message || error.message });
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
        <button type="submit" disabled={formik.isSubmitting}>
          Update Profile
        </button>
        {formik.errors.submit && <div className="error-message">{formik.errors.submit}</div>}
      </form>
    </div>
  );
};

export default Profile;
