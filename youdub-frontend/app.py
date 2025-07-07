def get_edge_voice(lang):
    voice_map = {
        "English": "en-US-AriaNeural",
        "Hindi": "hi-IN-SwaraNeural",
        "Telugu": "te-IN-ShrutiNeural",
        "Tamil": "ta-IN-PallaviNeural",
        "Kannada": "kn-IN-GaganNeural",
        "Gujarati": "gu-IN-DhwaniNeural",
        "Bengali": "bn-IN-TanishaaNeural",
        "Malayalam": "ml-IN-SobhanaNeural",
        "Marathi": "mr-IN-AarohiNeural",
        "Punjabi": "pa-IN-AnkitaNeural",
        "French": "fr-FR-DeniseNeural",
        "German": "de-DE-KatjaNeural",
        "Spanish": "es-ES-ElviraNeural",
        "Italian": "it-IT-ElsaNeural",
        "Russian": "ru-RU-SvetlanaNeural",
        "Japanese": "ja-JP-NanamiNeural",
        "Korean": "ko-KR-SunHiNeural",
        "Arabic": "ar-EG-SalmaNeural",
        "Chinese": "zh-CN-XiaoxiaoNeural",
        "Portuguese": "pt-PT-RaquelNeural"
    }
    return voice_map.get(lang, "en-US-AriaNeural")
from moviepy.editor import VideoFileClip, AudioFileClip

@app.route('/combine', methods=['POST'])
def combine_video_audio():
    data = request.get_json()
    youtube_url = data.get("url")
    dubbed_audio = data.get("audio")  # example: "outputs/xyz.mp3"

    if not youtube_url or not dubbed_audio:
        return jsonify({"error": "Missing input"}), 400

    try:
        file_id = str(uuid.uuid4())
        video_path = os.path.join(OUTPUT_DIR, f"{file_id}.mp4")

        # Download YouTube video (video only)
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]',
            'outtmpl': video_path,
            'quiet': True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])

        # Combine downloaded video and dubbed audio
        output_path = os.path.join(OUTPUT_DIR, f"{file_id}_final.mp4")
        video = VideoFileClip(video_path)
        audio = AudioFileClip(dubbed_audio)

        final_video = video.set_audio(audio)
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

        return jsonify({
            "message": "Dubbed video ready",
            "file": f"/video/{file_id}_final.mp4"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/video/<filename>')
def serve_video(filename):
    path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(path):
        return send_file(path)
    return "Video not found", 404

