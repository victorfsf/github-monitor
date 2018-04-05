import React from 'react';
import ReactDOM from 'react-dom';
import LoginPage from 'pages/loginPage';
import HomePage from 'pages/homePage';


let component;
let el;

[component, el] = [<LoginPage />, 'react-login'];
  if (document.getElementById('react-login') !== null) {
} else {
  [component, el] = [<HomePage />, 'react-app'];
}

ReactDOM.render(
  component, document.getElementById(el),
);
