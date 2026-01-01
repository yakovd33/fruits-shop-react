import Faq from "react-faq-component";

const data = {
    title: "שאלות ותשובות - איך זה עובד?",
    rows: [
        {
            title: "האם יש מינימום הזמנה ודמי משלוח?",
            content: `לא אצלנו איך מינימום הזמנה ודמי משלוח ניתן להזמין בכול סכום שתרצו!`,
        },
        {
            title: "מהם אזורי החלוקה? ",
            content: "אזורי החלוקה הם מאזור נס ציונה שבדרום עד אזור חדרה שבצפון כמובן אנו פתוחים להצעות להגיע למקומות חדשים",
        },
        {
            title: "מהם ימי ההגעה?",
            content: `ימי ההגעה משתנים מעת לעת כול הפרטים לגבי ימי הגעה תינתן תשובה בוואסטפ`,
        },
        {
            title: "האם עליי להיות בבית בזמן המשלוח ומהם שעות ההגעה?",
            content: `לא את ההזמנה ניתן להשאיר מחוץ לדלת בתיאום מראש, שעות ההגעה משתנות ולכן כול הפרטים ינתנו בוואטספ לאחר סגירת ההזמנה`,
        },
        {
            title: "מה קורה אם יש חוסר או ליקוי במשלוח?",
            content: `במידה ויש חוסר ישר לפנות בוואטספ שמצורף לטיפול בבעיה,במידה ויש ליקוי במשלוח ניתן לשלוח תמונה בוואטספ ואנו נזכה בהתאם .`,
        },
        {
            title: "האם המוצרים כשרים ומה לגבי שנת שמיטה?",
            content: `כול המוצרים עוברים תרומות ומעשרות`,
        },
    ],
};

const styles = {
    // bgColor: 'white',
    titleTextColor: "#121212",
    rowTitleColor: "#121212",
    // rowContentColor: 'grey',
    // arrowColor: "red",
};

const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
};

const aboutStats = [
    { label: 'משלוחים ביום', value: '450+' },
    { label: 'משקים שיתופיים', value: '32' },
    { label: 'לקוחות חוזרים', value: '12K' }
];

const valuePillars = [
    {
        title: 'חקלאות הוגנת',
        description: 'תשלום הוגן לחקלאים, חוזים ארוכי טווח והתחייבות לרכוש גם כאשר מזג האוויר פחות נדיב.'
    },
    {
        title: 'טריות שקופה',
        description: 'קטיף בוקר, שינוע בקירור ותיעוד מלא של מקור התוצרת עד פתח הבית שלכם.'
    },
    {
        title: 'קהילה מקומית',
        description: 'שיתופי פעולה עם בתי ספר, עמותות ועסקים קטנים שמקדמים תזונה בריאה ונגישות.'
    }
];

const About = () => {
    return (
        <>
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-grid">
                        <div className="about-hero-copy">
                            <span className="home-eyebrow subtle">סיפור המטע</span>
                            <h1>חקלאות טרייה שמגיעה פשוט עד הדלת</h1>
                            <p>
                                אנחנו עובדים יד ביד עם משפחות חקלאים, קוטפים בשעות הבוקר ויוצאים להפצה מיד כשהארגז מוכן. כך נמנע בזבוז, שומרים על המחיר הוגן ומביאים אליכם טעם של שדה.
                            </p>
                            <div className="about-pill-list">
                                <span>ללא מינימום הזמנה</span>
                                <span>פיקוח כשרות מלא</span>
                                <span>עדכון ווטסאפ אישי</span>
                            </div>
                            <div className="about-hero-actions">
                                <a href="tel:0523118864" className="hero-cta primary">הזמינו תוצרת טרייה</a>
                                <a href="#about-faq" className="hero-cta ghost">שאלות נפוצות</a>
                            </div>
                        </div>
                        <div className="about-hero-highlight">
                            <p className="about-hero-note">הצוות שלנו מסדר את המשלוחים כאילו הם עבור המשפחות שלנו: אריזות נשימות, קירור עד הרגע האחרון ושירות אנושי שמכיר כל קופסה.</p>
                            <div className="about-hero-stats">
                                { aboutStats.map((stat) => (
                                    <div className="about-hero-stat" key={stat.label}>
                                        <strong>{ stat.value }</strong>
                                        <span>{ stat.label }</span>
                                    </div>
                                )) }
                            </div>
                            <span className="about-hero-footnote">משלוחים בכל יום א׳–ה׳, איסוף עצמי בתיאום מראש.</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="container">
                    <div className="about-story-grid">
                        <div className="about-story">
                            <h2>מהווה לעתיד</h2>
                            <p>
                                המשבר האחרון הזכיר לכולנו כמה חקלאות מקומית היא קריטית. בשוק חקלאי סהר החלטנו להפוך את שרשרת האספקה לשקופה: אתם יודעים מאיזה משק הגיע כל שקית,
                                ואנחנו יודעים בדיוק את מי אנחנו מחבקים ברגע שבו אתם לוחצים על כפתור הזמנה.
                            </p>
                            <p>
                                אנחנו עובדים לאורך כל הארץ – מהגולן ועד הנגב – ומחברים בין מגוון רחב של גידולים, זנים וסיפורים אנושיים. כל הירקות והפירות נארזים ידנית ומוזמנים לצאת לדרך רק כשהם בשיא הטריות.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="container">
                    <div className="about-values-card">
                        <h2>הערכים שמנחים כל משלוח</h2>
                        <div className="about-values">
                            { valuePillars.map((pillar) => (
                                <div className="about-value" key={pillar.title}>
                                    <h3>{ pillar.title }</h3>
                                    <p>{ pillar.description }</p>
                                </div>
                            )) }
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section" id="about-faq">
                <div className="container">
                    <div className="about-faq-card">
                        <h2>שאלות נפוצות</h2>
                        <Faq data={data} styles={styles} config={config} />
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="container">
                    <div className="about-cta-card">
                        <div>
                            <span className="home-eyebrow subtle">מחכים לשמוע מכם</span>
                            <h3>צריכים רשימת קניות מותאמת? נרכיב אותה ביחד.</h3>
                            <p>נשמח לייעץ על כמויות למסיבה, על ירקות לגינה הביתית או על מארזי מתנה למשרד.</p>
                        </div>
                        <a href="tel:0523118864" className="hero-cta primary">חייגו עכשיו</a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;