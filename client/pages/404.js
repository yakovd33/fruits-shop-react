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

        </>
    );
};

export default NotFoundPage;
