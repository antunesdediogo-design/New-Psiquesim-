import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UsersIcon from '../components/icons/UsersIcon';
import ClipboardListIcon from '../components/icons/ClipboardListIcon';
import PresentationChartLineIcon from '../components/icons/PresentationChartLineIcon';
import type { NavigationProps } from '../types';

const ForInstitutionsPage: React.FC<NavigationProps> = (navProps) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col">
            <Header {...navProps} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary-light/20 text-center py-20 px-6">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-dark mb-4">{t('forInstitutionsPage.heroTitle')}</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">{t('forInstitutionsPage.heroSubtitle')}</p>
                    <button 
                        onClick={() => { /* This would likely open a contact form or demo request modal */ }}
                        className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity transform hover:scale-105"
                    >
                        {t('forInstitutionsPage.heroCta')}
                    </button>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <h3 className="text-3xl font-bold font-heading text-center text-primary-dark mb-12">{t('forInstitutionsPage.featuresTitle')}</h3>
                        <div className="grid md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">
                            <div className="flex flex-col items-center p-6">
                                <UsersIcon className="w-16 h-16 text-accent mb-4"/>
                                <h4 className="text-xl font-bold text-primary-dark mb-2">{t('forInstitutionsPage.feature1Title')}</h4>
                                <p className="text-gray-600">{t('forInstitutionsPage.feature1Desc')}</p>
                            </div>
                            <div className="flex flex-col items-center p-6">
                                <ClipboardListIcon className="w-16 h-16 text-accent mb-4"/>
                                <h4 className="text-xl font-bold text-primary-dark mb-2">{t('forInstitutionsPage.feature2Title')}</h4>
                                <p className="text-gray-600">{t('forInstitutionsPage.feature2Desc')}</p>
                            </div>
                            <div className="flex flex-col items-center p-6">
                                <PresentationChartLineIcon className="w-16 h-16 text-accent mb-4"/>
                                <h4 className="text-xl font-bold text-primary-dark mb-2">{t('forInstitutionsPage.feature3Title')}</h4>
                                <p className="text-gray-600">{t('forInstitutionsPage.feature3Desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Testimonial Section */}
                <section className="bg-primary-light/20 py-20 px-6">
                     <div className="container mx-auto max-w-3xl text-center">
                        <img src="https://picsum.photos/seed/carlos-valenzuela/100/100" alt="Dr. Carlos Valenzuela" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"/>
                        <p className="text-xl italic text-primary-dark mb-4">
                           {t('forInstitutionsPage.testimonialText')}
                        </p>
                        <p className="font-semibold text-gray-700">{t('forInstitutionsPage.testimonialAuthor')}</p>
                     </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-white text-center px-6">
                    <h3 className="text-3xl font-bold font-heading text-primary-dark mb-4">{t('forInstitutionsPage.ctaTitle')}</h3>
                    <button 
                        onClick={() => { /* Navigate to a contact page or modal */ }}
                        className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity"
                    >
                         {t('forInstitutionsPage.ctaButton')}
                    </button>
                </section>
            </main>
            <Footer {...navProps} />
        </div>
    );
};

export default ForInstitutionsPage;