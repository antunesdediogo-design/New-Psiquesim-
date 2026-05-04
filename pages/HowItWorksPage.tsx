import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SparklesIcon from '../components/icons/SparklesIcon';
import ClipboardDocumentCheckIcon from '../components/icons/ClipboardDocumentCheckIcon';
import LockClosedIcon from '../components/icons/LockClosedIcon';
import ChatBubbleLeftRightIcon from '../components/icons/ChatBubbleLeftRightIcon';
import AcademicCapIcon from '../components/icons/AcademicCapIcon';
import type { NavigationProps } from '../types';

const HowItWorksPage: React.FC<NavigationProps> = (navProps) => {
    const { t } = useLanguage();

    const steps = [
        { title: t('howItWorksPage.step1Title'), desc: t('howItWorksPage.step1Desc'), imageUrl: 'https://picsum.photos/seed/hiw-step1/600/400' },
        { title: t('howItWorksPage.step2Title'), desc: t('howItWorksPage.step2Desc'), imageUrl: 'https://picsum.photos/seed/hiw-step2/600/400' },
        { title: t('howItWorksPage.step3Title'), desc: t('howItWorksPage.step3Desc'), imageUrl: 'https://picsum.photos/seed/hiw-step3/600/400' },
    ];

    const features = [
        { title: t('howItWorksPage.feature1Title'), desc: t('howItWorksPage.feature1Desc'), icon: SparklesIcon },
        { title: t('howItWorksPage.feature2Title'), desc: t('howItWorksPage.feature2Desc'), icon: ClipboardDocumentCheckIcon },
        { title: t('howItWorksPage.feature3Title'), desc: t('howItWorksPage.feature3Desc'), icon: LockClosedIcon },
        { title: t('howItWorksPage.feature4Title'), desc: t('howItWorksPage.feature4Desc'), icon: ChatBubbleLeftRightIcon },
    ];
    
    const audiences = [
        { desc: t('howItWorksPage.forStudents') },
        { desc: t('howItWorksPage.forProfessionals') },
        { desc: t('howItWorksPage.forInstitutions') },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header {...navProps} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary-light/20 text-center py-20 px-6">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-dark mb-4">{t('howItWorksPage.heroTitle')}</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">{t('howItWorksPage.heroSubtitle')}</p>
                </section>

                {/* Steps Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <h3 className="text-3xl font-bold font-heading text-center text-primary-dark mb-16">{t('howItWorksPage.stepsTitle')}</h3>
                        <div className="space-y-20">
                            {steps.map((step, index) => (
                                <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="md:w-1/2">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                                                {index + 1}
                                            </div>
                                            <h4 className="text-2xl font-bold text-primary-dark ml-4">{step.title}</h4>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                                    </div>
                                    <div className="md:w-1/2">
                                        <img src={step.imageUrl} alt={step.title} className="rounded-lg shadow-xl w-full h-auto object-cover" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-primary-light/20">
                    <div className="container mx-auto px-6">
                        <h3 className="text-3xl font-bold font-heading text-center text-primary-dark mb-12">{t('howItWorksPage.featuresTitle')}</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <feature.icon className="w-12 h-12 text-accent mx-auto mb-4" />
                                    <h4 className="text-xl font-bold text-primary-dark mb-2">{feature.title}</h4>
                                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Who is it for Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 text-center max-w-4xl">
                        <h3 className="text-3xl font-bold font-heading text-primary-dark mb-12">{t('howItWorksPage.whoIsItForTitle')}</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {audiences.map((audience, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <AcademicCapIcon className="w-16 h-16 text-primary-dark mb-4" />
                                    <p className="text-gray-700 font-semibold">{audience.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary-dark text-center text-white px-6">
                    <h3 className="text-3xl font-bold font-heading mb-4">{t('howItWorksPage.ctaTitle')}</h3>
                    <button 
                        onClick={() => navProps.onNavigateToAuth('signup')}
                        className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity transform hover:scale-105"
                    >
                        {t('howItWorksPage.ctaButton')}
                    </button>
                </section>
            </main>
            <Footer {...navProps} />
        </div>
    );
};

export default HowItWorksPage;