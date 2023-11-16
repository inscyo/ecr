import reduxToolkitApi from '../redux'

const dateEndpoints = reduxToolkitApi.injectEndpoints({
  tagTypes: ['dates'],
  endpoints: (build) => ({
    getDate: build.query({
      query() {
        return {
          url: '/Free/GetDate',
          method: 'get'
        }
      }
    })
  })
})

export const dateApiEndpoints = dateEndpoints.endpoints

export default dateEndpoints
