from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)

# تحميل النموذج المدرب
dataset_folder = "/kaggle/input/ibratml"
model_path = os.path.join(dataset_folder, "FV.h5")
model = load_model(model_path)

# قاموس الفئات مع السعرات الحرارية
labels = {
    0: ('Apple', 52), 1: ('Banana', 89), 2: ('Beetroot', 43), 3: ('Bell Pepper', 20),
    4: ('Cabbage', 25), 5: ('Capsicum', 40), 6: ('Carrot', 41), 7: ('Cauliflower', 25),
    8: ('Chilli Pepper', 40), 9: ('Corn', 96), 10: ('Cucumber', 15), 11: ('Eggplant', 35),
    12: ('Garlic', 149), 13: ('Ginger', 80), 14: ('Grapes', 69), 15: ('Jalepeno', 29),
    16: ('Kiwi', 61), 17: ('Lemon', 29), 18: ('Lettuce', 15), 19: ('Mango', 60),
    20: ('Onion', 40), 21: ('Orange', 47), 22: ('Paprika', 20), 23: ('Pear', 57),
    24: ('Peas', 81), 25: ('Pineapple', 50), 26: ('Pomegranate', 83), 27: ('Potato', 77),
    28: ('Raddish', 16), 29: ('Soy Beans', 173), 30: ('Spinach', 23), 31: ('Sweetcorn', 86),
    32: ('Sweetpotato', 86), 33: ('Tomato', 18), 34: ('Turnip', 28), 35: ('Watermelon', 30)
}

def preprocess_image(image):
    """تحضير الصورة للإدخال في النموذج."""
    img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route('/predict', methods=['POST'])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "⚠️ لم يتم تحميل صورة!"})

    image = request.files["image"]
    processed_image = preprocess_image(image)
    prediction = model.predict(processed_image)

    predicted_label = np.argmax(prediction)
    confidence = round(float(np.max(prediction) * 100), 2)
    item_name, calories = labels.get(predicted_label, ("Unknown", "N/A"))

    return jsonify({
        "fruit_name": item_name,
        "confidence": f"{confidence}%",
        "calories": f"{calories} kcal"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)