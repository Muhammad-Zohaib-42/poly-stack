export class ApiResponse {
  constructor(statusCode, message, success = true, data = {}) {
    this.status = statusCode
    this.message = message
    this.data = data
    this.success = success
  }
}