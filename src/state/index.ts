import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';

import application from './application/reducer';
// import burn from './burn/reducer';
// import burnV3 from './burn/v3/reducer';
import { updateVersion } from './global/actions';
// import mint from './mint/reducer';
// import mintV3 from './mint/v3/reducer';
// import multicall from './multicall/reducer';
// import swap from './swap/reducer';
import transactions from './transactions/reducer';
// import user from './user/reducer';

const PERSISTED_KEYS: string[] = ['user', 'transactions'];

const store = configureStore({
  reducer: {
    application,
    // user,
    transactions,
    // swap,
    // mint,
    // mintV3,
    // burn,
    // burnV3,
    // multicall,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
