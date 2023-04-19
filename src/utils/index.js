/**
 * Normaliza los rangos de horas agrupando rangos de horas consecutivos, por ejemplo
 * si se envia el siguiente rango de horas:
 * [
 *  { start: 10, end: 12 },
 * { start: 12, end: 13 },
 * ]
 * Se normaliza a:
 * [
 * { start: 10, end: 13 },
 * ]
 * @param {{start: number, end: number}} rangeTimes Rango de horas
 */
export const normalizeRangeTimes = (rangeTimes) => {
  const rangeTimesNormalized = rangeTimes.sort((a, b) => a.start - b.start);
  const rangeTimesNormalized2 = rangeTimesNormalized.reduce(
    (acc, rangeTime) => {
      const lastRangeTime = acc[acc.length - 1];
      if (lastRangeTime?.end >= rangeTime.start) {
        lastRangeTime.end = Math.max(lastRangeTime.end, rangeTime.end);
        return acc;
      }
      return [...acc, rangeTime];
    },
    []
  );
  return rangeTimesNormalized2;
}

/**
 * Crea un handler para las rutas de express, esto permite manejar los errores de forma centralizada
 * y evitar el uso de try/catch en cada funcion de las rutas.
 * Si no se usa try/catch en una funcion de una ruta, los errores no seran capturados por el middleware de errores,
 * y el servidor se caera, porque un solo hilo maneja todas las peticiones.
 * @param {*} fn Funcion a ejecutar
 * @returns
 */
export const createHandler = (fn) => {
  return async (req, res, next) => {
    try {
      const data = await fn(req, res, next);
      return res.json({ data });
    } catch (error) {
      return next(error);
    }
  };
}
