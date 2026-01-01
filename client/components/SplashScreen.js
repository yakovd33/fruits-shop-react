import React from 'react';

const SplashScreen = ({ isLeaving = false }) => {
    return (
        <div className={`splash-screen${isLeaving ? ' is-leaving' : ''}`} aria-live="polite">
            <div className="splash-orb" aria-hidden="true" />
            <div className="splash-content">
                <span className="splash-eyebrow">פרי וירק ארצנו</span>
                <h1>הסל בדרך אליכם</h1>
                <p>מכניסים את הטעמים הטריים לתוך החוויה שלכם. תכף נטען את האתר.</p>
                <div className="splash-indicator" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
