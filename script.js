document.getElementById("startCamera").addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        let video = document.getElementById("cameraPreview");
        video.srcObject = stream;
        video.style.display = "block"; // Ensure video feed appears
    })
    .catch(error => {
        alert("⚠️ Camera access denied or not supported: " + error);
    });
});

document.getElementById("captureImage").addEventListener("click", function() {
    let video = document.getElementById("cameraPreview");
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let imageData = canvas.toDataURL("image/png");
    document.getElementById("previewImage").src = imageData;
    document.getElementById("previewImage").style.display = "block";
});