
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';

import { useLanguage } from '../contexts/LanguageContext';
import {
  PredefinedSessionData,
  CustomSessionData,
  TranscriptionLine,
  EmotionalState,
  SessionAnalyticsData,
  Gender,
} from '../types';
import { patients } from '../constants';
import {
  ai,
  getSystemInstructionForScenario,
  getSessionAnalytics,
} from '../services/geminiService';
import { downloadTranscript, saveSession } from '../services/sessionService';
import { useGeminiLive } from '../hooks/useGeminiLive';

import LoadingScreen from '../components/LoadingScreen';
import PatientInfoSidebar from '../components/PatientInfoSidebar';
import EndSessionModal from '../components/EndSessionModal';
import ConfirmationModal from '../components/ConfirmationModal';
import SessionAnalyticsModal from '../components/SessionAnalyticsModal';
import EmotionalStateIndicator from '../components/EmotionalStateIndicator';

// Icons
import SendIcon from '../components/icons/SendIcon';
import InfoIcon from '../components/icons/InfoIcon';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import ChatBubbleLeftEllipsisIcon from '../components/icons/ChatBubbleLeftEllipsisIcon';
import MicrophoneIcon from '../components/icons/MicrophoneIcon';
import StopIcon from '../components/icons/StopIcon';
import SpeakerWaveIcon from '../components/icons/SpeakerWaveIcon';

// --- Component Logic ---

const emotionalStateRegex = /\[EMOTIONAL_STATE:\s*(\w+)\s*\]/;

const parseEmotionalState = (text: string): EmotionalState | null => {
    const match = text.match(emotionalStateRegex);
    if (match && match[1]) {
        return match[1] as EmotionalState;
    }
    return null;
}

const cleanTextOfTags = (text: string): string => {
    return text.replace(emotionalStateRegex, '').trim();
}

interface ChatSessionPageProps {
  sessionData: PredefinedSessionData | CustomSessionData;
  onEndSession: () => void;
}

