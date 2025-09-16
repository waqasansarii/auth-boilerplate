import { slidingWindow } from '@arcjet/node';
import aj from '../config/arcjet.js';
import logger from '../config/logger.js';

export const securityMiddleware = async (req, res, next) => {
  try {
    let role = req.user?.role || 'guest';
    let limit;
    let message;
    switch (role) {
      case 'admin':
        limit = 100;
        message = 'Admin rate limit exceeded ';
        break;

      case 'user':
        limit = 50;
        message = 'User rate limit exceeded';
        break;
      case 'guest':
        limit = 20;
        message = 'Guest rate limit exceeded';
        break;
    }
    const client = aj.withRule(
      slidingWindow({ mode: 'LIVE', max: limit, interval: '1m' })
    );
    let decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Request blocked as bot', {
        ip: req.ip,
        reason: decision.reason,
        userAgent: req.get('User-Agent'),
      });
      return res.status(403).json({ error: 'Access denied for bots' });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Request blocked as shield', {
        ip: req.ip,
        reason: decision.reason,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({ error: 'Access denied for shields' });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Request blocked as rate limit exceeded', {
        ip: req.ip,
        reason: decision.reason,
        userAgent: req.get('User-Agent'),
      });
      return res
        .status(403)
        .json({ error: 'Access denied for rate limit exceeded' });
    }
    next()
  } catch (err) {
    console.log(err);
    logger.error('Error in security middleware', { error: err });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export default securityMiddleware;