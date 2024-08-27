import React, { useState } from "react";
import { FaSun, FaMoon, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import the icons
import "./home.css";

export default function HomePage() {
    const [darkMode, setDarkMode] = useState(false);
    const [faqOpen, setFaqOpen] = useState([false, false, false, false]); // State to track open/close status of FAQs

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
    };

    const toggleFaq = (index) => {
        const newFaqOpen = [...faqOpen];
        newFaqOpen[index] = !newFaqOpen[index];
        setFaqOpen(newFaqOpen);
    };

    return (
        <div className="hbody">
            <div className={`container ${darkMode ? "dark-mode" : ""}`}>
                <header className="header">
                    <div className="logo">
                        <img src="/patriot.png" alt="PatriotAi Logo" />
                        <span className="patriot-ai">PatriotAi</span> {/* Updated class */}
                    </div>
                    <nav className="nav">
                        <a href="#">Product</a>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">Company</a>
                        <a href="#">Blog</a>
                    </nav>
                    <button className="btn-primary">Log in with Internet</button>
                    <div className="theme-toggle" onClick={toggleDarkMode}>
                        {darkMode ? (
                            <FaSun size={24} color="#FFD700" /> // Sun icon for light mode
                        ) : (
                            <FaMoon size={24} color="#4B0082" /> // Moon icon for dark mode
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
                        <div></div>
                    </div>
                    <img src="/vr.png" alt="Hero" className="hero-image" />
                </section>
                <div className="partners">
                    <img src="/un.png" alt="" />
                    <img src="/ic.png" alt="" />
                </div>

                <div className="section-title">
                    <div className="benefits1">
                    <h2>PATRIOTAI BENEFITS</h2>
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
                                <strong>Understand corruption</strong>
                                <p>
                                    The platform helps you answer all your questions about
                                    corruption and get rewards for it!
                                </p>
                            </li>
                            <li>
                                <strong>Learn how to fight corruption</strong>
                                <p>To overcome it, you have to understand it.</p>
                            </li>
                            <li>
                                <strong>Fight corruption</strong>
                                <p>Participate in our programs and help combat corruption.</p>
                            </li>
                        </ul>
                    </div>
                    </div>
                  
                </div>

                {/* <section className="benefits">
                    
                </section> */}

                <section className="testimonials">
                    <h2>Here's what our customers said</h2>
                    <div className="testimonial">
                        <img src="/user1.jpg" alt="user" />
                        <p>
                            "I got to share my story and I got a response asking if I want to
                            share more details."
                        </p>
                        <span>Sarah, UAE</span>
                    </div>
                    <div className="testimonial">
                        <img src="/user1.jpg" alt="user" />
                        <p>
                            "PatriotAi has come in handy in my understanding of corruption and
                            how to identify it."
                        </p>
                        <span>Daniel, Kenya</span>
                    </div>
                    <div className="testimonial">
                        <img src="/user1.jpg" alt="user" />
                        <p>
                            "I can't wait to collect more tokens in my next course. This is so
                            much fun."
                        </p>
                        <span>Khamla, South Africa</span>
                    </div>
                </section>

                <section className="faq">
                    <h2>Frequently Asked Questions</h2>
                    {[
                        "Is PatriotAi completely free to use?",
                        "Do I need to share my personal details?",
                        "Can I commercialize the data from the reports?",
                        "Do you offer technical support?"
                    ].map((question, index) => (
                        <div key={index} className={`faq-item ${faqOpen[index] ? "active" : ""}`}>
                            <button className="faq-question" onClick={() => toggleFaq(index)}>
                                {question}
                                {faqOpen[index] ? <FaChevronUp /> : <FaChevronDown />} {/* Toggle arrow */}
                            </button>
                            {faqOpen[index] && (
                                <div className="faq-answer">
                                    <p>This is the answer to the FAQ question. Provide specific information here.</p>
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
