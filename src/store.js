import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import conversationsReducer from './features/conversationsSlice';
import messagesReducer from './features/messagesSlice'

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
    conversations: conversationsReducer,
    messages: messagesReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  }),
});

const persistor = persistStore(store);

export { store, persistor };