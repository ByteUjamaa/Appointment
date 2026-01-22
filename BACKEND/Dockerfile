# Use official Python image
FROM python:3.12-slim

# Set workdir
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the backend code
COPY . .

# Expose port
EXPOSE 8000
