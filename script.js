function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        let video = document.getElementById("cameraPreview");
        video.srcObject = stream;
    })
    .catch(error => {
        alert("⚠️ لا يمكن تشغيل الكاميرا: " + error);
    });
}

function captureImage() {
    let video = document.getElementById("cameraPreview");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = canvas.toDataURL("image/png");

    document.getElementById("result").innerHTML = `
        <img src="${imageData}" width="100">
    `;

    // إرسال الصورة للسيرفر
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