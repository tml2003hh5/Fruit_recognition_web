import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
import os
import matplotlib.pyplot as plt
from tabulate import tabulate

# تحديد المسار داخل Kaggle
dataset_folder = "/kaggle/input/ibratml"
model_path = os.path.join(dataset_folder, "FV.h5")
image_path = os.path.join(dataset_folder, "Image_1.jpg")

# تحميل النموذج المدرب
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

def preprocess_image(image_path):
    """تحضير الصورة للإدخال في النموذج."""
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def recognize_image(image_path):
    """تحليل الصورة وإرجاع اسم العنصر ونسبة التعرف وسعراته الحرارية."""
    processed_image = preprocess_image(image_path)
    prediction = model.predict(processed_image)

    # استخراج الفئة المتوقعة
    predicted_label = np.argmax(prediction)
    confidence_score = round(float(np.max(prediction) * 100), 2)  # حساب نسبة التعرف

    # جلب اسم العنصر والسعرات الحرارية
    item_name, calories = labels.get(predicted_label, ("Unknown", "N/A"))

    return item_name, confidence_score, calories

# جلب النتائج
result, confidence, calories = recognize_image(image_path)

# عرض الصورة بحجم صغير (10×10 سم تقريبًا)
img = cv2.imread(image_path)
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

plt.figure(figsize=(2, 2))  # حجم 10×10 سم تقريبًا
plt.imshow(img)
plt.axis('off')
plt.title("INPUT IMAGE")
plt.show()

# عرض النتائج داخل جدول مطبوع
table_data = [
    ["🔍 NAME", result],
    ["📌 RECOGNITION(%)", f"{confidence}%"],
    ["🔥 CALORIES", f"{calories} (for each 100 (g))"]
]
print(tabulate(table_data, headers=["Value", "Informaton"], tablefmt="grid"))
