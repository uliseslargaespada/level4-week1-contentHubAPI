/**
 * Global error handler middleware.
 *
 * Responsibilities:
 * - Normalize errors into the API error envelope.
 * - Map known Prisma DB errors to HTTP status codes.
 *
 * Prisma error codes reference includes codes such as:
 * - P2002: unique constraint violation
 * - P2003: foreign key constraint violation
 * - P2025: record not found for an operation
 *
 * See Prisma error reference for details. :contentReference[oaicite:8]{index=8}
 */
import { HttpError } from '#utils/httpErrors';
import { Prisma } from '../../generated/prisma/index.js';

/**
 * @param {import('express').Response} res
 * @param {number} status
 * @param {string} code
 * @param {string} message
 * @param {unknown} details
 */
function sendError(res, status, code, message, details = null) {
  return res.status(status).json({
    ok: false,
    error: { code, message, details },
  });
}

/**
 * Map Prisma known request errors to HTTP responses.
 *
 * @param {unknown} err
 * @returns {HttpError|null}
 */
function mapPrismaError(err) {
  // Prisma recommends handling errors by checking their type/code. :contentReference[oaicite:9]{index=9}
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return null;

  switch (err.code) {
    case 'P2002':
      return new HttpError(
        409,
        'UNIQUE_CONSTRAINT',
        'A record with these unique fields already exists.',
        err.meta ?? null,
      );
    case 'P2003':
      return new HttpError(
        409,
        'FOREIGN_KEY_CONSTRAINT',
        'A related record was not found (foreign key constraint).',
        err.meta ?? null,
      );
    case 'P2025':
      return new HttpError(404, 'RECORD_NOT_FOUND', 'Record not found.', err.meta ?? null);
    default:
      return new HttpError(500, 'DATABASE_ERROR', 'A database error occurred.', {
        code: err.code,
        meta: err.meta ?? null,
      });
  }
}

export function createErrorHandler() {
  // eslint-disable-next-line no-unused-vars
  return function errorHandler(err, req, res, next) {
    const prismaMapped = mapPrismaError(err);
    if (prismaMapped) {
      return sendError(
        res,
        prismaMapped.status,
        prismaMapped.code,
        prismaMapped.message,
        prismaMapped.details,
      );
    }

    if (err instanceof HttpError) {
      return sendError(res, err.status, err.code, err.message, err.details);
    }

    // Fallback
    console.error(err);

    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Something went wrong.');
  };
}
