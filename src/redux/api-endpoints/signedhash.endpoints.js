import reduxToolkitApi from '../redux'

const signedHashEndpoints = reduxToolkitApi.injectEndpoints({
  tagTypes: ['signedHash'],
  endpoints: (build) => ({
    signedHash: build.mutation({
      query(obj) {
        return {
          url: '/AllFunction/SignedHash',
          method: 'post',
          body: obj
        }
      }
    }),
    allowedSignedHash: build.mutation({
      query(obj) {
        return {
          url: '/Free/SignedHash',
          method: 'post',
          body: obj
        }
      }
    })
  })
})

export const signedHashApiEndpoints = signedHashEndpoints.endpoints

export default signedHashEndpoints
