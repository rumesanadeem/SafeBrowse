# Use the official TensorFlow image with Python 3.9
FROM tensorflow/tensorflow:2.12.0

# Install any extra Python libraries you need
RUN pip install --no-cache-dir pandas scikit-learn tensorflowjs

# Set our working directory inside the container
WORKDIR /app

# Copy your training scripts and data into the container
COPY train.py export_tfjs.sh urls.csv ./

# Make sure the export script can run
RUN chmod +x export_tfjs.sh
