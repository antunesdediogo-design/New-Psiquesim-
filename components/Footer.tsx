import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { NavigationProps } from '../types';
import LinkedinIcon from './icons/LinkedinIcon';
import TwitterIcon from './icons/TwitterIcon';
import InstagramIcon from './icons/InstagramIcon';

const Footer: React.FC<NavigationProps> = ({ onNavigateHome, onNavigateToForIndividuals, onNavigateToForInstitutions, onNavigateToPricing, onNavigateToFaq, onNavigateToHowItWorks, onNavigateToPrivacyPolicy, onNavigateToTermsOfService }) => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    const footerLinkClass = "hover:text-white transition-colors duration-200";

    return (
        <footer className="bg-primary-dark text-primary-light">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold font-heading text-white">PsiqueSim</h3>
                        <p className="mt-2 text-sm">{t('footer.tagline')}</p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">{t('footer.navigate')}</h4>
                        <ul className="mt-4 space-y-2">
                            <li><button onClick={onNavigateToHowItWorks} className={footerLinkClass}>{t('header.howItWorks')}</button></li>
                            <li><button onClick={onNavigateToForIndividuals} className={footerLinkClass}>{t('header.forIndividuals')}</button></li>
                            <li><button onClick={onNavigateToForInstitutions} className={footerLinkClass}>{t('header.forInstitutions')}</button></li>
                            <li><button onClick={onNavigateToPricing} className={footerLinkClass}>{t('header.pricing')}</button></li>
                            <li><button onClick={onNavigateToFaq} className={footerLinkClass}>{t('header.faq')}</button></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">{t('footer.legal')}</h4>
                        <ul className="mt-4 space-y-2">
                            <li><button onClick={onNavigateToPrivacyPolicy} className={footerLinkClass}>{t('footer.privacy')}</button></li>
                            <li><button onClick={onNavigateToTermsOfService} className={footerLinkClass}>{t('footer.terms')}</button></li>
                        </ul>
                    </div>
                    
                    {/* Social Media */}
                    <div>
                        <h4 className="font-semibold text-white tracking-wider uppercase">{t('footer.follow')}</h4>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" aria-label="LinkedIn" className="text-primary-light hover:text-white transition-colors"><LinkedinIcon className="w-6 h-6" /></a>
                            <a href="#" aria-label="Twitter" className="text-primary-light hover:text-white transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                            <a href="#" aria-label="Instagram" className="text-primary-light hover:text-white transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
                    <p>{t('footer.copyright').replace('{year}', currentYear.toString())}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;