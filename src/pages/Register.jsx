// src/pages/Register.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './form.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

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
    },
    validationSchema: Yup.object({
      name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zip: Yup.string().required('Required'),
      dateOfBirth: Yup.date().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', values);
        setUser(response.data);
        navigate('/profile');
      } catch (error) {
        setErrors({ submit: error.response.data.message || error.message });
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Other fields remain unchanged */}
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
        <button type="submit" disabled={formik.isSubmitting}>
          Register
        </button>
        {formik.errors.submit && <div className="error-message">{formik.errors.submit}</div>}
      </form>
    </div>
  );
};

export default Register;




