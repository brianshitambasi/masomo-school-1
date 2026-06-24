import React from 'react'
import '../css/home.css'
import { Link } from 'react-router-dom'

const HomeComponent = () => {
  return (
    <div className='homepage'>
        {/* Navbar */}
        <nav className='navbar navbar-expand-lg navbar-dark bg-success'>
            <div className='container'>
                <Link className='navbar-brand' to={'/'}>
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    Masomo School
                </Link>
                <button 
                    className='navbar-toggler' 
                    type='button' 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className='navbar-toggler-icon'></span>
                </button>

                <div className='collapse navbar-collapse justify-content-end' id='navbarNav'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'> 
                            <a className='nav-link' href="#about">About</a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href="#cbc">CBC Curriculum</a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href="#why-masomo">Why Us</a>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link btn btn-outline-light btn-sm px-3' to={'/login'}>
                                <i className="bi bi-box-arrow-in-right me-1"></i>
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <section className='hero'>
            <div className='hero-image-wrapper'>
                <img 
                    src="/images/banner.jpg" 
                    alt="School banner" 
                    className='hero-image' 
                />
                <div className='hero-text'>
                    <h1>Empowering Minds Through Competence</h1>
                    <p>Welcome to Masomo School - Nurturing Future Leaders in Kenya</p>
                    <a href="#cbc" className='btn-primary'>
                        <i className="bi bi-book me-2"></i>
                        Learn More About CBC
                    </a>
                </div>
            </div>
        </section>

        {/* About Section */}
        <section id='about' className='section bg-light'>
            <div className='container'>
                <h2 className='text-success'>
                    <i className="bi bi-info-circle me-2"></i>
                    About Masomo School
                </h2>
                <p className="lead">Masomo School is a leading institution dedicated to providing quality education rooted in the Competency-Based Curriculum (CBC) as set by the Kenyan Ministry of Education.</p>
                <p>We focus on holistic development, creativity, and real-world skills for tomorrow's leaders.</p>
                <div className="mt-3">
                    <span className="badge bg-success me-2">Quality Education</span>
                    <span className="badge bg-primary me-2">CBC Certified</span>
                    <span className="badge bg-warning text-dark">Holistic Development</span>
                </div>
            </div>
        </section>

        {/* CBC Section */}
        <section id='cbc' className='section'>
            <div className='container'>
                <h2 className='text-success'>
                    <i className="bi bi-book me-2"></i>
                    Understanding CBC in Kenya
                </h2>
                <p className="lead">The CBC was introduced in Kenya to replace the 8-4-4 system. It focuses on nurturing learners' talents and abilities through practical skill-oriented learning experiences.</p>
                <p>CBC emphasizes learner-centered teaching and aims at developing competencies that align with national development goals.</p>
                <ul className='cbc-benefits mt-3'>
                    <li>Focus on Skills & Talents</li>
                    <li>Learner-Centered Approach</li>
                    <li>Real-life Problem Solving</li>
                    <li>Continuous Assessment</li>
                </ul>
            </div>
        </section>

        {/* Why Us Section */}
        <section id='why-masomo' className='section bg-light'>
            <div className='container'>
                <h2 className='text-success text-center mb-4'>
                    <i className="bi bi-star me-2"></i>
                    Why Choose Masomo School
                </h2>
                <div className='features'>
                    <div className='feature-card'>
                        <h3>Experienced Teachers</h3>
                        <p>Our educators are trained in CBC and committed to student growth and success.</p>
                    </div>
                    <div className='feature-card'>
                        <h3>Modern Facilities</h3>
                        <p>We provide state-of-the-art labs, libraries, and innovative learning spaces.</p>
                    </div>
                    <div className='feature-card'>
                        <h3>Co-Curricular Activities</h3>
                        <p>Students explore sports, arts, technology, and leadership beyond books.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Contact/CTA Section */}
        <section id='contact' className='section text-center' style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', color: 'white' }}>
            <div className="container">
                <h2>
                    <i className="bi bi-mortarboard me-2"></i>
                    Join Masomo School Today
                </h2>
                <p className="lead">Enroll your child in a school that builds future-ready citizens</p>
                <a href="#" className='btn-primary' style={{ background: 'white', color: '#28a745', fontWeight: 'bold' }}>
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Apply Now
                </a>
            </div>
        </section>

        {/* Footer */}
        <footer className='footer'>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Masomo School. All Rights Reserved.</p>
            </div>
        </footer>
    </div>
  )
}

export default HomeComponent