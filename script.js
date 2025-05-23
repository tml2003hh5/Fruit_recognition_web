let video = document.getElementById("cameraPreview");
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

document.getElementById("startCamera").addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        alert("⚠️ Camera access denied: " + error);
    });
});

document.getElementById("captureImage").addEventListener("click", function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = canvas.toDataURL("image/png");
    document.getElementById("previewImage").src = imageData;
    document.getElementById("previewImage").style.display = "block";
});

function previewImage(event) {
    let file = event.target.files[0];
    document.getElementById("previewImage").src = URL.createObjectURL(file);
    document.getElementById("previewImage").style.display = "block";
}

document.getElementById("uploadImage").addEventListener("click", function() {
    let file = document.getElementById('imageUpload').files[0];
    let formData = new FormData();
    formData.append("image", file);

    fetch("https://your-ngrok-url.ngrok.io/predict", { 
        method: "POST", 
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerHTML = `
            <h2>🔍 ${data.fruit_name}</h2>
            <p>🔥 Calories: ${data.calories}</p>
            <p>📌 Confidence: ${data.confidence}</p>
        `;
    });
});