import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AboutUs = () => {
    const teamMembers = [
        {
            id: 1,
            name: "NIKHIL",
    
            image: "https://via.placeholder.com/150"
        },
        {
            id: 2,
            name: "ABHINAV",
       
            image: "https://via.placeholder.com/150"
        },
        {
            id: 3,
            name: "VENKATESH",
       
            image: "https://via.placeholder.com/150"
        },
        {
            id: 4,
            name: "BHANU PRAKASH",
         
            image: "https://via.placeholder.com/150"
        },
        {
            id: 5,
            name: "VIVEK",
          
            image: "https://via.placeholder.com/150"
        }
    ];

    const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

    const handleImageError = (e) => {
        e.target.src = fallbackImage;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <section className="py-20 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-blue-600 mb-6 uppercase tracking-wide animate-fade-in">
                        About Smart Exchange
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl text-center text-gray-600 max-w-4xl mx-auto mb-16 animate-slide-up">
                        At Smart Exchange, we believe in giving tech a second life. We're passionate about 
                        refurbishing devices to deliver high-quality, affordable solutions while reducing e-waste.
                    </p>
                    
                    {/* Content Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
                        {/* Our Journey */}
                        <div className="bg-gradient-to-br from-white to-blue-50 p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4 relative pb-3">
                                Our Journey
                                <span className="absolute bottom-0 left-0 w-12 h-1 bg-green-500 rounded-full"></span>
                            </h2>
                            <p className="text-gray-600 text-base lg:text-lg">
                                Launched in 2021, Smart Exchange began with a vision to make premium technology 
                                accessible to everyone. We've since refurbished thousands of devices, blending 
                                innovation with sustainability.
                            </p>
                        </div>
                        
                        {/* Our Mission */}
                        <div className="bg-gradient-to-br from-white to-blue-50 p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4 relative pb-3">
                                Our Mission
                                <span className="absolute bottom-0 left-0 w-12 h-1 bg-green-500 rounded-full"></span>
                            </h2>
                            <p className="text-gray-600 text-base lg:text-lg">
                                We're here to provide top-tier refurbished smartphones, laptops, and gadgets 
                                that rival new ones in performance—all while championing a greener planet. 
                                Trust, quality, and eco-friendliness drive everything we do.
                            </p>
                        </div>
                        
                        {/* Our Vision */}
                        <div className="bg-gradient-to-br from-white to-blue-50 p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-4 relative pb-3">
                                Our Vision
                                <span className="absolute bottom-0 left-0 w-12 h-1 bg-green-500 rounded-full"></span>
                            </h2>
                            <p className="text-gray-600 text-base lg:text-lg">
                                We aim to lead the refurbished tech industry by setting new standards in quality 
                                and sustainability, ensuring every device we touch contributes to a circular 
                                economy and a brighter future.
                            </p>
                        </div>
                    </div>
                    
                    {/* Team Section */}
                    <div className="text-center px-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-blue-600 mb-12">
                            Our Team
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
                            {teamMembers.map((member) => (
                                <div 
                                    key={member.id}
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3"
                                >
                                    <img 
                                        src={member.image}
                                        alt={member.name}
                                        onError={handleImageError}
                                        className="w-28 h-28 lg:w-32 lg:h-32 rounded-full mx-auto mb-6 border-4 border-green-500 object-cover"
                                    />
                                    <h3 className="text-xl lg:text-2xl font-bold text-blue-600 mb-2 truncate">
                                        {member.name}
                                    </h3>
                                    <p className="text-gray-500 text-base lg:text-lg">
                                        {member.role}
                                    </p>
                                    
                                </div>
                            ))}
                        </div>
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

export default AboutUs;