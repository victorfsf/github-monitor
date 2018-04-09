import React from 'react';
import ReactDOM from 'react-dom';
import LoginPage from 'pages/loginPage';
import store from 'store';


ReactDOM.render(
  <LoginPage store={store} />,
  document.getElementById('react-app'),
);

