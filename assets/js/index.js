import React from 'react';
import ReactDOM from 'react-dom';
import LoginPage from 'pages/loginPage';
import Routes from 'routes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'app/configureStore';


if (document.getElementById('react-login') !== null) {
  ReactDOM.render(
    <LoginPage />,
    document.getElementById('react-login'),
  );
} else {
  const store = configureStore();

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>,
    document.getElementById('react-app'),
  );
}

