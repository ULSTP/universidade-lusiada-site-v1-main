#!/usr/bin/env node

/**
 * Health Check Script
 * Usado pelo Docker e monitoramento externo
 */

import http from 'http';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

const options = {
  hostname: HOST,
  port: PORT,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    console.error(`Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('Health check failed:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('Health check timed out');
  request.destroy();
  process.exit(1);
});

request.setTimeout(2000);
request.end(); 