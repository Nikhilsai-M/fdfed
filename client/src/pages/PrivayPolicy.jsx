import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PrivacyPolicy = () => {
    const policySections = [
        {
            id: 1,
            title: "Information We Collect",
            content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information."
        },
        {
            id: 2,
            title: "How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers."
        },
        {
            id: 3,
            title: "Information Sharing",
            content: "We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential."
        },
        {
            id: 4,
            title: "Data Security",
            content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure."
        },
        {
            id: 5,
            title: "Your Rights",
            content: "You have the right to access, correct, or delete your personal information. You may also object to our processing of your personal information, ask us to restrict processing of your personal information, or request portability of your personal information."
        },
        {
            id: 6,
            title: "Cookies and Tracking",
            content: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier."
        },
        {
            id: 7,
            title: "Third-Party Links",
            content: "Our service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit."
        },
        {
            id: 8,
            title: "Children's Privacy",
            content: "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information."
        },
        {
            id: 9,
            title: "Changes to This Policy",
            content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'effective date' at the top of this Privacy Policy."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <section className="py-20 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-blue-600 mb-6 uppercase tracking-wide animate-fade-in">
                        Privacy Policy
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl text-center text-gray-600 max-w-4xl mx-auto mb-16 animate-slide-up">
                        Last updated: November 2025. At Smart Exchange, we are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>
                    
                    {/* Introduction */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-6">Our Commitment to Your Privacy</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Smart Exchange ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                        </p>
                    </div>

                    {/* Policy Sections Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {policySections.map((section) => (
                            <div 
                                key={section.id}
                                className="bg-gradient-to-br from-white to-blue-50 p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                            >
                                <h2 className="text-xl lg:text-2xl font-bold text-blue-600 mb-4 relative pb-3 group-hover:text-blue-700 transition-colors duration-300">
                                    {section.title}
                                    <span className="absolute bottom-0 left-0 w-8 h-1 bg-green-500 rounded-full group-hover:w-12 transition-all duration-300"></span>
                                </h2>
                                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Information */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-6">Contact Us</h2>
                        <p className="text-gray-600 text-lg mb-6">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
                            <div>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Email:</span>{' '}
                                    <a href="mailto:privacy@smartexchange.com" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors duration-200">
                                        privacy@smartexchange.com
                                    </a>
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Phone:</span>{' '}
                                    <a href="tel:+916304630478" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors duration-200">
                                        +91 6304630478
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Legal Compliance Note */}
                    <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                        <h3 className="text-lg font-bold text-yellow-800 mb-2">Legal Compliance</h3>
                        <p className="text-yellow-700">
                            This Privacy Policy is designed to help you understand how we collect, use, and safeguard the information you provide to us and to assist you in making informed decisions when using our Service.
                        </p>
                    </div>
                </div>
            </section>
            
            <Footer />
            
            {/* Custom animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 1s ease-in;
                }
                .animate-slide-up {
                    animation: slideUp 1s ease-out;
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;