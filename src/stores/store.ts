import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import itemReducer from "./reducers/itemReducer";

const rootReducer = combineReducers({
    item: itemReducer
});

export const store = configureStore({reducer: rootReducer});

export type AppDispatch = typeof store.dispatch;
export type rootState = ReturnType<typeof store.getState>;