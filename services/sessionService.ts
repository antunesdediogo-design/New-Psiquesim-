import { TranscriptionLine } from '../types';

export const downloadTranscript = (transcript: TranscriptionLine[], patientName: string) => {
  const formattedTranscript = transcript
    .map(line => `[${new Date(line.timestamp).toLocaleTimeString()}] ${line.speaker.toUpperCase()}: ${line.text}`)
    .join('\n\n');
  
  const blob = new Blob([formattedTranscript], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  link.download = `session-transcript-${patientName.replace(/\s/g, '_')}-${timestamp}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// In a real app, this would save to a backend.
// This is a placeholder as the functionality is not fully implemented.
export const saveSession = (transcript: TranscriptionLine[], patientName: string): Promise<void> => {
    return new Promise((resolve) => {
        console.log("Session saved for", patientName, transcript);
        // We'll just log it to the console as a placeholder.
        alert(`Session with ${patientName} saved (logged to console).`);
        resolve();
    });
}
