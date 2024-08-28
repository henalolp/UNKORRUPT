import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaChevronDown, FaChevronUp, FaBars, FaTimes } from "react-icons/fa"; // Import necessary icons
import { useNavigate } from "react-router-dom";
import "./home.css";
import { IoSunnyOutline } from "react-icons/io5";

export default function HomePage() {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu toggle
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLoginClick = () => {
        navigate('/auth'); // Redirect to the authentication page
    };

    const [faqOpen, setFaqOpen] = useState([false, false, false, false]);

    const toggleFaq = (index) => {
        const newFaqOpen = faqOpen.map((item, i) => (i === index ? !item : false));
        setFaqOpen(newFaqOpen);
    };

    return (
        <div className="hbody">
            <div className={`container ${darkMode ? "dark-mode" : ""}`}>
                <header className="header">
                    <div className="logo">
                        <img src="/patriot.png" alt="PatriotAi Logo" />
                        <span className="patriot-ai">PatriotAi</span>
                    </div>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes size={24} color="#A020F0" /> : <FaBars size={24} color="#A020F0" />} {/* Toggle between hamburger and close icon */}
                    </button>
                    <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
                        <a href="#">Product</a>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">Company</a>
                        <a href="#">Blog</a>
                    </nav>
                    <button className="btn-primary" onClick={handleLoginClick}>
                        Log in with Internet
                    </button>
                    <div className="theme-toggle" onClick={toggleDarkMode}>
                        {darkMode ? (
                            <IoSunnyOutline size={24} color="#FFD700" />
                        ) : (
                            <FaMoon size={24} color="#4B0082" />
                        )}
                    </div>
                </header>

                <section className="hero">
                    <div className="hero-content">
                        <h1>AI-driven learning and corruption fighting</h1>
                        <p>
                            PatriotAi is a decentralized platform leveraging on UN resources on
                            corruption, ICP blockchain and AI to educate on corruption and
                            collect data on corruption.
                        </p>
                        <div className="hero-actions">
                            <a href="#" className="btn-secondary">
                                See Courses
                            </a>
                            <a href="https://github.com" className="btn-link">
                                View on Github
                            </a>
                        </div>
                    </div>
                    <img src="/vr.png" alt="Hero" className="hero-image" />
                </section>

                <div className="partners">
                    <img src="/un.png" alt="" />
                    <img src="/ic.png" alt="" />
                </div>

                <section className="section-title">
                    <div className="benefits1">
                        <h2>PATRIOT AI  BENEFITS</h2>
                        <h3>Why PatriotAi?</h3>
                        <p>
                            PatriotAi is a free learning platform where you get to learn about
                            corruption. We offer a variety of courses where you can interact with
                            AI to ask any questions.
                        </p>
                    </div>
                    <div className="benefits">
                        <img src="/roboto.png" alt="Hero" className="hero-image" />
                        <div>
                            <h3>We help you make a difference</h3>
                            <ul>
                                <li>
                                    {/* <img src="/gunicon.png" alt="" /> */}
                                    <strong>Understand corruption</strong>
                                    <p>
                                        The platform helps you answer all your questions about
                                        corruption and get rewards for it!
                                    </p>
                                </li>
                                <li>
                                    <img src="" alt="" />
                                    <strong>Learn how to fight corruption</strong>
                                    <p>To overcome it, you have to understand it.</p>
                                </li>
                                <li>
                                    <img src="" alt="" />
                                    <strong>Fight corruption</strong>
                                    <p>Participate in our programs and help combat corruption.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="testimonials">
                    <h2>Testimonials</h2>
                    <div className="testimonials-container">
                        <div className="testimonial">
                            <img src="/user1.jpg" alt="user" />
                            <p>"I got to <span className="highlight">share</span> my story and I got a response asking if I want to share more details."</p>
                            <strong>Sarah</strong>
                            <span>UAE</span>
                        </div>
                        <div className="testimonial">
                            <img src="/user1.jpg" alt="user" />
                            <p>"PatriotAi has come in handy in my <span className="highlight">understanding</span> of corruption and how to identify it."</p>
                            <strong>Daniel</strong>
                            <span>Kenya</span>
                        </div>
                        <div className="testimonial">
                            <img src="/user1.jpg" alt="user" />
                            <p>"I can't wait to collect more <span className="highlight">tokens</span> in my next course. This is so much fun."</p>
                            <strong>Khamla</strong>
                            <span>South Africa</span>
                        </div>
                    </div>
                </section>

                <section className="faq">
                    <h2>FAQ</h2>
                    <p>Answer your customers possible questions here, it will increase the conversion rate as well as support or chat requests.</p>

                    {[
                        "Is PatriotAi completely free to use?",
                        "Do I need to share my personal details?",
                        "Can I commercialize the data from the reports?",
                        "Do you offer technical support?"
                    ].map((question, index) => (
                        <div key={index} className={`faq-item ${faqOpen[index] ? "active" : ""}`}>
                            <div className="faq-question" onClick={() => toggleFaq(index)}>
                                {question}
                                {faqOpen[index] ? <FaChevronUp /> : <FaChevronDown />} {/* Toggle arrow */}
                            </div>
                            {faqOpen[index] && (
                                <div className="faq-answer">
                                    <p>{getFaqAnswer(index)}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                <section className="cta">
                    <h2>Ready for your first course?</h2>
                    <p>Get started on your patriot journey.</p>
                    <a href="#" className="btn-primary">
                        See Courses
                    </a>
                </section>

                <footer className="footer">
                    <p>&copy; 2024 PatriotAi. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#">Product</a>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">Terms</a>
                        <a href="#">Privacy</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}

function getFaqAnswer(index) {
    const answers = [
        "Yes, PatriotAi is completely free to use.",
        "No, all you need is Internet Identity!",
        "Our data is open to policy makers, educators and patriots. Commercialization plans are not established yet.",
        "Yes, we offer technical support."
    ];
    return answers[index];
}