const ChatSessionPage: React.FC<ChatSessionPageProps> = ({ sessionData, onEndSession }) => {
  const { t } = useLanguage();
  
  // Component State
  const [isLoading, setIsLoading] = useState(true);
  const [isModelResponding, setIsModelResponding] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Voice Mode State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  // Transcript and Session State
  const [messages, setMessages] = useState<TranscriptionLine[]>([]);
  const [currentEmotionalState, setCurrentEmotionalState] = useState<EmotionalState | null>(null);
  const chatHistoryEndRef = useRef<HTMLDivElement>(null);

  // Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);
  const [isFeedbackConfirmOpen, setIsFeedbackConfirmOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<SessionAnalyticsData | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Refs for APIs and instances
  const textChatRef = useRef<Chat | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Session data extraction
  const patient = sessionData.mode === 'predefined' ? patients.find(p => p.id === sessionData.patientId) : null;
  const systemInstruction = sessionData.mode === 'predefined' ? getSystemInstructionForScenario(sessionData.scenarioId) : sessionData.systemInstruction;
  const patientName = sessionData.mode === 'predefined' && patient ? t(patient.nameKey) : 'Custom Patient';
  const patientAvatarUrl = patient?.avatarUrl || 'https://picsum.photos/seed/custom/100/100';
  const patientGender: Gender = sessionData.mode === 'custom' 
    ? sessionData.config.gender 
    : (patient?.id === 'tomas-perez' ? 'male' : 'female');

  // Determine Voice for Live API
  const voiceName = patient?.voiceName || (patientGender === 'male' ? 'Fenrir' : 'Kore');

  const scrollToBottom = () => {
    chatHistoryEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleLiveMessage = useCallback((speaker: 'user' | 'model', textToAppend: string) => {
      setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.speaker === speaker) {
              lastMsg.text += textToAppend;
          } else {
              updated.push({ speaker, text: textToAppend, timestamp: Date.now() });
          }
          if (speaker === 'model') {
              const activeModelMsg = updated[updated.length - 1];
              const newState = parseEmotionalState(activeModelMsg.text);
              if (newState) setCurrentEmotionalState(newState);
              activeModelMsg.text = cleanTextOfTags(activeModelMsg.text);
          }
          return updated;
      });
  }, []);

  const {
      isLiveConnected,
      isMicActive,
      isPlayingAudio,
      startLiveSession,
      stopLiveSession,
      toggleMic
  } = useGeminiLive({
      systemInstruction,
      voiceName,
      onMessage: handleLiveMessage,
      onError: (err) => setError(err)
  });
  
  // --- Text Chat Logic ---
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !textChatRef.current) return;

    const newUserMessage: TranscriptionLine = { speaker: 'user', text: messageText, timestamp: Date.now() };
    const newModelMessagePlaceholder: TranscriptionLine = { speaker: 'model', text: '', timestamp: Date.now() };
    
    setMessages(prev => [...prev, newUserMessage, newModelMessagePlaceholder]);
    setIsModelResponding(true);
    setUserInput('');

    try {
        const stream = await textChatRef.current.sendMessageStream({ message: messageText });
        
        let fullModelText = '';
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
                fullModelText += chunkText;
                const newState = parseEmotionalState(fullModelText);
                if (newState) {
                    setCurrentEmotionalState(newState);
                }

                setMessages(prev => {
                    const updatedMessages = [...prev];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                    if (lastMessage && lastMessage.speaker === 'model') {
                        lastMessage.text = cleanTextOfTags(fullModelText);
                    }
                    return updatedMessages;
                });
            }
        }
    } catch (err) {
        console.error("Error sending message:", err);
        setError(t('chat.error.send'));
        setMessages(prev => prev.slice(0, -1)); // Remove placeholder on error
    } finally {
        setIsModelResponding(false);
    }
  }, [t]);

  const toggleVoiceMode = async () => {
      if (isVoiceMode) {
          // Switch to Text
          stopLiveSession();
          textChatRef.current = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: { systemInstruction: systemInstruction },
          });
          setIsVoiceMode(false);
      } else {
          // Switch to Voice
          setError(null);
          try {
              setIsVoiceMode(true);
              await startLiveSession();
          } catch(err) {
              setIsVoiceMode(false);
          }
      }
  };

  // Setup on Mount
  useEffect(() => {
    // Default to text mode init
    textChatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: systemInstruction },
    });
    setIsLoading(false);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      stopLiveSession();
    }
  }, [systemInstruction, stopLiveSession]);

  // Analytics Generation
  const handleGetFeedback = async () => {
    setIsFeedbackConfirmOpen(false);
    setIsFeedbackLoading(true);
    setLoadingProgress(0);

    progressIntervalRef.current = window.setInterval(() => {
        setLoadingProgress(prev => {
            if (prev >= 95) {
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                return 95;
            }
            return prev + Math.floor(Math.random() * 5) + 1;
        });
    }, 500);

    try {
        const data = await getSessionAnalytics(messages, systemInstruction);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setLoadingProgress(100);
        setAnalyticsData(data);
        if (data) {
            setIsAnalyticsOpen(true);
        } else {
            setError(t('chat.error.feedback'));
        }
    } catch(err) {
        console.error("Error getting analytics:", err);
        setError(t('chat.error.feedback'));
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    } finally {
        setTimeout(() => setIsFeedbackLoading(false), 500);
    }
  };

  const handleDownloadAndEnd = () => {
    downloadTranscript(messages, patientName);
    onEndSession();
  };

  const handleSaveAndEnd = () => {
    saveSession(messages, patientName).then(() => {
      onEndSession();
    });
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="h-screen w-screen bg-background-light flex font-sans overflow-hidden">
      <PatientInfoSidebar
        patientId={sessionData.mode === 'predefined' ? sessionData.patientId : undefined}
        customConfig={sessionData.mode === 'custom' ? sessionData.config : undefined}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col h-full relative">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shrink-0 shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="relative">
                <img src={patientAvatarUrl} alt={patientName} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                {isVoiceMode && isLiveConnected && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
                )}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                 <h2 className="text-lg font-bold text-primary-dark">{patientName}</h2>
                 {!isVoiceMode && <EmotionalStateIndicator state={currentEmotionalState} gender={patientGender} />}
              </div>
              <p className="text-sm text-gray-500 h-5 flex items-center">
                 {isModelResponding || isPlayingAudio ? (
                    <span className="animate-pulse text-accent font-medium">{t(patientName.startsWith("Tomás") ? 'chat.loadingTomas' : 'chat.loadingAntonia')}</span>
                 ) : (
                    <span>{isVoiceMode ? 'Listening...' : t(patientName.startsWith("Tomás") ? 'chat.headerTomas' : 'chat.headerAntonia')}</span>
                 )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button 
                onClick={toggleVoiceMode}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 border ${isVoiceMode ? 'bg-primary-dark text-white border-primary-dark' : 'bg-white text-primary-dark border-gray-300 hover:bg-gray-50'}`}
                title={isVoiceMode ? "Switch to Text" : "Switch to Voice"}
            >
                {isVoiceMode ? <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> : <PhoneIcon className="w-5 h-5" />}
                <span className="hidden md:inline text-sm font-semibold">{isVoiceMode ? 'Text Mode' : 'Voice Mode'}</span>
            </button>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <button onClick={() => setIsFeedbackConfirmOpen(true)} className="flex items-center space-x-2 text-sm font-semibold bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg hover:bg-yellow-200 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={messages.length === 0}>
              <LightbulbIcon className="w-5 h-5"/>
              <span className="hidden md:inline">{t('chat.getFeedback')}</span>
            </button>
            <button onClick={() => setIsEndSessionModalOpen(true)} className="text-sm font-semibold bg-red-100 text-red-800 px-3 py-2 rounded-lg hover:bg-red-200 transition">
              <span className="hidden md:inline">{t('chat.endSession')}</span>
              <span className="md:hidden">End</span>
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-full hover:bg-gray-100 lg:hidden">
              <InfoIcon className="w-6 h-6 text-gray-500"/>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 relative">
            {/* Error Toast */}
            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-20 animate-fade-in-up text-center max-w-lg w-full">
                    {error}
                </div>
            )}

            {isVoiceMode ? (
                <div className="flex flex-col h-full">
                    {/* Live Visualizer Area */}
                    <div className="flex-grow flex flex-col items-center justify-center space-y-8 py-10">
                        <div className="relative">
                            <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isPlayingAudio ? 'scale-110 shadow-[0_0_50px_rgba(230,126,34,0.6)] bg-accent/10' : 'bg-gray-100'}`}>
                                <img src={patientAvatarUrl} alt={patientName} className="w-40 h-40 rounded-full object-cover" />
                            </div>
                            {isPlayingAudio && (
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                                    <SpeakerWaveIcon className="w-8 h-8 text-accent animate-bounce" />
                                </div>
                            )}
                        </div>
                        
                        <div className="text-center space-y-2">
                            <p className="text-xl font-heading text-primary-dark">
                                {isPlayingAudio ? "Speaking..." : (isLiveConnected ? "Listening..." : "Initializing...")}
                            </p>
                            {isLiveConnected ? (
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    Talk naturally. The AI will listen and respond.
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 animate-pulse">
                                    Connecting to secure voice server...
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Real-time Transcript (Bottom) */}
                    <div className="h-48 border-t border-gray-200 bg-white/50 p-4 overflow-y-auto backdrop-blur-sm rounded-t-xl">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Live Transcript</h4>
                         <div className="space-y-2">
                             {messages.slice(-3).map((line, index) => (
                                <div key={index} className={`text-sm ${line.speaker === 'user' ? 'text-blue-600 text-right' : 'text-gray-700'}`}>
                                    <span className="font-semibold">{line.speaker === 'user' ? 'You' : patientName}:</span> {line.text}
                                </div>
                             ))}
                             <div ref={chatHistoryEndRef} />
                         </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 pb-4">
                    {messages.length === 0 && (
                         <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                             <ChatBubbleLeftEllipsisIcon className="w-12 h-12 mb-2 opacity-20" />
                             <p>Start the conversation...</p>
                         </div>
                    )}
                    {messages.map((line, index) => (
                        <div key={index} className={`flex items-end gap-3 ${line.speaker === 'user' ? 'justify-end' : ''} animate-fade-in-up`}>
                        {line.speaker === 'model' && <img src={patientAvatarUrl} className="w-8 h-8 rounded-full shadow-sm" alt="patient"/>}
                        <div className={`max-w-xl p-4 rounded-2xl shadow-sm ${line.speaker === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                            <p className="leading-relaxed">
                            {line.text}
                            {isModelResponding && line.speaker === 'model' && index === messages.length - 1 && (
                                <span className="inline-block w-1.5 h-4 bg-gray-400 animate-pulse ml-1 align-middle rounded-full"></span>
                            )}
                            </p>
                        </div>
                        </div>
                    ))}
                    <div ref={chatHistoryEndRef} />
                </div>
            )}
        </main>

        <footer className="bg-white border-t p-4 shrink-0">
            {isVoiceMode ? (
                <div className="flex justify-center items-center py-4 space-x-8">
                     <button 
                        onClick={toggleMic}
                        disabled={!isLiveConnected}
                        className={`p-6 rounded-full transition-all duration-300 shadow-lg ${!isLiveConnected ? 'opacity-50 cursor-not-allowed bg-gray-100' : isMicActive ? 'bg-red-500 hover:bg-red-600 text-white scale-110 ring-4 ring-red-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                        title={isMicActive ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {isMicActive ? <StopIcon className="w-8 h-8" /> : <MicrophoneIcon className="w-8 h-8" />}
                     </button>
                </div>
            ) : (
                <form className="flex-1 relative max-w-4xl mx-auto w-full" onSubmit={(e) => { e.preventDefault(); handleSendMessage(userInput); }}>
                    <input 
                        type="text" 
                        placeholder={t('chat.inputPlaceholder')} 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={isModelResponding}
                        className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-full py-4 pl-6 pr-16 transition-all duration-200 disabled:opacity-70 shadow-inner" 
                    />
                    <button type="submit" disabled={!userInput || isModelResponding} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-accent hover:bg-accent/90 rounded-full disabled:bg-gray-300 transition-colors shadow-sm">
                    <SendIcon className="w-5 h-5 text-white"/>
                    </button>
                </form>
            )}
        </footer>
      </div>

      <EndSessionModal 
        isOpen={isEndSessionModalOpen}
        onClose={() => setIsEndSessionModalOpen(false)}
        patientName={patientName}
        onDownloadAndEnd={handleDownloadAndEnd}
        onSaveAndEnd={handleSaveAndEnd}
        onEndWithoutSaving={onEndSession}
      />

      <ConfirmationModal
        isOpen={isFeedbackConfirmOpen}
        onClose={() => setIsFeedbackConfirmOpen(false)}
        onConfirm={handleGetFeedback}
        title={t('chat.feedbackConfirmTitle')}
        message={t('chat.feedbackConfirmText')}
        confirmText={t('chat.confirm')}
        cancelText={t('chat.cancel')}
      />
      
      {isFeedbackLoading && <LoadingScreen message={t('chat.feedbackLoading')} progress={loadingProgress} />}

      {analyticsData && (
        <SessionAnalyticsModal 
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          data={analyticsData}
          patientAvatarUrl={patientAvatarUrl}
        />
      )}
    </div>
  );
};

export default ChatSessionPage;
