import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckIcon from '../components/icons/CheckIcon';
import type { NavigationProps } from '../types';

const PricingPage: React.FC<NavigationProps> = (navProps) => {
    const { t } = useLanguage();

    const freeFeatures: string[] = t('pricingPage.freePlanFeatures') as any;
    const proFeatures: string[] = t('pricingPage.proPlanFeatures') as any;

    return (
        <div className="min-h-screen flex flex-col">
            <Header {...navProps} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary-light/20 text-center py-20 px-6">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-dark mb-4">{t('pricingPage.heroTitle')}</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">{t('pricingPage.heroSubtitle')}</p>
                </section>

                {/* Pricing Cards Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
                            {/* Free Trial Card */}
                            <div className="border border-gray-200 rounded-lg p-8 flex flex-col h-full">
                                <h3 className="text-2xl font-bold font-heading text-primary-dark mb-2">{t('pricingPage.freePlanTitle')}</h3>
                                <p className="text-4xl font-bold text-primary-dark mb-6">{t('pricingPage.freePlanPrice')}</p>
                                
                                <ul className="space-y-4 text-gray-600 mb-8 flex-grow">
                                    {freeFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => navProps.onNavigateToAuth('signup')}
                                    className="w-full bg-gray-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors"
                                >
                                    {t('pricingPage.freePlanCta')}
                                </button>
                            </div>

                            {/* Pro Subscription Card */}
                            <div className="border-2 border-accent rounded-lg p-8 flex flex-col h-full relative shadow-lg">
                                <div className="absolute top-0 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    {t('pricingPage.proPlanBadge')}
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-primary-dark mb-2">{t('pricingPage.proPlanTitle')}</h3>
                                <p className="text-4xl font-bold text-primary-dark mb-6">{t('pricingPage.proPlanPrice')}</p>
                                
                                <ul className="space-y-4 text-gray-600 mb-8 flex-grow">
                                    {proFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-1" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => navProps.onNavigateToAuth('signup')}
                                    className="w-full bg-accent text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-opacity"
                                >
                                    {t('pricingPage.proPlanCta')}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer {...navProps} />
        </div>
    );
};

export default PricingPage;