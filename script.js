const audioFile = document.getElementById('audioFile');
const transcribeButton = document.getElementById('transcribeButton');
const loadingIndicator = document.getElementById('loading');
const transcriptArea = document.getElementById('transcript');
const fileNameDisplay = document.getElementById('fileName');

audioFile.addEventListener('change', () => {
    transcribeButton.disabled = false;
    const fileName = audioFile.files[0].name;
    fileNameDisplay.textContent = fileName;
});

transcribeButton.addEventListener('click', transcribeAudio);

function transcribeAudio() {
    if (audioFile.files.length > 0) {
        loadingIndicator.style.display = 'block';
        transcriptArea.value = '';

        const formData = new FormData();
        formData.append('audio_file', audioFile.files[0]);

        fetch('/transcribe', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            transcriptArea.value = data.transcript;
        })
        .catch(error => {
            console.error('Error:', error);
            transcriptArea.value = 'Transcription failed. Please try again.';
        })
        .finally(() => {
            loadingIndicator.style.display = 'none';
        });
    }
}
