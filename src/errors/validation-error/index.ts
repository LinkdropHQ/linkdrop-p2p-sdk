class ValidationError extends Error {
  code: number
  error?: string

  constructor (
    message: string,
    error?: string
  ) {
    super(`Validation Error: ${message}`)
    this.code = 400
    this.error = error
  }
}

export default ValidationError
