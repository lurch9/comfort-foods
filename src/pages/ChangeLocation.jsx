// src/pages/ChangeLocation.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './form.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChangeLocation = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      zip: '',
    },
    validationSchema: Yup.object({
      zip: Yup.string().required('Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Update the user's session location (this could be stored in context or state)
      setUser((prevUser) => ({
        ...prevUser,
        zip: values.zip,
      }));
      navigate('/restaurant-list'); // Navigate to the restaurant list page
      setSubmitting(false);
    },
  });

  return (
    <div className="form-container">
      <h2>Change Location</h2>
      <form onSubmit={formik.handleSubmit}>
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
        <button type="submit" disabled={formik.isSubmitting}>
          Change Location
        </button>
      </form>
    </div>
  );
};

export default ChangeLocation;
