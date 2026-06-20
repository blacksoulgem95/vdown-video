import { randomUUID } from 'node:crypto';

/**
 * Generate a short correlation ID for debugging.
 * Format: 8 hex chars (e.g., a1b2c3d4)
 */
export function generateCorrelationId(): string {
  return randomUUID().replace(/-/g, '').slice(0, 8);
}

/**
 * Log an error with correlation ID to stderr.
 * The raw error is logged for debugging, but a generic message is returned
 * for user-facing display.
 */
export function logToolError(
  corrId: string,
  toolName: string,
  rawError: string,
  context?: Record<string, unknown>,
): string {
  const ctxStr = context ? ` ${JSON.stringify(context)}` : '';
  console.error(`[${corrId}] ${toolName} error:${ctxStr}`);
  console.error(`[${corrId}] Raw: ${rawError.slice(0, 500)}`);
  return genericErrorMessage(corrId);
}

/**
 * Return a user-friendly generic error message with correlation ID.
 */
export function genericErrorMessage(corrId: string): string {
  return `Download failed (ID: ${corrId}). Please try again.`;
}
