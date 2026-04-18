# Use a stable Python base
FROM python:3.9-slim-bullseye

# Set environment to prevent installer prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update and install with the NEW library names for 2026 compatibility
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-tha \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Expose the port Render uses
EXPOSE 10000

# Start the server (Fixed syntax)
CMD uvicorn main:app --host 0.0.0.0 --port 10000