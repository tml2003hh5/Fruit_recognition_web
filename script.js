function uploadImage() {
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
            <p>🔥 السعرات الحرارية: ${data.calories}</p>
            <p>📌 نسبة التعرف: ${data.confidence}</p>
            <img src="${URL.createObjectURL(file)}" width="100">
        `;
    });
}

function captureImage() {
    alert("📷 ميزة التقاط الصورة بالكاميرا قيد التطوير!");
}
