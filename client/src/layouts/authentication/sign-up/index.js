/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { Select, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

const countries = [
  { code: 'AE', name: 'United Arab Emirates', dial_code: '+971' },
  { code: 'IN', name: 'India', dial_code: '+91' },
  { code: 'US', name: 'United States', dial_code: '+1' },
];

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '+971',
  });

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    if (name === 'password') {
      const strength = zxcvbn(value);
      setPasswordStrength(strength.score);
    }
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Average';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { firstName, lastName, username, email, phone, password, confirmPassword, country } =
      form;

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !country
    ) {
      setAlertMessage('Please fill all fields');
      setOpen(true);
      return;
    }

    if (!email.includes('@') || !email.includes('.com')) {
      setAlertMessage('Invalid email');
      setOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setOpen(true);
      return;
    }

    if (passwordStrength < 2) {
      setAlertMessage('Password is too weak');
      setOpen(true);
      return;
    }

    try {
      const formData = { ...form, role: 'parent' };
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      console.log(response.data);
      setAlertMessage('Sign up successful');
      setAlertSeverity('success');
      setOpen(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'Username already exists'
      ) {
        setAlertMessage('Username already exists');
      } else {
        setAlertMessage('Registration failed');
      }
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant='gradient'
          bgColor='info'
          borderRadius='lg'
          coloredShadow='success'
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign='center'
        >
          <MDTypography variant='h4' fontWeight='medium' color='white' mt={1}>
            Join Ethihad today
          </MDTypography>
          <MDTypography display='block' variant='button' color='white' my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>
        <MDBox pt={6} pb={3} px={3}>
          <MDBox component='form' role='form' onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDInput
                    type='text'
                    label='First Name'
                    name='firstName'
                    variant='standard'
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    fullWidth
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDInput
                    type='text'
                    label='Last Name'
                    name='lastName'
                    variant='standard'
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    fullWidth
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDInput
                    type='text'
                    label='Username'
                    name='username'
                    variant='standard'
                    required
                    value={form.username}
                    onChange={handleChange}
                    fullWidth
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDInput
                    type='text'
                    label='Email Address'
                    name='email'
                    variant='standard'
                    required
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <Select
                    label='Country'
                    name='country'
                    variant='standard'
                    required
                    value={form.country}
                    onChange={handleChange}
                    fullWidth
                    id='country-label'
                    labelId='country-label'
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.dial_code}>
                        {country.name} ({country.dial_code})
                      </MenuItem>
                    ))}
                  </Select>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDInput
                    type='text'
                    label='Phone Number'
                    name='phone'
                    variant='standard'
                    required
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDInput
                    type='password'
                    label='Password'
                    name='password'
                    variant='standard'
                    value={form.password}
                    onChange={handleChange}
                    helperText={
                      passwordStrength !== null
                        ? `Password Strength: ${getPasswordStrengthLabel(passwordStrength)}`
                        : ''
                    }
                    fullWidth
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox mb={2}>
                  <MDInput
                    type='password'
                    label='Confirm Password'
                    name='confirmPassword'
                    variant='standard'
                    value={form.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <MDBox display='flex' alignItems='center' ml={-1}>
                  <Checkbox />
                  <MDTypography
                    variant='button'
                    fontWeight='regular'
                    color='text'
                    sx={{ cursor: 'pointer', userSelect: 'none', ml: -1 }}
                  >
                    &nbsp;&nbsp;I agree the&nbsp;
                  </MDTypography>
                  <MDTypography
                    component='a'
                    href='#'
                    variant='button'
                    fontWeight='bold'
                    color='info'
                    textGradient
                  >
                    Terms and Conditions
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
            <MDBox mt={4} mb={1}>
              <MDButton type='submit' variant='gradient' color='info' fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign='center'>
              <MDTypography variant='button' color='text'>
                  Already have an account?{' '}
                  <MDTypography
                    component={Link}
                    to='/authentication/sign-in'
                    variant='button'
                    color='info'
                    fontWeight='medium'
                    textGradient
                  >
                    Sign In
                  </MDTypography>
                </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MDAlert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
          </MDAlert>
        </Snackbar>
      </Card>
    </CoverLayout>
  );
};

export default SignUp;
