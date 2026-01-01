import Head from 'next/head';
import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <>
            <Head>
                <title>404 | פרי וירק ארצנו</title>
                <meta name="robots" content="noindex" />
            </Head>

            <section className="not-found" dir="rtl">
                <div className="card" role="alert">
                    <p className="eyebrow">אופס...</p>
                    <h1>הדף לא נמצא</h1>
                    <p className="subtitle">
                        נראה שהקישור שגוי או שהדף כבר לא זמין.
                    </p>
                    <small className="hint">תמיד תוכלו להשתמש בחיפוש שבראש האתר כדי להגיע במהירות לכל מוצר.</small>

                    <div className="actions">
                        <Link href="/" className="primary">
                            חזרה לדף הבית
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .not-found {
                    min-height: calc(100vh - 140px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1.5rem;
                }

                .card {
                    width: min(560px, 100%);
                    background: rgba(255, 255, 255, 0.92);
                    border-radius: 28px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 25px 60px rgba(15, 51, 32, 0.15);
                    border: 1px solid rgba(15, 159, 102, 0.12);
                    text-align: center;
                    color: #123328;
                }

                .eyebrow {
                    display: inline-flex;
                    padding: 0.4rem 1.2rem;
                    border-radius: 999px;
                    background: rgba(15, 159, 102, 0.12);
                    color: #0f9f66;
                    font-size: 0.95rem;
                    letter-spacing: 0.08em;
                    margin-bottom: 1rem;
                }

                h1 {
                    font-size: clamp(2.4rem, 6vw, 3.4rem);
                    margin: 0 0 1rem;
                    color: #0c6b45;
                }

                .subtitle {
                    font-size: 1.1rem;
                    margin: 0 auto 1.5rem;
                    max-width: 32ch;
                    color: #415950;
                    line-height: 1.6;
                }

                .hint {
                    display: block;
                    margin-bottom: 2rem;
                    color: #6c7d75;
                }

                .actions {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 1rem;
                    justify-content: center;
                }

                .actions :global(a) {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    padding: 0.85rem 1.8rem;
                    font-weight: 600;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .actions :global(a:hover) {
                    transform: translateY(-2px);
                }

                .actions :global(.primary) {
                    background: linear-gradient(120deg, #0f9f66, #08c07f);
                    color: #fff;
                    box-shadow: 0 15px 35px rgba(10, 107, 71, 0.25);
                }

                .actions :global(.ghost) {
                    color: #0f9f66;
                    border: 1px solid rgba(15, 159, 102, 0.3);
                    background: rgba(255, 255, 255, 0.9);
                }

                @media (max-width: 768px) {
                    .card {
                        padding: 2.5rem 1.75rem;
                    }
                }
            `}</style>
        </>
    );
};

export default NotFoundPage;
