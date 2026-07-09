import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logger import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """Measures request execution telemetry and logs transaction results."""
        start_time = time.time()
        
        # Process request
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            formatted_process_time = "{0:.2f}".format(process_time)
            
            logger.info(
                f"METHOD: {request.method} | "
                f"PATH: {request.url.path} | "
                f"STATUS: {response.status_code} | "
                f"DURATION: {formatted_process_time}ms"
            )
            return response
            
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            formatted_process_time = "{0:.2f}".format(process_time)
            logger.error(
                f"METHOD: {request.method} | "
                f"PATH: {request.url.path} | "
                f"ERROR: {str(e)} | "
                f"DURATION: {formatted_process_time}ms"
            )
            raise e
