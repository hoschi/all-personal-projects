import type React from "react";
import imgUrl from "./screenshot.png";

export const MarketingPage: React.FC = () => (
  <div>
    <header>
      <div className="container">
        <h1>Whisper Notes</h1>
        <p className="tagline">
          Lokale Speech-to-Text Verarbeitung mit whisper.cpp
        </p>
      </div>
    </header>

    <div className="container">
      <section className="hero-section">
        <img
          src={imgUrl}
          alt="Whisper Notes App Interface"
          className="app-preview"
        />

        <p className="description">
          <strong>Whisper Notes</strong> ist eine Client-Side-Anwendung, die
          Audionotizen direkt gegen deinen lokal laufenden
          <code> whisper-server </code>
          transkribiert. Es wird kein API-Key und kein zusätzlicher Proxy
          benötigt.
        </p>
      </section>

      <section className="hero-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Direkte whisper.cpp Integration</h3>
            <p>
              Browser und whisper-server kommunizieren direkt per
              multipart/form-data.
            </p>
          </div>

          <div className="feature-card">
            <h3>Keine Token-Verwaltung</h3>
            <p>
              Kein Login, kein API-Key und keine lokale Schlüsselverwaltung
              nötig.
            </p>
          </div>

          <div className="feature-card">
            <h3>Lokale Datenhaltung</h3>
            <p>
              Transkripte und Zusammenfassungen bleiben im Browser gespeichert.
            </p>
          </div>

          <div className="feature-card">
            <h3>Für asynchrone Notizen</h3>
            <p>
              Abschnitt für Abschnitt einsprechen, korrigieren und in den
              Gesamttext übernehmen.
            </p>
          </div>
        </div>
      </section>

      <section className="usage-section">
        <h2>So funktioniert es</h2>
        <ol className="usage-steps">
          <li>
            <strong>Server starten:</strong> Starte lokal den whisper-server auf
            Port 9100.
          </li>
          <li>
            <strong>Zur App wechseln:</strong> Öffne die App unter
            <code> /app </code> und starte die Aufnahme.
          </li>
          <li>
            <strong>Transkript prüfen:</strong> Das Ergebnis erscheint im Bereich
            "Transcription" und kann direkt bearbeitet werden.
          </li>
          <li>
            <strong>Text übernehmen:</strong> Mit "PUT" fügst du den Abschnitt
            dem Bereich "Summary" hinzu.
          </li>
          <li>
            <strong>Exportieren:</strong> Mit dem Scheren-Button kannst du den
            Summary-Text kopieren und gleichzeitig leeren.
          </li>
        </ol>
        <div className="usage-tip">
          <strong>Hinweis:</strong> whisper.cpp liefert segmentierten Text. Die
          App normalisiert Whitespace automatisch, damit keine störenden
          Zeilenumbrüche im Ergebnis bleiben.
        </div>
      </section>

      <section className="api-section">
        <h2>Starten</h2>
        <div className="cta-section">
          <h3>Direkt zur App</h3>
          <p>
            Wenn dein whisper-server läuft, kannst du sofort mit der Aufnahme
            beginnen.
          </p>
          <div className="api-input-section">
            <a className="save-button" href="/app">
              Zur App
            </a>
          </div>
        </div>
        <div className="disclaimer">
          <p>
            <strong>Wichtig:</strong> Falls die Anfrage fehlschlägt, prüfe ob
            dein whisper-server CORS für Browser-Requests erlaubt.
          </p>
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
            <a href="/dataprivacy" title="Datenschutzerklärung">
              Datenschutzerklärung
            </a>
          </span>
        </p>
      </div>
    </footer>
  </div>
);
