# model/train.py

import pandas as pd
import numpy as np
import pickle
import json
import tensorflow as tf
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

# 1) Load your CSV (must have columns 'url' and 'label' where label is 0 or 1)
df = pd.read_csv('urls.csv')
urls  = df['url'].astype(str).values
labels = df['label'].astype(int).values

# 2) Split train/test (80/20); no stratification
X_tr, X_te, y_tr, y_te = train_test_split(
    urls, labels,
    test_size=0.2,
    random_state=42
)



# 3) Vectorize (char-3–5-gram CountVectorizer)
vect = CountVectorizer(analyzer='char_wb', ngram_range=(3,5))
X_tr_vec = vect.fit_transform(X_tr).toarray()
X_te_vec = vect.transform(X_te).toarray()

# 4) Build a simple Dense model
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(X_tr_vec.shape[1],)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# 5) Train
history = model.fit(
    X_tr_vec, y_tr,
    epochs=8,
    batch_size=32,
    validation_split=0.1,
    verbose=2
)

# 6) Evaluate on test
loss, acc = model.evaluate(X_te_vec, y_te, verbose=0)
y_pred = (model.predict(X_te_vec) > 0.5).astype(int)
tn, fp, fn, tp = confusion_matrix(y_te, y_pred).ravel()
fpr = fp / (fp + tn)

print(f"\nTest accuracy: {acc*100:.1f}%")
print(f"False-positive rate: {fpr*100:.1f}%")

# 7) Save model + vectorizer + metrics
model.save('url_model')  
with open('url_model/vectorizer.pkl','wb') as f:
    pickle.dump(vect, f)

metrics = {
    'accuracy': round(acc*100,1),
    'false_positive_rate': round(fpr*100,1),
    'n_train': int(len(X_tr)),
    'n_test':  int(len(X_te))
}
with open('metrics.json','w') as f:
    json.dump(metrics, f, indent=2)

# 8) Also dump vocab so you can load it directly in JS if you prefer
vocab = vect.get_feature_names_out().tolist()
with open('vocab.json','w') as f:
    json.dump(vocab, f, indent=2)
