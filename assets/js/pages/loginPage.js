import React from 'react';
import { LoginForm } from 'app/components';
import { Urls } from 'utils';


const LoginPage = () => (
  <LoginForm loginUrl={Urls['oauth:begin']('github')} />
);

export default LoginPage;
