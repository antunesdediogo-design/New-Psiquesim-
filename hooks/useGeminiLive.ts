import { useState, useRef, useCallback } from 'react';
import { liveAi } from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';

function downsampleBuffer(buffer: Float32Array, inputSampleRate: number, targetSampleRate: number): Int16Array {
  if (inputSampleRate === targetSampleRate) {
    const l = buffer.length;
    const res = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        res[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32768));
    }
    return res;
  }
  const sampleRateRatio = inputSampleRate / targetSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Int16Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0, count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    const avg = count > 0 ? accum / count : 0;
    result[offsetResult] = Math.max(-32768, Math.min(32767, avg * 32768));
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16Data = new Int16Array(bytes.buffer);
  const float32Data = new Float32Array(int16Data.length);
  for (let i = 0; i < int16Data.length; i++) {
    float32Data[i] = int16Data[i] / 32768.0;
  }
  return float32Data;
}

interface UseGeminiLiveOptions {
    systemInstruction: string;
    voiceName: string;
    onMessage: (speaker: 'user' | 'model', text: string) => void;
    onError: (error: string) => void;
}

export function useGeminiLive({ systemInstruction, voiceName, onMessage, onError }: UseGeminiLiveOptions) {
    const [isLiveConnected, setIsLiveConnected] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const liveSessionRef = useRef<any>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const isInterruptingRef = useRef<boolean>(false);

    const stopLiveSession = useCallback(() => {
        if (liveSessionRef.current) {
            try {
                liveSessionRef.current.close();
            } catch (e) { console.error("Error closing session", e); }
            liveSessionRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current.onaudioprocess = null;
            scriptProcessorRef.current = null;
        }
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop());
            audioStreamRef.current = null;
        }
        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        setIsLiveConnected(false);
        setIsMicActive(false);
        setIsPlayingAudio(false);
        isInterruptingRef.current = false;
    }, []);

    const startLiveSession = useCallback(async () => {
        stopLiveSession();
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Audio recording is not supported in this browser.");
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            inputAudioContextRef.current = new AudioContextClass(); 
            outputAudioContextRef.current = new AudioContextClass();
            
            if (inputAudioContextRef.current.state === 'suspended') await inputAudioContextRef.current.resume();
            if (outputAudioContextRef.current.state === 'suspended') await outputAudioContextRef.current.resume();

            nextStartTimeRef.current = 0;
            audioSourcesRef.current = [];
            
            const sessionPromise = liveAi.live.connect({
                model: 'gemini-2.0-flash-exp',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
                    },
                    systemInstruction: systemInstruction,
                    inputAudioTranscription: {}, 
                    outputAudioTranscription: {}, 
                },
                callbacks: {
                    onopen: () => {
                        setIsLiveConnected(true);
                        setIsMicActive(true);
                        if (!inputAudioContextRef.current || !stream) return;
                        
                        // Send initial trigger
                        sessionPromise.then(session => {
                            session.sendClientContent({
                                turns: [{ role: 'user', parts: [{ text: "Hola, vamos a comenzar la sesión ahora. Por favor salúdame como lo indica tu briefing." }] }],
                                turnComplete: true
                            });
                        });

                        const source = inputAudioContextRef.current.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        
                        let isReadyForAudio = false;
                        setTimeout(() => { isReadyForAudio = true; }, 500);

                        scriptProcessor.onaudioprocess = (e) => {
                            if (!inputAudioContextRef.current || isInterruptingRef.current || !isReadyForAudio) return;
                            const inputData = e.inputBuffer.getChannelData(0);
                            const currentSampleRate = inputAudioContextRef.current.sampleRate;
                            const pcm16 = downsampleBuffer(inputData, currentSampleRate, 16000);
                            const base64Data = arrayBufferToBase64(pcm16.buffer);
                            
                            sessionPromise.then(session => {
                                 session.sendRealtimeInput({
                                     audio: {
                                         mimeType: 'audio/pcm;rate=16000',
                                         data: base64Data
                                     }
                                 });
                            }).catch(err => {
                                console.error("Error sending audio chunk", err);
                            });
                        };
                        
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.interrupted) {
                             isInterruptingRef.current = true;
                             audioSourcesRef.current.forEach(source => {
                                 try { source.stop(); } catch(e) {}
                             });
                             audioSourcesRef.current = [];
                             if (outputAudioContextRef.current) {
                                 nextStartTimeRef.current = outputAudioContextRef.current.currentTime;
                             }
                             setIsPlayingAudio(false);
                             setTimeout(() => { isInterruptingRef.current = false; }, 500);
                             return;
                        }

                        const parts = message.serverContent?.modelTurn?.parts || [];

                        const audioPart = parts?.find(p => p?.inlineData?.data);
                        const base64Audio = audioPart?.inlineData?.data;
                        
                        if (base64Audio && outputAudioContextRef.current && !isInterruptingRef.current) {
                            setIsPlayingAudio(true);
                            const float32Data = base64ToFloat32Array(base64Audio);
                            const buffer = outputAudioContextRef.current.createBuffer(1, float32Data.length, 24000);
                            buffer.getChannelData(0).set(float32Data);
                            
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = buffer;
                            source.connect(outputAudioContextRef.current.destination);
                            
                            const startTime = Math.max(outputAudioContextRef.current.currentTime, nextStartTimeRef.current);
                            source.start(startTime);
                            nextStartTimeRef.current = startTime + buffer.duration;
                            
                            audioSourcesRef.current.push(source);
                            
                            source.onended = () => {
                                audioSourcesRef.current = audioSourcesRef.current.filter(s => s !== source);
                                if (audioSourcesRef.current.length === 0) {
                                    setIsPlayingAudio(false);
                                }
                            };
                        }

                        let textToAppend = '';
                        let speaker: 'user' | 'model' = 'model';
                        
                        if (message.serverContent?.inputTranscription?.text) {
                            textToAppend = message.serverContent.inputTranscription.text;
                            speaker = 'user';
                        } else if (message.serverContent?.outputTranscription?.text) {
                            textToAppend = message.serverContent.outputTranscription.text;
                            speaker = 'model';
                        } else {
                            const textPart = parts.find(p => p?.text);
                            if (textPart?.text) {
                                textToAppend = textPart.text;
                                speaker = 'model';
                            }
                        }
                        if (textToAppend) {
                            onMessage(speaker, textToAppend);
                        }
                    },
                    onclose: () => {
                        setIsLiveConnected(false);
                        setIsMicActive(false);
                    },
                    onerror: (e) => {
                        console.error("Live Session Error Event:", e);
                        onError("Connection error: " + (e instanceof Error ? e.message : "Unknown error"));
                        stopLiveSession();
                    }
                }
            });
            liveSessionRef.current = await sessionPromise;
        } catch (err: any) {
            console.error("Start live session exception:", err);
            let errorMessage = 'Failed to start voice chat.';
            if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
                errorMessage = "Microphone access denied. Please enable microphone permissions.";
            } else if (err.name === 'NotFoundError' || err.message?.includes('device')) {
                errorMessage = "No microphone found. Please connect a microphone.";
            } else if (err.message) {
                errorMessage = err.message;
            }
            onError(errorMessage);
            stopLiveSession();
            throw err;
        }
    }, [systemInstruction, voiceName, stopLiveSession, onMessage, onError]);

    const toggleMic = useCallback(() => {
        if (!inputAudioContextRef.current) return;
        if (inputAudioContextRef.current.state === 'suspended') {
            inputAudioContextRef.current.resume();
            setIsMicActive(true);
        } else if (inputAudioContextRef.current.state === 'running') {
            inputAudioContextRef.current.suspend();
            setIsMicActive(false);
        }
    }, []);

    return {
        isLiveConnected,
        isMicActive,
        isPlayingAudio,
        startLiveSession,
        stopLiveSession,
        toggleMic
    };
}
