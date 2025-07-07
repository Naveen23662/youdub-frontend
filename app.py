from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import uuid
from generate_audio_edge import process_and_generate_audio

app = Flask(__name__)
CORS(app)

@app.route("/dub", methods=["POST"])
def dub_audio():
    youtube_url = request.form.get("url")
    lang = request.form.get("lang")

    if not youtube_url or not lang:
        return jsonify({"error": "Missing url or lang"}), 400

    try:
        output_path = process_and_generate_audio(youtube_url, lang)

        if not os.path.exists(output_path):
            return jsonify({"error": "Dubbed audio not found"}), 500

        return send_file(output_path, mimetype="audio/wav")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

