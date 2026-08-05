import { Resend } from 'resend';

let client: Resend | null = null;

/**
 * Lazily constructs the Resend client.
 *
 * Deliberately not initialised at module scope: throwing there takes down the
 * whole module graph at build time, so a missing key would fail `next build`
 * rather than just degrading the contact form.
 */
export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
  }
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}
