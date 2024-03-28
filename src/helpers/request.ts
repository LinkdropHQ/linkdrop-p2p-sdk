import { ConflictError, ValidationError } from '../errors'
async function request<TResponse>(
  url: string,
  config: RequestInit = {}
) {
  try {
    const res = await fetch(url, config)
    if (res.ok) {
      return res.json()
    }
    const responseData = await res.json()
    const responseCode = res.status
    const responseMessage = (responseData.message as string) || 'Some error occured. Please check server response for more info'
    const responseErrors = responseData.errors as string[]
    switch (responseCode) {
      case 409:
        throw new ConflictError(responseMessage, responseErrors[0])
      case 400:
        throw new ValidationError(responseMessage, responseErrors[0])
      default:
        throw new Error(responseMessage)
    }
  } catch (err) {
    throw err
  }
}

export default request