document.addEventListener("DOMContentLoaded", function () {
    // Capture Image Button Event
    document.getElementById('capture-btn').addEventListener('click', function () {
        console.log("Capture button clicked.");
        fetch('/capture_ocr')
            .then(response => response.json())
            .then(data => {
                console.log("Response received from /capture_ocr:", data);
                const editorArea = document.getElementById('editor-area');
                if (data.extracted_text) {
                    editorArea.value = data.extracted_text;
                    console.log("OCR Output:", data.extracted_text);
                } else if (data.error) {
                    editorArea.value = 'Error: ' + data.error;
                    console.error("Error capturing image:", data.error);
                } else {
                    editorArea.value = 'No text detected from the captured image.';
                    console.log("No text detected.");
                }
            })
            .catch(err => {
                console.error("Error occurred while capturing image:", err);
                alert("An error occurred while capturing the image.");
            });
    });

    // Handle OCR tab click to fetch OCR output
    document.getElementById('ocr-tab').addEventListener('click', function () {
        this.classList.add('active');
        document.getElementById('code-tab').classList.remove('active');
    });

    // Handle Code tab click for editing C++ code
    document.getElementById('code-tab').addEventListener('click', function () {
        this.classList.add('active');
        document.getElementById('ocr-tab').classList.remove('active');
        document.getElementById('editor-area').value = '';
    });

    // Run the C++ code when "Run Code" button is clicked
    document.getElementById('run-code-btn').addEventListener('click', function () {
        const code = document.getElementById('editor-area').value;
        fetch('/run_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
        })
        .then(response => response.json())
        .then(data => {
            const outputArea = document.getElementById('output-area');
            outputArea.value = data.output || data.error;
        })
        .catch(err => console.error(err));
    });
});
