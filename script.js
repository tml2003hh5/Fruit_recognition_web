let video = document.getElementById("cameraPreview");
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");

// 📌 تشغيل الكاميرا
document.getElementById("startCamera").addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.style.display = "block";
    })
    .catch(error => {
        alert("⚠️ لا يمكن تشغيل الكاميرا: " + error);
    });
});

// 📌 التقاط صورة من الكاميرا
document.getElementById("captureImage").addEventListener("click", function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = canvas.toDataURL("image/png");
    document.getElementById("previewImage").src = imageData;
    document.getElementById("previewImage").style.display = "block";

    sendImageToServer(imageData);
});

// 📌 معاينة الصورة المرفوعة
function previewImage(event) {
    let file = event.target.files[0];
    
    if (file) {
        let imagePreview = document.getElementById("previewImage");
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";
    } else {
        alert("⚠️ لم يتم تحديد صورة!");
    }
}

// 📌 إرسال الصورة إلى Flask API المنشور على Render
async function sendImageToServer(imageData) {
    let formData = new FormData();
    let response = await fetch(imageData);
    let blob = await response.blob();
    formData.append("image", blob, "captured_image.png");

    fetch("https://fruit-recognition-web.onrender.com/predict", {  // ✅ رابط API
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerHTML = 
            <h2>🔍 ${data.fruit_name}</h2>
            <p>🔥 السعرات الحرارية: ${data.calories}</p>
            <p>📌 نسبة التعرف: ${data.confidence}</p>
        ;
    })
    .catch(error => {
        alert("⚠️ حدث خطأ أثناء إرسال الصورة: " + error);
    });
}

// 📌 إرسال صورة مرفوعة يدويًا إلى السيرفر
document.getElementById("uploadImage").addEventListener("click", function() {
    let file = document.getElementById('imageUpload').files[0];
    let formData = new FormData();
    formData.append("image", file);

    fetch("https://fruit-recognition-web.onrender.com/predict", {  // ✅ رابط API
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerHTML = 
            <h2>🔍 ${data.fruit_name}</h2>
            <p>🔥 السعرات الحرارية: ${data.calories}</p>
            <p>📌 نسبة التعرف: ${data.confidence}</p>
        ;
    })
    .catch(error => {
        alert("⚠️ حدث خطأ أثناء إرسال الصورة: " + error);
    });
});
