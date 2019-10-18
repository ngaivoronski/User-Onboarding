import React, {useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import './App.css';
import styled from "styled-components";
import ErrorWithStack from 'jest-util/build/ErrorWithStack';

const OnboardingForm = ({values, touched, errors, status}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    status && setUsers(users => [...users, status])
  }, [status])

  return (
    <>
    <div>
      <h1>Onboarding Sig-up:</h1>
      <Form className="onboardingForm">
        <h2>Please enter your onboarding information:</h2>
        <Field type="text" name="name" placeholder="Name"/>
        {touched.name && errors.name && (
          <p>{errors.name}</p>
        )}

        <Field type="email" name="email" placeholder="Email"/>
        {touched.email && errors.email && (
          <p>{errors.email}</p>
        )}

        <Field type="password" name="password" placeholder="Password" />
        {touched.password && errors.password && (
          <p>{errors.password}</p>
        )}

        <div className="TOS-field">
        <label for="TOS"><p>I have read and agree with the Terms of Service</p></label>
        <Field type="checkbox" name="TOS" />
        </div>
        {touched.TOS && errors.TOS && (
          <p>{errors.TOS}</p>
        )}

        <button type="submit">Submit</button>
      </Form>
    </div>
    
    <h1>Users List:</h1>

    <div className="usersList">
        {users.map(user => (
          <div key={user.id} className="userCard">
            <div className="userText">
              <h2>User: {user.id}</h2>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Password: {"*".repeat(user.password.length)}</p>
              <p>{user.TOS}</p>
            </div>
          </div>
        ))}
    </div>
    </>

  );
}

const FormikOnboardingForm = withFormik({
  mapPropsToValues({name, email, password, TOS}) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      TOS: TOS || false
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().email("Please enter a valid email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(5, "Please enter a longer password"),
    TOS: Yup.boolean().oneOf([true],"Please accept the Terms of Service"),
  }),

  handleSubmit(values, {setStatus}) {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        setStatus(res.data);
        console.log(res);
      })
      .catch(err => console.log(err.response));

  }




})(OnboardingForm);





function App() {
  return (
    <div className="App">
      <FormikOnboardingForm />
    </div>
  );
}

export default App;
