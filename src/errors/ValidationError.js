
/**
 * Clase de error para errores de validación de datos
 * @class
 * @extends Error
 * @param {Object} errors Objeto con los errores de validación
 */
export default class ValidationError extends Error {
  constructor(errors) {
    super("Validation Error");
    this.name = 'ValidationError';
    this.errors = errors;
  }
}