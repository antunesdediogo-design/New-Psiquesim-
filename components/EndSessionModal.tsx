import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import CloseIcon from './icons/CloseIcon';
import DownloadIcon from './icons/DownloadIcon';
import SaveIcon from './icons/SaveIcon';
import TrashIcon from './icons/TrashIcon';

interface EndSessionModalProps {
  isOpen: boolean;
  patientName: string;
  onClose: () => void;
  onDownloadAndEnd: () => void;
  onSaveAndEnd: () => void;
  onEndWithoutSaving: () => void;
}

const EndSessionModal: React.FC<EndSessionModalProps> = ({
  isOpen,
  patientName,
  onClose,
  onDownloadAndEnd,
  onSaveAndEnd,
  onEndWithoutSaving,
}) => {
  const { t } = useLanguage();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-session-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up text-center p-6 sm:p-8 relative">
        <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-primary-dark p-1 rounded-full transition-colors"
            aria-label="Close modal"
        >
            <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-light/40 mb-4">
            <SaveIcon className="h-8 w-8 text-accent"/>
        </div>

        <h2 id="end-session-modal-title" className="text-2xl font-bold font-heading text-primary-dark">
            {t('chat.endSessionModalTitle')}
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
            {t('chat.endSessionModalText').replace('{patientName}', patientName)}
        </p>

        <div className="space-y-3">
            <button
                onClick={onSaveAndEnd}
                className="w-full inline-flex justify-center items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-base text-white bg-accent hover:bg-opacity-90 transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
                <SaveIcon className="w-5 h-5" />
                <span>{t('chat.saveAndEnd')}</span>
            </button>
            <button
                onClick={onDownloadAndEnd}
                className="w-full inline-flex justify-center items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-base text-primary-dark bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark/50"
            >
                <DownloadIcon className="w-5 h-5" />
                <span>{t('chat.downloadAndEnd')}</span>
            </button>
        </div>

        <div className="mt-8 flex justify-center items-center space-x-6">
            <button
                onClick={onEndWithoutSaving}
                className="text-sm font-semibold text-red-600 hover:underline"
            >
                {t('chat.endWithoutSaving')}
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <button
                onClick={onClose}
                className="text-sm font-semibold text-gray-500 hover:underline"
            >
                {t('chat.cancel')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EndSessionModal;
