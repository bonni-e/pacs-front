import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // UseEffct 두 번 실행 문제 
  // https://velog.io/@gene028/%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80-3-UseEffect%EB%8A%94-%EC%99%9C-%EB%91%90%EB%B2%88-%EC%8B%A4%ED%96%89%EB%90%98%EB%8A%94%EA%B1%B8%EA%B9%8C
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
