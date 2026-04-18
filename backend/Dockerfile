# Use a more stable Debian version (Bullseye)
FROM python:3.9-slim-bullseye

# Set environment to prevent installer prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install Tesseract, Thai pack, and OpenCV dependencies with a retry logic
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-tha \
    libgl1-mesa-glx \
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

# Command to run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]