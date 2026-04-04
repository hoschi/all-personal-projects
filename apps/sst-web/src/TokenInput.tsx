import type React from "react";
import imgUrl from "./screenshot.png";

type TokenInputProps = {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
};
export const StaticPart: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div>
    <header>
      <div className="container">
        <h1>Voxtral Client</h1>
        <p className="tagline">
          Intelligente Sprach-zu-Text Konvertierung mit KI-Unterstützung
        </p>
      </div>
    </header>

    <div className="container">
      <section className="hero-section">
        <img
          src={imgUrl}
          alt="Voxtral Client App Interface"
          className="app-preview"
        />

        <p className="description">
          <strong>Voxtral Client</strong> ist eine innovative
          Client-Side-Anwendung, die Sprache in Text umwandelt – und das mit
          beeindruckender Präzision. Powered by Mistrals Voxtral-Modell,
          übernimmt die KI automatisch Zeichensetzung, Rechtschreibung und
          Grammatikverbesserung. Perfekt für asynchrone Spracheingaben wie
          YouTube-Notizen oder Gedankensammlungen. Mit einer geschätzten Word
          Error Rate von nur 1% und hervorragendem Code-Switching zwischen
          Deutsch und Englisch setzt Voxtral neue Maßstäbe.
        </p>
      </section>

      <section className="hero-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎯 Herausragende Genauigkeit</h3>
            <p>
              Mit einer geschätzten Word Error Rate von nur 1% übertrifft
              Voxtral führende Systeme von Apple und Google deutlich (ca. 8-12%
              WER).
            </p>
          </div>

          <div className="feature-card">
            <h3>✨ Automatische Verbesserung</h3>
            <p>
              Keine manuelle Zeichensetzung nötig! Die KI fügt Satzzeichen
              komplett automatisch ein, korrigiert Rechtschreibung und optimiert
              die Grammatik – subtil und präzise.
            </p>
          </div>

          <div className="feature-card">
            <h3>🌍 Perfektes Code-Switching</h3>
            <p>
              Wechsel mühelos zwischen Deutsch und Englisch. Fremdwörter und
              komplexe Eigennamen werden erstaunlich gut erkannt.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔒 100% Client-seitig</h3>
            <p>
              Alle Daten werden lokal im Browser gespeichert. Deine Notizen
              bleiben nach der Transkribierung lokal gespeichert und gehen
              selbst bei versehentlichem Schließen nicht verloren.
            </p>
          </div>

          <div className="feature-card">
            <h3>⚡ Asynchrone Verarbeitung</h3>
            <p>
              Sprich einen Abschnitt ein und arbeite weiter, während die
              Umwandlung im Hintergrund läuft. Ideal für mehrstufige Workflows
              und paralleles Arbeiten.
            </p>
          </div>

          <div className="feature-card">
            <h3>💰 Kostenlos, überall</h3>
            <p>
              Erstelle einen Mistral-Account ohne Zahlungsmittel und teste
              Voxtral völlig unverbindlich. Die UI ist für Tablets optimiert,
              aber auf allen Geräten sehr gut benutzbar.
            </p>
          </div>
        </div>
      </section>

      <section className="usage-section">
        <h2>So verwendest du Voxtral Client</h2>
        <ol className="usage-steps">
          <li>
            <strong>Notizen einsprechen:</strong> Drücke auf START und sprich
            deine Gedanken oder Notizen zum aktuellen Abschnitt ein.
          </li>
          <li>
            <strong>Weitermachen:</strong> Schau weiter, lies weiter oder
            arbeite weiter – die Sprachdatei wird hochgeladen und vom
            Mistral-Server verarbeitet.
          </li>
          <li>
            <strong>Korrekturlesen:</strong> Nach kurzer Zeit erscheint der
            transkribierte Text im oberen Bereich. Prüfe und bearbeite ihn bei
            Bedarf.
          </li>
          <li>
            <strong>Text übernehmen:</strong> Mit dem PUT-Button fügst du den
            korrekturgelesenen Text zu deinen Gesamtnotizen hinzu.
          </li>
          <li>
            <strong>Wiederholen:</strong> Sprich den nächsten Abschnitt ein,
            während die vorherigen Notizen bereits gesichert sind.
          </li>
        </ol>
        <div className="usage-tip">
          <strong>Tipp:</strong> Die Trennung zwischen "Transcription" und
          "Summary" ermöglicht es dir, schnell zu erkennen, welcher Text noch
          durchgesehen werden muss und welcher bereits fertig ist. Perfekt für
          Multitasking und längere Sitzungen!
        </div>
      </section>

      <section className="api-section">
        <h2>Starte jetzt!</h2>
        <div className="cta-section">
          <h3>Mistral-Account erstellen</h3>
          <p>
            Um Voxtral Client nutzen zu können, benötigst du einen kostenlosen
            Mistral-Account und einen API-Key. Du kannst einen Account ohne
            Hinterlegung eines Zahlungsmittels erstellen.
          </p>
          <p>
            Erstelle deinen Account und generiere einen API-Key hier:
            <br />
            <a
              href="https://console.mistral.ai/home?workspace_dialog=apiKeys"
              target="_blank"
            >
              https://console.mistral.ai/home?workspace_dialog=apiKeys
            </a>
          </p>
        </div>
        <div className="disclaimer">
          <p>
            <strong>Hinweis:</strong> Das Upload-Limit beträgt 20 MB pro Datei.
            Bitte informiere dich auf der Mistral-Website über die
            Datenverarbeitung und Nutzungsbedingungen. Nach letztem Stand ist
            auch der Opt-Out möglich, um die Audiodateien nicht zum Training des
            Modells zu nutzen.
          </p>
        </div>
        <div className="api-key-section">
          <h3>API-Key speichern</h3>
          <p>
            Gib deinen Mistral API-Key ein und speichere ihn für die Verwendung
            mit Voxtral Client:
          </p>
          <div className="api-input-section">{children}</div>
          <div className="success-message" id="successMessage">
            ✓ API-Key erfolgreich gespeichert!
          </div>
        </div>
      </section>
    </div>

    <footer>
      <div className="container">
        <p>
          <span>
            © Stefan Gojan -{" "}
            <a href="/imprint" title="Impressum">
              Impressum
            </a>{" "}
            -{" "}
            <a href="/dataprivacy" title=" Datenschutzerklärung">
              {" "}
              Datenschutzerklärung
            </a>
          </span>
        </p>
      </div>
    </footer>
  </div>
);

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  onSave,
}) => (
  <StaticPart>
    <input
      id="token-input"
      className="api-input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button className="save-button" onClick={onSave}>
      Speichern
    </button>
  </StaticPart>
);
