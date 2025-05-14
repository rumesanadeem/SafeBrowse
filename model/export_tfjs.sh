#!/usr/bin/env bash
set -e

# 1) Convert the Keras model to TF.js
tensorflowjs_converter \
  --input_format=keras \
  url_model \
  model_tfjs

# 2) Copy over vectorizer and vocab (optional if you need the pickle)
cp url_model/vectorizer.pkl model_tfjs/
cp vocab.json              model_tfjs/
cp metrics.json            model_tfjs/

echo "✅ TF.js artifacts and metrics.json are in model_tfjs/"
