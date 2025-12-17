// screens/legal/Datenschutz.tsx
// Privacy Policy (Datenschutzerklärung) for DSGVO compliance

import React from 'react';
import { Shield } from 'lucide-react';

export const Datenschutz: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <article className="prose prose-invert prose-lg max-w-none">
                <div className="flex items-center gap-3 mb-8">
                    <Shield size={32} className="text-brand-primary" />
                    <h1 className="text-4xl font-bold mb-0">Datenschutzerklärung</h1>
                </div>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. Datenschutz auf einen Blick</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Allgemeine Hinweise</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                        personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
                        Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Datenerfassung auf dieser Website</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                        Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                    </p>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        <strong>Wie erfassen wir Ihre Daten?</strong><br />
                        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
                        Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. Hosting</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Google Cloud Platform / Firebase</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
                        (nachfolgend „Google"). Wenn Sie unsere Website besuchen, erfasst Google verschiedene
                        Logfiles inklusive Ihrer IP-Adressen.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die Verwendung von Google erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                        Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung
                        unserer Website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Datenschutz</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
                        Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den
                        gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
                        Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit
                        der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Auskunftsrecht, Löschungsrecht, Berichtigungsrecht</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
                        unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft
                        und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung
                        oder Löschung dieser Daten.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">4. Datenerfassung auf dieser Website</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Cookies</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien
                        und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend
                        für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies)
                        auf Ihrem Endgerät gespeichert.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert
                        werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte
                        Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim
                        Schließen des Browsers aktivieren.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Server-Log-Dateien</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
                        Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                        <li>Browsertyp und Browserversion</li>
                        <li>verwendetes Betriebssystem</li>
                        <li>Referrer URL</li>
                        <li>Hostname des zugreifenden Rechners</li>
                        <li>Uhrzeit der Serveranfrage</li>
                        <li>IP-Adresse</li>
                    </ul>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                        Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Kontaktformular & E-Mail</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre
                        Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
                        zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">5. Analyse-Tools und Werbung</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Google Analytics</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist
                        die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer
                        Browser-Software verhindern. Wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall
                        gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden nutzen
                        können.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">6. Plugins und Tools</h2>

                    <h3 className="text-xl font-semibold mb-3 mt-6">Stripe für Zahlungen</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Für die Zahlungsabwicklung nutzen wir den Anbieter Stripe. Anbieter ist Stripe, Inc.,
                        510 Townsend Street, San Francisco, CA 94103, USA.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Die Verwendung von Stripe erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
                        (Vertragsabwicklung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer
                        sicheren und effizienten Zahlungsabwicklung).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">7. Ihre Rechte</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Sie haben das Recht:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                        <li>Auskunft über Ihre bei uns gespeicherten Daten zu verlangen (Art. 15 DSGVO)</li>
                        <li>Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
                        <li>Die Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
                        <li>Die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
                        <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO)</li>
                        <li>Die Übertragung Ihrer Daten zu verlangen (Art. 20 DSGVO)</li>
                    </ul>
                </section>

                <footer className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-400">
                    <p>
                        Bei Fragen zum Datenschutz wenden Sie sich bitte an:{' '}
                        <a href="mailto:datenschutz@bigtoe.ai" className="text-brand-primary hover:underline">
                            datenschutz@bigtoe.ai
                        </a>
                    </p>
                    <p className="mt-2">Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}</p>
                </footer>
            </article>
        </div>
    );
};
