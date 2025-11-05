import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const TermsAndConditions = () => {
    const termsSections = [
        {
            id: 1,
            title: "Acceptance of Terms",
            content: "By accessing and using Smart Exchange's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this site."
        },
        {
            id: 2,
            title: "Use License",
            content: "Permission is granted to temporarily access the materials on Smart Exchange's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
        },
        {
            id: 3,
            title: "Account Registration",
            content: "You may be required to register with our site and create an account. You must provide accurate and complete information and keep your account information updated. You are responsible for the security of your account and password."
        },
        {
            id: 4,
            title: "Product Information",
            content: "We strive to display as accurately as possible the colors, features, specifications, and details of the products available on our site. However, we do not guarantee that the product descriptions or other content is accurate, complete, or error-free."
        },
        {
            id: 5,
            title: "Pricing and Payment",
            content: "All prices are shown in Indian Rupees (₹) and are subject to change without notice. We reserve the right to modify or discontinue any service without notice. We shall not be liable to you or any third-party for any modification, price change, or discontinuance of service."
        },
        {
            id: 6,
            title: "Returns and Refunds",
            content: "We accept returns within 7 days of delivery for eligible items in original condition. Refurbished devices come with a 30-day warranty. Refunds will be processed to the original payment method within 5-7 business days after we receive the returned item."
        },
        {
            id: 7,
            title: "Warranty Information",
            content: "All refurbished products come with a 30-day warranty covering manufacturing defects. This warranty does not cover damage caused by accidents, misuse, or unauthorized modifications. Original accessories may vary from those shown in product images."
        },
        {
            id: 8,
            title: "Intellectual Property",
            content: "All content included on this site, such as text, graphics, logos, images, and software, is the property of Smart Exchange or its content suppliers and protected by international copyright laws."
        },
        {
            id: 9,
            title: "User Conduct",
            content: "You agree not to use the site for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the site in any way that could damage the site or general business of Smart Exchange."
        },
        {
            id: 10,
            title: "Limitation of Liability",
            content: "Smart Exchange shall not be held liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
        },
        {
            id: 11,
            title: "Governing Law",
            content: "These terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad."
        },
        {
            id: 12,
            title: "Changes to Terms",
            content: "We reserve the right, at our sole discretion, to modify or replace these terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <section className="py-20 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-blue-600 mb-6 uppercase tracking-wide">
                        Terms & Conditions
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl text-center text-gray-600 max-w-4xl mx-auto mb-16">
                        Last updated: november 2025. Please read these terms and conditions carefully before using our website and services.
                    </p>
                    
                    {/* Introduction */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-6">Welcome to Smart Exchange</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4">
                            These Terms and Conditions govern your use of Smart Exchange's website and services. By accessing or using our services, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access our services.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Smart Exchange ("we," "our," or "us") operates the website and provides refurbished electronic devices and related services to customers across India.
                        </p>
                    </div>

                    {/* Terms Sections Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {termsSections.map((section) => (
                            <div 
                                key={section.id}
                                className="bg-gradient-to-br from-white to-blue-50 p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                            >
                                <h2 className="text-xl lg:text-2xl font-bold text-blue-600 mb-4 relative pb-3 group-hover:text-blue-700 transition-colors duration-300">
                                    {section.id}. {section.title}
                                    <span className="absolute bottom-0 left-0 w-8 h-1 bg-green-500 rounded-full group-hover:w-12 transition-all duration-300"></span>
                                </h2>
                                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Important Notices */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Important Disclaimer</h3>
                            <p className="text-red-700">
                                Our refurbished devices are thoroughly tested and certified. However, they may show minor signs of previous use. All devices are fully functional and come with our quality guarantee.
                            </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-blue-800 mb-4">ℹ️ Service Information</h3>
                            <p className="text-blue-700">
                                We provide support for all our products. For technical assistance, warranty claims, or service inquiries, please contact our support team within the specified warranty period.
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-6">Questions About Our Terms?</h2>
                        <p className="text-gray-600 text-lg mb-6">
                            If you have any questions about these Terms and Conditions, please contact us:
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
                            <div>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Email:</span>{' '}
                                    <a href="mailto:legal@smartexchange.com" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors duration-200">
                                        legal@smartexchange.com
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

                    
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default TermsAndConditions;