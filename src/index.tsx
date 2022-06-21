import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from "./stores/index";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';
import Spinner from './views/components/spinner';
import { AuthProvider } from './hooks/use-auth';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Provider store={store}>
          <Router>
            <App />
          </Router>
        </Provider>
      </Suspense>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();