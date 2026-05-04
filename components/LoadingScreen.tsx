import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import BrainIcon from './icons/BrainIcon';

const LoadingScreen: React.FC<{ message?: string; progress?: number }> = ({ message, progress }) => {
  const { t } = useLanguage();
  const displayText = message || t('loading.text');

  return (
    <div className="fixed inset-0 bg-background-light/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-md">
        <BrainIcon className="w-24 h-24 text-accent mx-auto" />
        <p className="text-primary-dark text-xl mt-4 font-heading tracking-wider">
          {displayText} {progress !== undefined && <span className="font-bold">{Math.round(progress)}%</span>}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6 overflow-hidden">
          {progress !== undefined ? (
             <div 
                className="bg-accent h-2.5 rounded-full transition-all duration-500 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
          ) : (
            <div className="bg-accent h-2.5 rounded-full w-full animate-loading-bar origin-left"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;