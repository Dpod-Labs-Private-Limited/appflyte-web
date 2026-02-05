import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import './styles/App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import { messages, DEFAULT_LOCALE } from './i18n/intl';

import { Provider } from "react-redux";
import store from './Redux/store/store';
import theme from "./styles/theme"

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { AppProvider } from './context/AppContext';
import { CreditProvider } from './context/CreditContext';
import { CollectionProvider } from './context/CollectionContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const locale = DEFAULT_LOCALE;

root.render(
  <AppProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CreditProvider>
          <CollectionProvider>
            <Provider store={store}>
              <CssBaseline />
              <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
                <App />
              </IntlProvider>
            </Provider>
          </CollectionProvider>
        </CreditProvider>
      </ThemeProvider>
    </BrowserRouter>
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
