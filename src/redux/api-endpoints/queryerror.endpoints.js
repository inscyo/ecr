import reduxToolkitApi from '../redux'

const queryErrorEndpoints = reduxToolkitApi.injectEndpoints({
  tagTypes: ['queryError'],
  endpoints: (build) => ({
    queryError: build.mutation({
      query(formData) {
        return {
          url: '/AllFunction/QueryError',
          method: 'post',
          body: { ...formData }
        }
      }
    })
  })
})

export const queryErrorApiEndpoints = queryErrorEndpoints.endpoints

export default queryErrorEndpoints
