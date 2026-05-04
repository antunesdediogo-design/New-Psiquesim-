import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationProps } from '../types';

interface PolicySectionProps {
  title: string;
  content: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, content }) => (
  <section className="mb-8">
    <h3 className="text-2xl font-bold font-heading text-primary-dark mb-4">{title}</h3>
    <div className="text-gray-700 leading-relaxed space-y-4">
      {content.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  </section>
);

const PrivacyPolicyPage: React.FC<NavigationProps> = (navProps) => {
    const { t } = useLanguage();

    const sections = [
        { title: t('privacyPolicyPage.introTitle'), content: t('privacyPolicyPage.introContent') },
        { title: t('privacyPolicyPage.infoCollectionTitle'), content: t('privacyPolicyPage.infoCollectionContent') },
        { title: t('privacyPolicyPage.useInfoTitle'), content: t('privacyPolicyPage.useInfoContent') },
        { title: t('privacyPolicyPage.securityTitle'), content: t('privacyPolicyPage.securityContent') },
        { title: t('privacyPolicyPage.rightsTitle'), content: t('privacyPolicyPage.rightsContent') },
        { title: t('privacyPolicyPage.changesTitle'), content: t('privacyPolicyPage.changesContent') },
        { title: t('privacyPolicyPage.contactTitle'), content: t('privacyPolicyPage.contactContent') },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header {...navProps} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary-light/20 py-16">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-dark mb-2">{t('privacyPolicyPage.heroTitle')}</h2>
                        <p className="text-md text-gray-600">{t('privacyPolicyPage.lastUpdated')}</p>
                    </div>
                </section>

                {/* Policy Content Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                       {sections.map(section => (
                           <PolicySection key={section.title} title={section.title} content={section.content} />
                       ))}
                    </div>
                </section>
            </main>
            <Footer {...navProps} />
        </div>
    );
};

export default PrivacyPolicyPage;