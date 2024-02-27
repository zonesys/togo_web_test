import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App.jsx";
import { Provider } from "react-redux";
import configureStore from "./store";
import { ChakraProvider } from "@chakra-ui/react";
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <Provider store={configureStore()}>
        <ChakraProvider>
            <App />
        </ChakraProvider>
    </Provider>,
    document.getElementById("root")
);

{/* <React.StrictMode>
    <App />
</React.StrictMode> */}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();