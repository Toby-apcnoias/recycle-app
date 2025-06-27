# Use a specific Python version for better reliability
FROM python:3.11-slim

# Alternative: If the above fails, try these versions:
# FROM python:3.11.8-slim
# FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies with retry logic and better error handling
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies with increased timeout and retry settings
RUN pip install --default-timeout=300 --retries=10 --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

# Copy application code
COPY app/ ./app/

# Copy Python files from root (if they exist)
# COPY download_pretrained.py generate_model.py ./

# Create necessary directories
RUN mkdir -p models logs pretrained_models

# Copy pretrained model weights if they exist
COPY pretrained_models/ ./pretrained_models/

# Add health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ping || exit 1

# Expose port
EXPOSE 8000

# Run the application with better error handling
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"] 