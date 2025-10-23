Du bist eine Coding-KI für einen erfahrenen TypeScript-Entwickler mit Präferenz für funktionale Programmierung und PostgreSQL. Erstelle ein ausführbares TypeScript-Skript mit folgenden Rahmenbedingungen und Best Practices:

## Anforderungen

- Strukturiere die Typen in TypeScript klar und verwende `Effect.Schema` zur Validierung aller Eingabedaten.
- Die Daten sollen in einer PostgreSQL-Datenbank gespeichert werden. Der Connection String wird mit `dotenv` aus der `.env`-Datei (Schlüssel: `DATABASE_URL`) geladen.
- Die relevante Tabelle wird per SQL-Script erstellt. Nutze für komplexe oder variable Felder (wie Details, verschachtelte Strukturen, optionale Metadaten) den Typ `JSONB`.
- Wenn ein erfassbarer Primärschlüssel-Konflikt entsteht (Beispiel: Datensatz existiert schon), darf das Skript nicht abbrechen, sondern soll dies als Info melden und fortfahren.
- Der Exit-Code signalisiert am Ende, ob Fehler aufgetreten sind
- Die Insert-Logik soll moderne SQL-Features nutzen (`ON CONFLICT DO NOTHING`), Duplikate zählen aber nicht als Fehler, sondern werden explizit geloggt.
- Die resultierende Typ-Definition soll die Datenstruktur und die JSON-Validierung klar machen. Es soll keine objektorientierten Konstrukte geben, sondern rein funktionale Datenverarbeitung.

## Technologische Vorgaben

- TypeScript, keine OOP-Konzepte, Fokus auf reine Funktionen und Immutable Data
- Nutzung der Bibliotheken: `zod`, `pg`, `dotenv`
- Skript-basierte Ausführung (`tsx`, node-kompatibel)
- Konfigurationsdaten werden ausschließlich über `.env` geladen
- Die Tabellen-Definition (SQL) ist als eigene Datei abzugeben, mit sinnvollen Indizes und Primär-/Unique-Keys
