import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import conversationsReducer from './features/conversationsSlice';
import messagesReducer from './features/messagesSlice'
import friendsReducer from './features/friendsSlice';
import pendingInvitesReducer from './features/pendingInvitesSlice';
import activeConversationReducer from './features/activeConversationSlice';


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
    friends: friendsReducer,
    pendingInvites: pendingInvitesReducer,
    activeConversation: activeConversationReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  }),
});

const persistor = persistStore(store);

export { store, persistor };