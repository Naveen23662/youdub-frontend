import os
import uuid
import tempfile
import edge_tts
from openai import OpenAI
from yt_dlp import YoutubeDL
from pydub import AudioSegment

client = OpenAI()

def download_audio(youtube_url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'wav',
            'preferredquality': '192',
        }],
        'quiet': True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])

def transcribe_audio(file_path):
    with open(file_path, "rb") as f:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=f
        )
    return transcript.text

def translate_text(text, target_lang):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": f"Translate to {target_lang}"},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content.strip()

async def synthesize_speech(text, output_file, voice="hi-IN-MadhurNeural"):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_file)

def process_and_generate_audio(youtube_url, lang):
    # Step 1: Download
    uid = str(uuid.uuid4())
    raw_audio = f"output/{uid}_input.wav"
    download_audio(youtube_url, raw_audio)

    # Step 2: Transcribe
    transcript = transcribe_audio(raw_audio)

    # Step 3: Translate
    translated = translate_text(transcript, lang)

    # Step 4: TTS
    final_output = f"output/{uid}_dubbed.wav"
    import asyncio
    asyncio.run(synthesize_speech(translated, final_output))

    return final_output

