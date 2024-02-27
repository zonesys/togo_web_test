import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./components/Reducer/RootReducer";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export default function configureStore() {
    return createStore(
        rootReducer,
        composeEnhancer(applyMiddleware(thunk))
    );
}
