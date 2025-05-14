# Use TF image with Python 3.9
FROM tensorflow/tensorflow:2.12.0

# Install extra libs
RUN pip install --no-cache-dir pandas scikit-learn tensorflowjs

# Workdir
WORKDIR /app

# Copy your training scripts & data
COPY train.py export_tfjs.sh urls.csv ./

# Ensure script is runnable
RUN chmod +x export_tfjs.sh

# Default command: train & export
CMD ["bash", "-lc", "python train.py && bash export_tfjs.sh"]
