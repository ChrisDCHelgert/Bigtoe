// screens/legal/Impressum.tsx
// Impressum (Legal Notice) page for DSGVO compliance

import React from 'react';

export const Impressum: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <article className="prose prose-invert prose-lg max-w-none">
                <h1 className="text-4xl font-bold mb-8">Impressum</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Angaben gemäß § 5 TMG</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        BigToe AI<br />
                        Musterstraße 123<br />
                        10115 Berlin<br />
                        Deutschland
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        E-Mail: <a href="mailto:info@bigtoe.ai" className="text-brand-primary hover:underline">info@bigtoe.ai</a><br />
                        Telefon: +49 (0) 30 1234567<br />
                        Website: <a href="https://bigtoe.ai" className="text-brand-primary hover:underline">https://bigtoe.ai</a>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Vertreten durch</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Geschäftsführer: Max Mustermann
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Registereintrag</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Eintragung im Handelsregister<br />
                        Registergericht: Amtsgericht Berlin-Charlottenburg<br />
                        Registernummer: HRB 123456 B
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Umsatzsteuer-ID</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
                        DE123456789
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Max Mustermann<br />
                        Musterstraße 123<br />
                        10115 Berlin
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">EU-Streitschlichtung</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                            https://ec.europa.eu/consumers/odr
                        </a>
                        <br />
                        Unsere E-Mail-Adresse finden Sie oben im Impressum.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                        Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Haftungsausschluss</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Haftung für Inhalte</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                        nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                        Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                        Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                        Tätigkeit hinweisen.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Haftung für Links</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                        Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                        Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
                        der Seiten verantwortlich.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Urheberrecht</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
                        dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                        der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
                        Zustimmung des jeweiligen Autors bzw. Erstellers.
                    </p>
                </section>

                <footer className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-400">
                    <p>Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}</p>
                </footer>
            </article>
        </div>
    );
};
