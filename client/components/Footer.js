const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="main-footer">
            <p className="footer-copy">© { currentYear } פרי וירק ארצנו • כל הזכויות שמורות</p>
            <p className="footer-credit">
                נבנה ב-❤️ ע"י <a href="https://eropa.co.il" target="_blank" rel="noreferrer">אירופה בניית אתרים</a>
            </p>
        </footer>
    );
};

export default Footer;