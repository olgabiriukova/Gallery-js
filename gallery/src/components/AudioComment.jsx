import React, { useState, useRef } from 'react';

function AudioComment({ onSave }) {
  const [isRecording, setIsRecording] = useState(false); // recording state
  const [audioUrl, setAudioUrl] = useState(null);       // audio URL for playback and saving
  const mediaRecorderRef = useRef(null);                 // MediaRecorder instance
  const audioChunksRef = useRef([]);                      // audio data chunks

  // Convert Blob to base64 string
  const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // data:audio/wav;base64,...
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // Collect audio data chunks
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      // When recording stops, convert chunks to base64
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const base64Audio = await blobToBase64(audioBlob);
        setAudioUrl(base64Audio);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Save recorded audio by calling parent callback
  const handleSave = () => {
    if (audioUrl) {
      onSave(audioUrl);
      setAudioUrl(null);
    }
  };

  return (
    <div className="audio-comment">
      <h3>Add audio comment</h3>
      <div>
        {!isRecording ? (
          <button onClick={startRecording}>Start recording</button>
        ) : (
          <button onClick={stopRecording}>Stop recording</button>
        )}
      </div>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
          <button onClick={handleSave}>Save сomment</button>
        </div>
      )}
    </div>
  );
}

export default AudioComment;
