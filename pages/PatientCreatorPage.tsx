
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { CustomPatientConfig, TherapeuticModel, Gender, AgeRange, SocioeconomicStatus, PresentingProblem, PatientAttitude, RelationalStyle, CopingMechanism } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import CheckIcon from '../components/icons/CheckIcon';

interface PatientCreatorPageProps {
  onBackToDashboard: () => void;
  onStartCustomSession: (config: CustomPatientConfig) => void;
}

const modelOptions: { id: TherapeuticModel, titleKey: string, descKey: string }[] = [
    { id: 'sfb', titleKey: 'patientCreator.model_sfb', descKey: 'patientCreator.model_sfb_desc' },
    { id: 'cbt', titleKey: 'patientCreator.model_cbt', descKey: 'patientCreator.model_cbt_desc' },
    { id: 'mi', titleKey: 'patientCreator.model_mi', descKey: 'patientCreator.model_mi_desc' },
];
const genderOptions: { id: Gender, titleKey: string }[] = [
    { id: 'male', titleKey: 'patientCreator.gender_male' },
    { id: 'female', titleKey: 'patientCreator.gender_female' },
    { id: 'non-binary', titleKey: 'patientCreator.gender_non-binary' },
];
const ageOptions: { id: AgeRange, titleKey: string }[] = [
    { id: '20-30', titleKey: 'patientCreator.age_20-30' },
    { id: '30-40', titleKey: 'patientCreator.age_30-40' },
    { id: '40-50', titleKey: 'patientCreator.age_40-50' },
    { id: '50+', titleKey: 'patientCreator.age_50+' },
];
const sesOptions: { id: SocioeconomicStatus, titleKey: string }[] = [
    { id: 'low', titleKey: 'patientCreator.ses_low' },
    { id: 'middle', titleKey: 'patientCreator.ses_middle' },
    { id: 'high', titleKey: 'patientCreator.ses_high' },
];
const problemOptions: { id: PresentingProblem, titleKey: string }[] = [
    { id: 'procrastination', titleKey: 'patientCreator.problem_procrastination'},
    { id: 'social-anxiety', titleKey: 'patientCreator.problem_social-anxiety'},
    { id: 'relationship-conflict', titleKey: 'patientCreator.problem_relationship-conflict'},
    { id: 'low-self-esteem', titleKey: 'patientCreator.problem_low-self-esteem'},
    { id: 'grief', titleKey: 'patientCreator.problem_grief'},
];
const attitudeOptions: { id: PatientAttitude, titleKey: string }[] = [
    { id: 'cooperative', titleKey: 'patientCreator.attitude_cooperative'},
    { id: 'anxious-guarded', titleKey: 'patientCreator.attitude_anxious-guarded'},
    { id: 'skeptical-resistant', titleKey: 'patientCreator.attitude_skeptical-resistant'},
];
const styleOptions: { id: RelationalStyle, titleKey: string, descKey: string }[] = [
    { id: 'secure', titleKey: 'patientCreator.style_secure', descKey: 'patientCreator.style_secure_desc' },
    { id: 'anxious', titleKey: 'patientCreator.style_anxious', descKey: 'patientCreator.style_anxious_desc' },
    { id: 'avoidant', titleKey: 'patientCreator.style_avoidant', descKey: 'patientCreator.style_avoidant_desc' },
    { id: 'disorganized', titleKey: 'patientCreator.style_disorganized', descKey: 'patientCreator.style_disorganized_desc' },
];

const copingOptions: { id: CopingMechanism, titleKey: string, descKey: string }[] = [
    { id: 'avoidance', titleKey: 'patientCreator.mechanism_avoidance', descKey: 'patientCreator.mechanism_avoidance_desc' },
    { id: 'intellectualization', titleKey: 'patientCreator.mechanism_intellectualization', descKey: 'patientCreator.mechanism_intellectualization_desc' },
    { id: 'humor', titleKey: 'patientCreator.mechanism_humor', descKey: 'patientCreator.mechanism_humor_desc' },
    { id: 'externalizing', titleKey: 'patientCreator.mechanism_externalizing', descKey: 'patientCreator.mechanism_externalizing_desc' },
];

