// screens/legal/AGB.tsx
// Terms & Conditions (Allgemeine Geschäftsbedingungen)

import React from 'react';
import { FileText } from 'lucide-react';

export const AGB: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <article className="prose prose-invert prose-lg max-w-none">
                <div className="flex items-center gap-3 mb-8">
                    <FileText size={32} className="text-brand-primary" />
                    <h1 className="text-4xl font-bold mb-0">Allgemeine Geschäftsbedingungen (AGB)</h1>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. Geltungsbereich</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über die Nutzung
                        der BigToe AI Plattform zwischen BigToe AI (nachfolgend „Anbieter") und dem Nutzer
                        (nachfolgend „Kunde").
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter
                        stimmt ihrer Geltung ausdrücklich schriftlich zu.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. Leistungsbeschreibung</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Anbieter stellt eine webbasierte KI-Plattform zur Generierung von fiktiven Bildern
                        ("AI Art") für kreative, künstlerische und private Zwecke bereit.
                    </p>
                    <p className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-500/10 text-yellow-200 mb-4">
                        <strong>Wichtiger Hinweis:</strong> Die generierten Inhalte sind fiktiv. Es werden keine
                        realen Personen abgebildet. Die Software dient ausdrücklich <u>nicht</u> medizinischen
                        Zwecken, der Diagnose oder der Therapieplanung.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Credits-System</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die Nutzung der Plattform erfolgt über ein Credits-System. Ein Credit entspricht der
                        Möglichkeit, eine Bildgenerierung durchzuführen. Die genauen Kosten pro Generierung
                        sind von der gewählten Qualitätsstufe abhängig und auf der Website ausgewiesen.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Abonnements</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Premium-Abonnements berechtigen zu unbegrenzten Generierungen während der Laufzeit des
                        Abonnements. Die Laufzeit beträgt jeweils einen Monat und verlängert sich automatisch,
                        sofern nicht fristgerecht gekündigt wird.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. Vertragsschluss</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Vertrag kommt durch die Registrierung des Kunden auf der Plattform zustande.
                        Mit der Registrierung gibt der Kunde ein Angebot zum Abschluss eines Nutzungsvertrages ab.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die Annahme des Angebots erfolgt durch die Freischaltung des Kundenkontos durch den Anbieter.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">4. Preise und Zahlung</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Preise</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Es gelten die zum Zeitpunkt der Bestellung auf der Website ausgewiesenen Preise.
                        Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Zahlungsmodalitäten</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die Zahlung erfolgt über den Zahlungsdienstleister Stripe. Akzeptiert werden
                        Kreditkarte und SEPA-Lastschrift. Bei Abonnements erfolgt die Abbuchung monatlich
                        im Voraus.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Gültigkeit von Credits</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Erworbene Credits verfallen nicht und können zeitlich unbegrenzt genutzt werden.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">5. Widerrufsrecht</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Einzelheiten regelt die
                        separate Widerrufsbelehrung.
                    </p>
                    <div className="bg-brand-card p-4 rounded-lg border border-white/10 my-6">
                        <h3 className="text-lg font-bold mb-2">Widerrufsbelehrung</h3>
                        <p className="text-sm text-gray-300 mb-2">
                            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag
                            zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
                        </p>
                        <p className="text-sm text-gray-300">
                            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung
                            (z.B. per E-Mail an{' '}
                            <a href="mailto:widerruf@bigtoe.ai" className="text-brand-primary hover:underline">
                                widerruf@bigtoe.ai
                            </a>
                            ) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">6. Nutzungsrechte und Urheberrecht</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Rechte an generierten Bildern</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Kunde erhält ein einfaches, nicht-exklusives, zeitlich und räumlich unbeschränktes
                        Nutzungsrecht an den von ihm generierten Bildern. Der Kunde darf die Bilder für eigene
                        kommerzielle und nicht-kommerzielle Zwecke nutzen.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Urheberrechte der Plattform</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Alle Rechte an der Plattform, einschließlich des Quellcodes, des Designs und der
                        KI-Modelle, verbleiben beim Anbieter.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">7. Pflichten des Kunden</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Kunde verpflichtet sich:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                        <li>Die Plattform nicht für illegale Zwecke zu nutzen</li>
                        <li>Keine Inhalte zu generieren, die gegen geltendes Recht verstoßen</li>
                        <li>Seine Zugangsdaten geheim zu halten und nicht an Dritte weiterzugeben</li>
                        <li>Die Plattform nicht zu überlasten oder zu missbrauchen</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">8. Haftung</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Haftungsbeschränkung</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Anbieter haftet nur für Vorsatz und grobe Fahrlässigkeit. Die Haftung für leichte
                        Fahrlässigkeit ist ausgeschlossen, soweit nicht Schäden aus der Verletzung des Lebens,
                        des Körpers oder der Gesundheit betroffen sind.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Verfügbarkeit</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Anbieter bemüht sich um eine Verfügbarkeit der Plattform von 99%. Eine
                        Verfügbarkeitsgarantie wird nicht gegeben. Wartungsarbeiten können zu vorübergehenden
                        Unterbrechungen führen.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">9. Kündigung</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Abonnements können von beiden Vertragsparteien mit einer Frist von 7 Tagen zum Ende
                        der jeweiligen Laufzeit gekündigt werden. Die Kündigung bedarf der Textform
                        (E-Mail ausreichend).
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">10. Datenschutz</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Schutz personenbezogener Daten ist dem Anbieter wichtig. Einzelheiten zur
                        Datenverarbeitung finden Sie in unserer{' '}
                        <a href="/datenschutz" className="text-brand-primary hover:underline">
                            Datenschutzerklärung
                        </a>.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">11. Schlussbestimmungen</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">11.1 Änderungen der AGB</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Anbieter behält sich vor, diese AGB für die Zukunft zu ändern. Kunden werden über
                        Änderungen per E-Mail informiert und können widersprechen.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">11.2 Anwendbares Recht</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">11.3 Gerichtsstand</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist, soweit gesetzlich
                        zulässig, der Sitz des Anbieters.
                    </p>
                </section>

                <footer className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-400">
                    <p>
                        Bei Fragen zu diesen AGB wenden Sie sich bitte an:{' '}
                        <a href="mailto:info@bigtoe.ai" className="text-brand-primary hover:underline">
                            info@bigtoe.ai
                        </a>
                    </p>
                    <p className="mt-2">Stand: {new Date().toLocaleDateString('de-DE')}</p>
                </footer>
            </article>
        </div>
    );
};
