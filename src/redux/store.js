import { configureStore } from '@reduxjs/toolkit'
import signedHashEndpoints from './api-endpoints/signedhash.endpoints'
import dateEndpoints from './api-endpoints/date.endpoints'
import queryErrorEndpoints from './api-endpoints/queryerror.endpoints'
import queryResultEndpoints from './api-endpoints/query-result.endpoints'

const rtkstore = configureStore({
  reducer: {
    [signedHashEndpoints.reducerPath]: signedHashEndpoints.reducer,
    [dateEndpoints.reducerPath]: dateEndpoints.reducer,
    [queryErrorEndpoints.reducerPath]: queryErrorEndpoints.reducer,
    [queryResultEndpoints.reducerPath]: queryResultEndpoints.reducer
  },
  middleware: (gdm) =>
    gdm().concat([
      signedHashEndpoints.middleware,
      dateEndpoints.middleware,
      queryErrorEndpoints.middleware,
      queryResultEndpoints.middleware
    ])
})

export default rtkstore
