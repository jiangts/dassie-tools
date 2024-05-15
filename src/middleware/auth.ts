import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const generateSignature = (payload: any, secret: string) => {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
};

export const verifyWebhookSignature = (secret: string) => (req: Request, res: Response, next: NextFunction) => {
  const timestamp = req.headers['X-Timestamp'];
  const nonce = req.headers['X-Nonce'];
  const signature = req.headers['X-Signature'];
  if (!signature || !nonce || !timestamp) {
    return res.status(401).send('Unsigned request');
  }

  // Check if the received signature matches the expected signature
  const expectedSignature = generateSignature([req.body, timestamp, nonce], secret);

  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  next();
};

// TODO: create middlewares for invalidating replay attacks
// create one for invalidating duplicate nonces.
// and another for invalidating timestamps that are too old.
// Note: nonce with ttl prevents replay attacks within a given time window.
//       timestamp prevents replay attacks after a given time window.
//       when combined, they prevent all replay attacks
/**
 * const keyv = new Keyv('redis://localhost:6379', { ttl: 300000 });
 * keyv.on('error', err => console.error('Keyv connection error:', err));
 *
 * const alreadyUsed = await keyv.get(nonce);
 * if (alreadyUsed) {
 *   return res.status(409).send('Nonce has already been used');
 * }
 * await keyv.set(nonce, true);
 */

/**
 * // remember X-Timestamp is in seconds
 * if (Math.abs(currentTime - messageTime) > 5 * 60) { // 5 minutes tolerance
 *   return res.status(401).send('Message expired');
 * }
 */