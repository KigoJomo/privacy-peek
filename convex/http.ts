import { httpRouter } from 'convex/server';
import { health, getSite, analyze, getJob } from './httpActions';

const http = httpRouter();

// Health check
http.route({ path: '/health', method: 'GET', handler: health });
http.route({ path: '/health', method: 'DELETE', handler: health });
http.route({ path: '/health', method: 'OPTIONS', handler: health });
http.route({ path: '/health', method: 'PATCH', handler: health });
http.route({ path: '/health', method: 'POST', handler: health });
http.route({ path: '/health', method: 'PUT', handler: health });

// API endpoints for extension
http.route({ path: '/api/site', method: 'GET', handler: getSite });
http.route({ path: '/api/site', method: 'OPTIONS', handler: getSite });

http.route({ path: '/api/analyze', method: 'POST', handler: analyze });
http.route({ path: '/api/analyze', method: 'OPTIONS', handler: analyze });

http.route({ path: '/api/job', method: 'GET', handler: getJob });
http.route({ path: '/api/job', method: 'OPTIONS', handler: getJob });

export default http;
