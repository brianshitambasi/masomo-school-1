import React from 'react'
import '../css/home.css'
import { Link } from 'react-router-dom'

const HomeComponent = () => {
  return (
    <div className='homepage'>
        {/* Navbar */}
        <nav className='navbar navbar-expand-lg navbar-dark bg-success sticky-top'>
            <div className='container'>
                <Link className='navbar-brand fw-bold' to={'/'}>
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
        <section className='hero position-relative text-white'>
            <img 
                src="/images/banner.jpg" 
                alt="School banner" 
                className='w-100 img-fluid' 
                style={{maxHeight: '500px', objectFit: 'cover', width: '100%'}} 
            />
            <div className='hero-text position-absolute top-50 start-50 translate-middle text-center bg-dark bg-opacity-50 p-4 rounded'>
                <h1 className="display-4 fw-bold">Empowering Minds Through Competence</h1>
                <p className="lead">Welcome to Masomo School - Nurturing Future Leaders in Kenya</p>
                <a href="#cbc" className='btn btn-light btn-lg'>
                    <i className="bi bi-book me-2"></i>
                    Learn More About CBC
                </a>
            </div>
        </section>

        {/* About Section */}
        <section id='about' className='py-5 bg-light'>
            <div className='container'>
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <h2 className='text-success fw-bold'>
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
                    <div className="col-lg-6">
                        <img 
                            src="/images/about.jpg" 
                            alt="About Masomo School" 
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* CBC Section */}
        <section id='cbc' className='py-5'>
            <div className='container'>
                <h2 className='text-success fw-bold text-center mb-4'>
                    <i className="bi bi-book me-2"></i>
                    Understanding CBC in Kenya
                </h2>
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <p className="lead text-center">The CBC was introduced in Kenya to replace the 8-4-4 system. It focuses on nurturing learners' talents and abilities through practical skill-oriented learning experiences.</p>
                        <p className="text-center">CBC emphasizes learner-centered teaching and aims at developing competencies that align with national development goals.</p>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className="col-md-3">
                        <div className="card h-100 text-center border-success">
                            <div className="card-body">
                                <i className="bi bi-star-fill text-success display-4"></i>
                                <h5 className="card-title mt-2">Focus on Skills</h5>
                                <p className="card-text small">Developing talents & abilities</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card h-100 text-center border-primary">
                            <div className="card-body">
                                <i className="bi bi-person-arms-up text-primary display-4"></i>
                                <h5 className="card-title mt-2">Learner-Centered</h5>
                                <p className="card-text small">Student-focused approach</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card h-100 text-center border-warning">
                            <div className="card-body">
                                <i className="bi bi-lightbulb text-warning display-4"></i>
                                <h5 className="card-title mt-2">Real-Life Skills</h5>
                                <p className="card-text small">Practical problem solving</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card h-100 text-center border-info">
                            <div className="card-body">
                                <i className="bi bi-clipboard-check text-info display-4"></i>
                                <h5 className="card-title mt-2">Continuous Assessment</h5>
                                <p className="card-text small">Ongoing evaluation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Why Us Section */}
        <section id='why-masomo' className='py-5 bg-light'>
            <div className='container'>
                <h2 className='text-success text-center mb-4 fw-bold'>
                    <i className="bi bi-star me-2"></i>
                    Why Choose Masomo School
                </h2>
                <p className="text-center text-muted mb-5">We provide an environment where every child can thrive and excel</p>
                <div className='row g-4'>
                    <div className='col-md-4'>
                        <div className='card h-100 shadow-sm border-0 hover-card'>
                            <div className='card-body text-center p-4'>
                                <div className="mb-3">
                                    <i className="bi bi-person-badge text-success" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h4 className="card-title text-success">Experienced Teachers</h4>
                                <p className="card-text">Our educators are trained in CBC and committed to student growth and success.</p>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className='card h-100 shadow-sm border-0 hover-card'>
                            <div className='card-body text-center p-4'>
                                <div className="mb-3">
                                    <i className="bi bi-building text-primary" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h4 className="card-title text-primary">Modern Facilities</h4>
                                <p className="card-text">We provide state-of-the-art labs, libraries, and innovative learning spaces.</p>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className='card h-100 shadow-sm border-0 hover-card'>
                            <div className='card-body text-center p-4'>
                                <div className="mb-3">
                                    <i className="bi bi-trophy text-warning" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h4 className="card-title text-warning">Co-Curricular Activities</h4>
                                <p className="card-text">Students explore sports, arts, technology, and leadership beyond books.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Contact/CTA Section */}
        <section id='contact' className='py-5 text-center' style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
            <div className="container">
                <h2 className='text-white fw-bold'>
                    <i className="bi bi-mortarboard me-2"></i>
                    Join Masomo School Today
                </h2>
                <p className="text-white lead">Enroll your child in a school that builds future-ready citizens</p>
                <button className='btn btn-light btn-lg mt-3' type="button">
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Apply Now
                </button>
            </div>
        </section>

        {/* Footer */}
        <footer className='bg-dark text-light text-center py-4'>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5 className="text-success">Masomo School</h5>
                        <p className="small">Nurturing Future Leaders</p>
                    </div>
                    <div className="col-md-4">
                        <h5 className="text-success">Quick Links</h5>
                        <ul className="list-unstyled small">
                            <li><a href="#about" className="text-light text-decoration-none">About</a></li>
                            <li><a href="#cbc" className="text-light text-decoration-none">CBC Curriculum</a></li>
                            <li><a href="#why-masomo" className="text-light text-decoration-none">Why Us</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="text-success">Contact</h5>
                        <p className="small mb-0">
                            <i className="bi bi-envelope me-2"></i>
                            info@masomoschool.com
                        </p>
                        <p className="small">
                            <i className="bi bi-telephone me-2"></i>
                            +254 700 123 456
                        </p>
                    </div>
                </div>
                <hr className="border-light opacity-25" />
                <p className='mb-0 small'>&copy; {new Date().getFullYear()} Masomo School. All Rights Reserved.</p>
            </div>
        </footer>
    </div>
  )
}

export default HomeComponent
