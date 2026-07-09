import logging
import sys

# Configure standard logger formatting
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

def setup_logger(name: str = "app") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(logging.Formatter(LOG_FORMAT))
        logger.addHandler(console_handler)
        
    return logger

logger = setup_logger()