const exampleHiddenConcerns: { [key: string]: string[] } = {
    en: [
        "I'm worried I'm drinking too much lately.",
        "I was fired from my last job and I'm too ashamed to tell anyone.",
        "I'm having thoughts about leaving my partner.",
        "I'm in a lot of debt but I pretend everything is fine.",
        "I feel like a fraud in my career, like I'm going to be exposed.",
    ],
    es: [
        "Me preocupa estar bebiendo demasiado últimamente.",
        "Me despidieron de mi último trabajo y me da demasiada vergüenza contárselo a nadie.",
        "Estoy teniendo pensamientos sobre dejar a mi pareja.",
        "Tengo muchas deudas pero finjo que todo está bien.",
        "Me siento como un fraude en mi carrera, como si fueran a descubrirme.",
    ]
};


const PatientCreatorPage: React.FC<PatientCreatorPageProps> = ({ onBackToDashboard, onStartCustomSession }) => {
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1);
    const [randomizeAll, setRandomizeAll] = useState(false);
    const [config, setConfig] = useState<CustomPatientConfig>({
        model: 'sfb',
        gender: 'female',
        ageRange: '30-40',
        ses: 'middle',
        problems: ['procrastination'],
        attitude: 'anxious-guarded',
        relationalStyle: 'secure',
        copingMechanisms: ['avoidance'],
        hiddenConcern: '',
    });

    const handleProblemToggle = (problem: PresentingProblem) => {
        setConfig(prev => {
            const newProblems = prev.problems.includes(problem)
                ? prev.problems.filter(p => p !== problem)
                : [...prev.problems, problem];
            if (newProblems.length > 2) newProblems.shift(); // Keep only last 2 selected
            return { ...prev, problems: newProblems };
        });
    };
    
    const handleCopingToggle = (mechanism: CopingMechanism) => {
        setConfig(prev => {
            const newMechanisms = prev.copingMechanisms.includes(mechanism)
                ? prev.copingMechanisms.filter(p => p !== mechanism)
                : [...prev.copingMechanisms, mechanism];
            if (newMechanisms.length > 2) newMechanisms.shift();
            return { ...prev, copingMechanisms: newMechanisms };
        })
    };
    
    const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    const randomize = () => {
        const newProblems: PresentingProblem[] = [];
        while (newProblems.length < 2) {
            const p = randomItem(problemOptions).id;
            if (!newProblems.includes(p)) newProblems.push(p);
        }

        const newCoping: CopingMechanism[] = [];
        while (newCoping.length < 2) {
            const c = randomItem(copingOptions).id;
            if (!newCoping.includes(c)) newCoping.push(c);
        }
        
        setConfig({
            model: randomItem(modelOptions).id,
            gender: randomItem(genderOptions).id,
            ageRange: randomItem(ageOptions).id,
            ses: randomItem(sesOptions).id,
            problems: newProblems,
            attitude: randomItem(attitudeOptions).id,
            relationalStyle: randomItem(styleOptions).id,
            copingMechanisms: newCoping,
            hiddenConcern: randomItem(exampleHiddenConcerns[language]),
        });
    };
    
    if (randomizeAll) {
        randomize();
        setStep(7);
        setRandomizeAll(false);
    }

    const renderStep = () => {
        switch(step) {
            case 1: // Therapeutic Model
                return (
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2">{t('patientCreator.step1Title')}</h3>
                        <p className="text-gray-600 mb-6">{t('patientCreator.step1Description')}</p>
                        <div className="space-y-4">
                            {modelOptions.map(opt => (
                                <button key={opt.id} onClick={() => setConfig({...config, model: opt.id})} className={`w-full text-left p-4 border-2 rounded-lg transition-all ${config.model === opt.id ? 'border-accent bg-accent/10' : 'hover:border-primary-light'}`}>
                                    <div className="font-bold text-primary-dark">{t(opt.titleKey)}</div>
                                    <div className="text-sm text-gray-600">{t(opt.descKey)}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2: // Demographics
                return (
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2">{t('patientCreator.step2Title')}</h3>
                        <p className="text-gray-600 mb-6">{t('patientCreator.step2Description')}</p>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">{t('patientCreator.gender')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {genderOptions.map(opt => <button key={opt.id} onClick={() => setConfig({...config, gender: opt.id})} className={`px-4 py-2 rounded-full border-2 ${config.gender === opt.id ? 'bg-accent text-white border-accent' : 'hover:border-primary-light'}`}>{t(opt.titleKey)}</button>)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">{t('patientCreator.age')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {ageOptions.map(opt => <button key={opt.id} onClick={() => setConfig({...config, ageRange: opt.id})} className={`px-4 py-2 rounded-full border-2 ${config.ageRange === opt.id ? 'bg-accent text-white border-accent' : 'hover:border-primary-light'}`}>{t(opt.titleKey)}</button>)}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">{t('patientCreator.ses')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {sesOptions.map(opt => <button key={opt.id} onClick={() => setConfig({...config, ses: opt.id})} className={`px-4 py-2 rounded-full border-2 ${config.ses === opt.id ? 'bg-accent text-white border-accent' : 'hover:border-primary-light'}`}>{t(opt.titleKey)}</button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Clinical Picture
                return (
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2">{t('patientCreator.step3Title')}</h3>
                        <p className="text-gray-600 mb-6">{t('patientCreator.step3Description')}</p>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">{t('patientCreator.problems')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {problemOptions.map(opt => <button key={opt.id} onClick={() => handleProblemToggle(opt.id)} className={`px-4 py-2 rounded-full border-2 ${config.problems.includes(opt.id) ? 'bg-accent text-white border-accent' : 'hover:border-primary-light'}`}>{t(opt.titleKey)}</button>)}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">{t('patientCreator.attitude')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {attitudeOptions.map(opt => <button key={opt.id} onClick={() => setConfig({...config, attitude: opt.id})} className={`px-4 py-2 rounded-full border-2 ${config.attitude === opt.id ? 'bg-accent text-white border-accent' : 'hover:border-primary-light'}`}>{t(opt.titleKey)}</button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Interpersonal Style
                 return (
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2">{t('patientCreator.step4Title')}</h3>
                        <p className="text-gray-600 mb-6">{t('patientCreator.step4Description')}</p>
                        <div className="space-y-4">
                            {styleOptions.map(opt => (
                                <button key={opt.id} onClick={() => setConfig({...config, relationalStyle: opt.id})} className={`w-full text-left p-4 border-2 rounded-lg transition-all ${config.relationalStyle === opt.id ? 'border-accent bg-accent/10' : 'hover:border-primary-light'}`}>
                                    <div className="font-bold text-primary-dark">{t(opt.titleKey)}</div>
                                    <div className="text-sm text-gray-600">{t(opt.descKey)}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 5: // Coping Mechanisms
                 return (
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2">{t('patientCreator.step5Title')}</h3>
                        <p className="text-gray-600 mb-6">{t('patientCreator.step5Description')}</p>
                        <div className="space-y-4">
                            {copingOptions.map(opt => (
                                <button key={opt.id} onClick={() => handleCopingToggle(opt.id)} className={`w-full text-left p-4 border-2 rounded-lg transition-all flex items-start space-x-4 ${config.copingMechanisms.includes(opt.id) ? 'border-accent bg-accent/10' : 'hover:border-primary-light'}`}>
                                    <div className={`w-6 h-6 rounded mt-1 shrink-0 flex items-center justify-center border-2 ${config.copingMechanisms.includes(opt.id) ? 'bg-accent border-accent' : 'border-gray-300'}`}>
                                       {config.copingMechanisms.includes(opt.id) && <CheckIcon className="w-4 h-4 text-white" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-primary-dark">{t(opt.titleKey)}</div>
                                        <div className="text-sm text-gray-600">{t(opt.descKey)}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 6: // Hidden Concern
                 return (
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2">{t('patientCreator.step6Title')}</h3>
                        <p className="text-gray-600 mb-6">{t('patientCreator.step6Description')}</p>
                        <label htmlFor="hiddenConcern" className="font-semibold block mb-2">{t('patientCreator.hiddenConcernLabel')}</label>
                        <textarea
                            id="hiddenConcern"
                            value={config.hiddenConcern}
                            onChange={(e) => setConfig({...config, hiddenConcern: e.target.value})}
                            placeholder={t('patientCreator.hiddenConcernPlaceholder')}
                            className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-accent focus:border-accent"
                        />
                        <button onClick={() => setConfig({...config, hiddenConcern: randomItem(exampleHiddenConcerns[language])})} className="text-sm text-accent font-semibold mt-2">{t('patientCreator.randomize')}</button>
                    </div>
                );
            case 7: // Review
                return (
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-2">{t('patientCreator.step7Title')}</h3>
                        <p className="text-gray-600 mb-6">{t('patientCreator.step7Description')}</p>
                        <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_model')}:</strong><span>{t(`patientCreator.model_${config.model}`)}</span></div>
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_gender')}:</strong><span>{t(`patientCreator.gender_${config.gender}`)}</span></div>
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_age')}:</strong><span>{t(`patientCreator.age_${config.ageRange}`)}</span></div>
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_ses')}:</strong><span>{t(`patientCreator.ses_${config.ses}`)}</span></div>
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_problems')}:</strong><span className="text-right">{config.problems.map(p => t(`patientCreator.problem_${p}`)).join(', ')}</span></div>
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_attitude')}:</strong><span>{t(`patientCreator.attitude_${config.attitude}`)}</span></div>
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_style')}:</strong><span>{t(`patientCreator.style_${config.relationalStyle}`)}</span></div>
                           <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_coping')}:</strong><span className="text-right">{config.copingMechanisms.map(c => t(`patientCreator.mechanism_${c}`)).join(', ')}</span></div>
                           {config.hiddenConcern && <div className="flex justify-between"><strong className="text-gray-500">{t('patientCreator.summary_hiddenConcern')}:</strong><span className="italic text-right">"{config.hiddenConcern}"</span></div>}
                        </div>
                    </div>
                );
        }
    }

    const progress = (step / 7) * 100;

    return (
        <div className="min-h-screen bg-primary-light/20 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-2xl">
                <div className="bg-white rounded-lg shadow-xl p-8 relative">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <h2 className="text-2xl font-bold font-heading text-primary-dark">
                                {t('patientCreator.wizardTitle')}
                            </h2>
                            <button onClick={onBackToDashboard} className="text-sm text-gray-500 hover:text-primary-dark flex items-center space-x-1">
                                <ArrowLeftIcon className="w-4 h-4" />
                                <span>{t('patientCreator.backToDashboard')}</span>
                            </button>
                        </div>
                        <button onClick={() => setRandomizeAll(true)} className="border border-accent text-accent px-3 py-1.5 rounded-md font-semibold hover:bg-accent hover:text-white transition-colors text-sm">
                            {t('patientCreator.randomize')}
                        </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                        <div className="bg-accent h-2 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                    </div>

                    <div className="min-h-[350px]">
                        {renderStep()}
                    </div>
                    
                    <div className="flex justify-between items-center mt-8">
                        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-6 py-2 rounded-md font-semibold text-primary-dark bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                            {t('patientCreator.back')}
                        </button>
                        {step < 7 ? (
                            <button onClick={() => setStep(s => Math.min(7, s + 1))} className="px-6 py-2 rounded-md font-semibold text-white bg-accent hover:bg-opacity-90">
                                {t('patientCreator.next')}
                            </button>
                        ) : (
                             <div className="flex space-x-4">
                                <button onClick={() => onStartCustomSession(config)} className="px-6 py-2 rounded-md font-semibold text-white bg-accent hover:bg-opacity-90">
                                    {t('patientCreator.startSession')}
                                </button>
                            </div>
                        )}
                    </div>

                </div>
             </div>
        </div>
    )
};

export default PatientCreatorPage;