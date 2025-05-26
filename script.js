let video = document.getElementById("cameraPreview");
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");

// ✅ Start Camera Automatically
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(error => alert("⚠️ Camera access denied!"));

// ✅ Capture Image from Live Stream
document.getElementById("captureImage").addEventListener("click", function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = canvas.toDataURL("image/png");
    document.getElementById("previewImage").src = imageData;
    document.getElementById("previewImage").style.display = "block";
});

// ✅ Upload Image from Device
document.getElementById("imageUpload").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (file) {
        document.getElementById("previewImage").src = URL.createObjectURL(file);
        document.getElementById("previewImage").style.display = "block";
    }
});

// ✅ Send Image to Flask API
document.getElementById("sendImage").addEventListener("click", async function () {
    let imageElement = document.getElementById("previewImage");
    let formData = new FormData();

    // Convert base64 to blob if image is captured
    if (imageElement.src.startsWith("data:image")) {
        let response = await fetch(imageElement.src);
        let blob = await response.blob();
        formData.append("image", blob, "captured_image.png");
    } else {
        let file = document.getElementById("imageUpload").files[0];
        formData.append("image", file);
    }

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerHTML = `
            <h3>📷 Selected Image:</h3>
            <img src="${imageElement.src}" style="width: 100px;">
            <h3>🔍 Item Name: ${data.fruit_name}</h3>
            <h3>📌 Confidence: ${data.confidence}</h3>
            <h3>🔥 Calories: ${data.calories}</h3>
        `;
    })
    .catch(error => alert("⚠️ Error sending image!"));
});