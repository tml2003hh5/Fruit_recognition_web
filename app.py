from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)

# تحميل النموذج
model = load_model("FV.h5")

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    image_path = "temp.jpg"
    file.save(image_path)

    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    predicted_label = np.argmax(prediction)
    confidence_score = round(float(np.max(prediction) * 100), 2)

    return jsonify({
        "fruit_name": f"Fruit #{predicted_label}",
        "confidence": f"{confidence_score}%",
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)