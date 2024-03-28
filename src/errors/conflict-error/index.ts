class ConflictError extends Error {
  code: number
  error?: string

  constructor (
    message: string,
    error?: string
  ) {
    super(`Conflict Error: ${message}`)
    this.code = 409
    this.error = error
  }
}

export default ConflictError
