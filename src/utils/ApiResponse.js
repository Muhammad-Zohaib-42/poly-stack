export class ApiResponse {
  constructor(statusCode, message, data = [], success) {
    this.status = statusCode
    this.message = message
    this.data = data
    this.success = success
  }
}