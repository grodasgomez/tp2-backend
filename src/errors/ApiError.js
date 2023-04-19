
/**
 * Clase de error para lanzar errores de logica de negocio
 * @class
 * @extends Error
 * @param {string} message Mensaje de error
 * @param {number} statusCode Codigo de estado HTTP
 */
export default class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}