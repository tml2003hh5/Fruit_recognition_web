from flask import Flask, request, jsonify
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)

# ✅ تحميل النموذج من مجلد `database`
model_path = "database/FV.h5"
if os.path.exists(model_path):
    model = load_model(model_path)
else:
    raise FileNotFoundError(f"⚠️ الملف {model_path} غير موجود، تأكد من وضعه داخل `database/`!")

# ✅ قاموس الفواكه والخضروات مع السعرات الحرارية
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
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route('/predict', methods=['POST'])
def predict():
    """استقبال الصورة وإرجاع اسم العنصر ونسبة التعرف والسعرات الحرارية."""
    if "image" not in request.files:
        return jsonify({"error": "⚠️ لم يتم تحميل صورة!"})

    image = request.files["image"]
    processed_image = preprocess_image(image)
    prediction = model.predict(processed_image)

    predicted_label = np.argmax(prediction)
    confidence_score = round(float(np.max(prediction) * 100), 2)  

    # 🔹 جلب اسم العنصر والسعرات الحرارية من القاموس
    item_name, calories = labels.get(predicted_label, ("Unknown", "N/A"))

    return jsonify({
        "fruit_name": item_name,
        "confidence": f"{confidence_score}%",
        "calories": f"{calories} (لكل 100 جرام)"
    })

# ✅ تشغيل Flask API داخل Render
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
