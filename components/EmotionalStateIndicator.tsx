import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { EmotionalState, Gender } from '../types';
import MoodIcon from './icons/MoodIcon';

interface EmotionalStateIndicatorProps {
  state: EmotionalState | null;
  gender: Gender;
}

const stateColors: Record<EmotionalState, string> = {
  Cooperative: 'bg-green-500',
  Open: 'bg-green-500',
  Hopeful: 'bg-teal-500',
  Anxious: 'bg-yellow-500',
  Guarded: 'bg-yellow-500',
  Resistant: 'bg-red-500',
  Neutral: 'bg-gray-400',
};

const EmotionalStateIndicator: React.FC<EmotionalStateIndicatorProps> = ({ state, gender }) => {
  const { t, language } = useLanguage();

  if (!state) {
    return null;
  }

  let translatedState = t(`chat.emotionalState_${state}`);
  if (language === 'es' && gender === 'male' && translatedState.endsWith('a')) {
    translatedState = translatedState.slice(0, -1) + 'o';
  }

  const color = stateColors[state] || 'bg-gray-400';

  return (
    <div key={state} className="flex items-center space-x-2 animate-fade-in-up">
      <MoodIcon className="w-5 h-5 text-gray-400" />
      <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
        <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
        <span className="text-sm font-medium text-primary-dark">{translatedState}</span>
      </div>
    </div>
  );
};

export default EmotionalStateIndicator;