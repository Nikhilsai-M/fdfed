import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Blog = () => {
    const blogPosts = [
        {
            id: 1,
            title: "Latest Tech Trends",
            content: "In 2025, the tech world is buzzing with AI advancements and eco-friendly gadgets. Smart Exchange is at the forefront, integrating these innovations into our refurbished devices. From smarter processors to sustainable materials, we're excited to see how these trends enhance performance and reduce environmental impact."
        },
        {
            id: 2,
            title: "Sustainability Tips",
            content: "Reducing e-waste starts with small actions. Extend your device's life by repairing instead of replacing, recycling old tech responsibly, and choosing refurbished options like those from Smart Exchange. These steps cut down landfill waste and conserve resources, making a real difference for the planet."
        },
        {
            id: 3,
            title: "Refurbished vs. New",
            content: "Refurbished devices from Smart Exchange offer near-new performance at a fraction of the cost. Unlike brand-new gadgets, they're rigorously tested, often come with warranties, and help reduce e-waste. While new devices have the latest specs, refurbished ones provide unbeatable value and sustainability without compromise."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <section className="py-20 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-blue-600 mb-6 uppercase tracking-wide animate-fade-in">
                        Smart Exchange Blog
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl text-center text-gray-600 max-w-4xl mx-auto mb-16 animate-slide-up">
                        Stay updated with the latest insights, tips, and news from Smart Exchange. 
                        Explore our thoughts on refurbished tech, sustainability, and more.
                    </p>
                    
                    {/* Blog Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {blogPosts.map((post) => (
                            <div 
                                key={post.id}
                                className="bg-gradient-to-br from-white to-blue-50 p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                            >
                                <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4 relative pb-3 group-hover:text-blue-700 transition-colors duration-300">
                                    {post.title}
                                    <span className="absolute bottom-0 left-0 w-12 h-1 bg-green-500 rounded-full group-hover:w-16 transition-all duration-300"></span>
                                </h2>
                                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                                    {post.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Additional Content Section */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-8">
                            More Coming Soon!
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            We're constantly working on new content to help you make informed decisions 
                            about your tech needs. Check back regularly for updates on industry trends, 
                            maintenance tips, and sustainability practices.
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

export default Blog;