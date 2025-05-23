function uploadImage() {
    let fileInput = document.getElementById('imageUpload');
    let file = fileInput.files[0];

    if (!file) {
        alert("⚠️ الرجاء اختيار صورة أولًا!");
        return;
    }

    let formData = new FormData();
    formData.append("image", file);

    // عرض الصورة فورًا قبل إرسالها للسيرفر
    let imagePreview = document.getElementById("previewImage");
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block"; // عرض الصورة بعد اختيارها

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
        `;
    });
}