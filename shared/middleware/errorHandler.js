export function errorHandler(error, request, reply) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  request.log.error(error);
  
  if (error.statusCode) {
    reply.code(error.statusCode);
  } else {
    reply.code(500);
  }
  
  const response = {
    error: error.name || 'Error',
    message: error.message,
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString()
  };
  
  if (isDevelopment) {
    response.stack = error.stack;
  }
  
  reply.send(response);
}
