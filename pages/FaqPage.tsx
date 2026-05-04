import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PlusIcon from '../components/icons/PlusIcon';
import MinusIcon from '../components/icons/MinusIcon';
import MailIcon from '../components/icons/MailIcon';
import type { NavigationProps } from '../types';

interface FaqItem {
    q: string;
    a: string;
}

interface FaqCategory {
    title: string;
    items: FaqItem[];
}

const FaqAccordionItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-5 px-6 hover:bg-gray-50 focus:outline-none"
                aria-expanded={isOpen}
            >
                <h4 className="text-lg font-semibold text-primary-dark">{question}</h4>
                {isOpen ? <MinusIcon className="w-6 h-6 text-accent" /> : <PlusIcon className="w-6 h-6 text-primary-dark" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
}

const FaqPage: React.FC<NavigationProps> = (navProps) => {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData: FaqCategory[] = [
        {
            title: t('faqPage.categoryGeneral'),
            items: [
                { q: t('faqPage.q1_general'), a: t('faqPage.a1_general') },
                { q: t('faqPage.q2_general'), a: t('faqPage.a2_general') },
                { q: t('faqPage.q3_general'), a: t('faqPage.a3_general') },
                { q: t('faqPage.q4_general'), a: t('faqPage.a4_general') },
            ]
        },
        {
            title: t('faqPage.categoryIndividuals'),
            items: [
                { q: t('faqPage.q1_individuals'), a: t('faqPage.a1_individuals') },
                { q: t('faqPage.q2_individuals'), a: t('faqPage.a2_individuals') },
            ]
        },
        {
            title: t('faqPage.categoryInstitutions'),
            items: [
                { q: t('faqPage.q1_institutions'), a: t('faqPage.a1_institutions') },
                { q: t('faqPage.q2_institutions'), a: t('faqPage.a2_institutions') },
            ]
        },
        {
            title: t('faqPage.categoryTechnical'),
            items: [
                { q: t('faqPage.q1_technical'), a: t('faqPage.a1_technical') },
                { q: t('faqPage.q2_technical'), a: t('faqPage.a2_technical') },
            ]
        },
        {
            title: t('faqPage.categoryPricing'),
            items: [
                { q: t('faqPage.q1_pricing'), a: t('faqPage.a1_pricing') },
                { q: t('faqPage.q2_pricing'), a: t('faqPage.a2_pricing') },
                { q: t('faqPage.q3_pricing'), a: t('faqPage.a3_pricing') },
            ]
        }
    ];

    let questionCounter = 0;

    return (
        <div className="min-h-screen flex flex-col">
            <Header {...navProps} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary-light/20 text-center py-20 px-6">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-dark mb-4">{t('faqPage.heroTitle')}</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">{t('faqPage.heroSubtitle')}</p>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        {faqData.map((category, catIndex) => (
                            <div key={catIndex} className="mb-12">
                                <h3 className="text-2xl font-bold font-heading text-primary-dark mb-6">{category.title}</h3>
                                <div className="border border-gray-200 rounded-lg shadow-sm">
                                    {category.items.map((item) => {
                                        const currentIndex = questionCounter;
                                        questionCounter++;
                                        return (
                                            <FaqAccordionItem
                                                key={currentIndex}
                                                question={item.q}
                                                answer={item.a}
                                                isOpen={openIndex === currentIndex}
                                                onClick={() => handleToggle(currentIndex)}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-20 bg-primary-light/20 text-center px-6">
                     <div className="container mx-auto max-w-3xl">
                        <h3 className="text-3xl font-bold font-heading text-primary-dark mb-3">{t('faqPage.ctaTitle')}</h3>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">{t('faqPage.ctaSubtitle')}</p>
                         <button 
                            onClick={() => { /* Navigate to a contact page or modal */ }}
                            className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity inline-flex items-center space-x-2"
                        >
                             <MailIcon className="w-5 h-5"/>
                             <span>{t('faqPage.ctaButton')}</span>
                        </button>
                    </div>
                </section>
            </main>
            <Footer {...navProps} />
        </div>
    );
};

export default FaqPage;