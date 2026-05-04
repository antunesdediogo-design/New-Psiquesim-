import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SessionAnalyticsData, EmotionalState } from '../types';
import CloseIcon from './icons/CloseIcon';
import TrophyIcon from './icons/TrophyIcon';
import MicroscopeIcon from './icons/MicroscopeIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import BrainIcon from './icons/BrainIcon';

const stateConfig: Record<EmotionalState, { color: string; score: number }> = {
  Resistant: { color: 'bg-red-500', score: 1 },
  Guarded: { color: 'bg-yellow-600', score: 2 },
  Anxious: { color: 'bg-yellow-500', score: 3 },
  Neutral: { color: 'bg-gray-400', score: 4 },
  Cooperative: { color: 'bg-sky-500', score: 5 },
  Open: { color: 'bg-green-500', score: 6 },
  Hopeful: { color: 'bg-teal-500', score: 7 },
};

const EmotionalStateChart: React.FC<{ journey: { state: EmotionalState; turn: number }[] }> = ({ journey }) => {
    if (!journey || journey.length === 0) return <div className="text-center text-gray-500">No emotional data available.</div>;

    return (
        <div className="w-full h-40 bg-gray-50 rounded-lg p-4 flex items-end space-x-2 overflow-x-auto">
            {journey.map((point) => {
                const config = stateConfig[point.state] || { color: 'bg-gray-400', score: 4 };
                const height = `${(config.score / 7) * 100}%`;
                return (
                    <div key={point.turn} className="flex-1 min-w-[20px] group relative">
                        <div
                            className={`w-full rounded-t-md transition-all duration-300 ${config.color}`}
                            style={{ height }}
                        ></div>
                        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-primary-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2">
                            {point.state} (Turn {point.turn})
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ScoreCircle: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const circumference = 2 * Math.PI * 40; // 2 * pi * radius
    const offset = circumference - (score / 100) * circumference;
    const color = score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle
                        className={`${color} transition-all duration-1000 ease-out`}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${color}`}>{score}</span>
            </div>
            <p className="mt-2 font-semibold text-primary-dark">{label}</p>
        </div>
    );
};

const QuestionPieChart: React.FC<{ data: { openEnded: number, closedEnded: number, reflective: number, other: number } }> = ({ data }) => {
    const { t } = useLanguage();
    const { openEnded, closedEnded, reflective, other } = data;
    const total = openEnded + closedEnded + reflective + other;
    if (total === 0) return <p>No questions to analyze.</p>;

    const openP = openEnded / total * 100;
    const closedP = closedEnded / total * 100;
    const reflectiveP = reflective / total * 100;

    const conicGradient = `conic-gradient(
        #34D399 ${openP}%,
        #FBBF24 0 ${openP + closedP}%,
        #60A5FA 0 ${openP + closedP + reflectiveP}%,
        #9CA3AF 0 100%
    )`;

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full" style={{ background: conicGradient }}></div>
            <div className="text-sm space-y-2">
                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div><span>{t('analytics.openEnded')}: {openEnded}%</span></div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div><span>{t('analytics.closedEnded')}: {closedEnded}%</span></div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div><span>{t('analytics.reflective')}: {reflective}%</span></div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div><span>{t('analytics.other')}: {other}%</span></div>
            </div>
        </div>
    );
};

interface MomentCardProps {
    moment: { emoji: string; title: string; explanation: string; transcriptSnippet: string; };
    icon: React.FC<{ className?: string }>;
    iconBgColor: string;
}

const MomentCard: React.FC<MomentCardProps> = ({ moment, icon: Icon, iconBgColor }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-3 mb-2">
            <div className={`p-2 rounded-full ${iconBgColor}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                 <h4 className="font-bold text-primary-dark">{moment.emoji} {moment.title}</h4>
                 <p className="text-sm text-gray-600">{moment.explanation}</p>
            </div>
        </div>
        <blockquote className="border-l-4 border-gray-200 pl-3 mt-3 text-sm italic text-gray-500">
            "{moment.transcriptSnippet}"
        </blockquote>
    </div>
);

interface SessionAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SessionAnalyticsData;
  patientAvatarUrl: string;
}

const SessionAnalyticsModal: React.FC<SessionAnalyticsModalProps> = ({ isOpen, onClose, data, patientAvatarUrl }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-background-light rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col relative">
        <header className="p-4 border-b bg-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <BrainIcon className="w-8 h-8 text-accent"/>
                <h2 className="text-2xl font-bold font-heading text-primary-dark">
                    {t('analytics.title')}
                </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <CloseIcon className="w-6 h-6 text-gray-500" />
            </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <section className="bg-white p-6 rounded-lg border">
                    <h3 className="text-xl font-bold font-heading mb-4">{t('analytics.overallSummary')}</h3>
                    <p className="text-gray-700 leading-relaxed">{data.overallSummary}</p>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-lg border">
                        <h3 className="text-xl font-bold font-heading mb-4">{t('analytics.strengths')}</h3>
                        <div className="space-y-4">
                            {data.strengths.map((moment, i) => <MomentCard key={i} moment={moment} icon={TrophyIcon} iconBgColor="bg-green-500" />)}
                        </div>
                    </section>
                     <section className="bg-white p-6 rounded-lg border">
                        <h3 className="text-xl font-bold font-heading mb-4">{t('analytics.areasForImprovement')}</h3>
                         <div className="space-y-4">
                            {data.areasForImprovement.map((moment, i) => <MomentCard key={i} moment={moment} icon={MicroscopeIcon} iconBgColor="bg-yellow-500" />)}
                        </div>
                    </section>
                </div>
                 <section className="bg-white p-6 rounded-lg border">
                    <h3 className="text-xl font-bold font-heading mb-4">{t('analytics.keyMoments')}</h3>
                     <div className="space-y-4">
                        {data.keyMoments.map((moment, i) => <MomentCard key={i} moment={moment} icon={LightbulbIcon} iconBgColor="bg-blue-500" />)}
                    </div>
                </section>
            </div>

            {/* Right Column */}
            <aside className="lg:col-span-1 space-y-6">
                <section className="bg-white p-6 rounded-lg border">
                     <h3 className="text-xl font-bold font-heading mb-4">{t('analytics.quantitativeScores')}</h3>
                     <div className="flex justify-around items-center pt-4">
                        <ScoreCircle label={t('analytics.empathy')} score={data.quantitativeScores.empathy} />
                        <ScoreCircle label={t('analytics.rapport')} score={data.quantitativeScores.rapportBuilding} />
                        <ScoreCircle label={t('analytics.adherence')} score={data.quantitativeScores.techniqueAdherence} />
                     </div>
                </section>
                <section className="bg-white p-6 rounded-lg border">
                     <h3 className="text-xl font-bold font-heading mb-4">{t('analytics.emotionalJourney')}</h3>
                     <EmotionalStateChart journey={data.emotionalJourney} />
                </section>
                <section className="bg-white p-6 rounded-lg border">
                     <h3 className="text-xl font-bold font-heading mb-4">{t('analytics.questionAnalysis')}</h3>
                     <QuestionPieChart data={data.questionAnalysis} />
                </section>
            </aside>
        </main>
      </div>
    </div>
  );
};

export default SessionAnalyticsModal;
