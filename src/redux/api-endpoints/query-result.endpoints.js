import reduxToolkitApi from '../redux'

const queryResultEndpoints = reduxToolkitApi.injectEndpoints({
  tagTypes: ['queryResult'],
  endpoints: (build) => ({
    AllqueryResult: build.mutation({
      query(data) {
        return {
          url: '/Results/AllQueryResult',
          method: 'post',
          body: { ...data }
        }
      },
      onProgress: (event) => {
        console.log('Progress:', event.loaded, event.total);
      },
    }),
    queryResult: build.mutation({
      query({ spname, fnparameter, hashed, body }) {
        return {
          url: '/AllFunction/QueryResult',
          method: 'post',
          headers: { FnName: spname, FnParam: fnparameter, 'E-Signed': hashed },
          body
        }
      },
      onProgress: (event) => {
        console.log('Progress:', event.loaded, event.total);
      },
    }),
    allowedQueryResult: build.mutation({
      query({ spname, fnparameter, hashed, body }) {
        return {
          url: '/Free/QueryResult',
          method: 'post',
          headers: { FnName: spname, FnParam: fnparameter, 'E-Signed': hashed },
          body
        }
      },
      onProgress: (event) => {
        console.log('Progress:', event.loaded, event.total);
      },
    })
  })
})

export const queryResultApiEndpoints = queryResultEndpoints.endpoints

export default queryResultEndpoints
