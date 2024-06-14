// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import tablesReducer from './tableSlice';
import cartReducer from './cartSlice';


const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, tablesReducer);

export const store = configureStore({
  reducer: {
    tables: persistedReducer,
    cart: cartReducer,
  },
});

export const persistor = persistStore(store);
