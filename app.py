import whisper
from flask import Flask, render_template, request, jsonify
import tempfile
from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


app = Flask(__name__)

# Load the Whisper model (adjust the size if needed)
model = whisper.load_model("base")  

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return render_template("index.html")  # No immediate processing
    return render_template("index.html") 

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    audio_file = request.files["audio_file"]
    if audio_file:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:  # Temporary file
            audio_file.save(temp_audio.name)  # Save the uploaded file
            result = model.transcribe(temp_audio.name)  # Use the temporary file path
        return jsonify({"transcript": result["text"]})
    else:
        return jsonify({"error": "No audio file uploaded"})
