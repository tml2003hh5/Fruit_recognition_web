let video = document.getElementById("cameraPreview");
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        alert("⚠️ لا يمكن تشغيل الكاميرا: " + error);
    });
}

function captureImage() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    let imageData = canvas.toDataURL("image/png");
    document.getElementById("result").innerHTML = `<img src="${imageData}" width="100">`;
    
    // حفظ الصورة وإرسالها للسيرفر
    sendImageToServer(imageData);
}

function sendImageToServer(imageData) {
    fetch("https://your-ngrok-url.ngrok.io/predict", { 
        method: "POST", 
        body: JSON.stringify({ image: imageData }), 
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerHTML += `
            <h2>🔍 ${data.fruit_name}</h2>
            <p>🔥 السعرات الحرارية: ${data.calories}</p>
            <p>📌 نسبة التعرف: ${data.confidence}</p>
        `;
    });
}