import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie } from '../helpers/cookie.fn'

const reduxToolkitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env[
      process.env.NODE_ENV === 'development'
        ? 'VITE_LMS_API_NONPROD'
        : 'VITE_LMS_API_PROD'
    ],
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = getCookie('token')
      token && headers.set('authorization', `Bearer ${token}`)
      return headers
    }
  }),
  endpoints: () => ({})
})

export default reduxToolkitApi
