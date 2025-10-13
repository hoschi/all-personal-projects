# .cursor-rules
ALWAYS read the instructions in the file `ai-assistants/01-main-directives.md` and follow them strictly before giving an answer.

---

# 01-main-directives.md
## AI Directives: Main Entrypoint

Du bist ein Experte für pragmatische, funktionale Programmierung in Python. Deine Aufgabe ist es, Code für dieses Projekt zu schreiben, zu refaktorisieren und zu testen, der sich strikt an die hier definierten Regeln und Patterns hält.

**BEVOR DU CODE SCHREIBST, KONSULTIERE DIE FOLGENDEN REGELN:**

1.  **Für JEDE Code-Änderung:** Beachte die fundamentalen Prinzipien in `ai-assistants/04-general-coding-rules.md`.
2.  **Aktuellen Stand checken:** Lies dir `ai-assistants/current-state.md` durch.
2.  **Wenn du Tests schreibst:** Beachte ZUSÄTZLICH die spezifischen Test-Strategien in `ai-assistants/02-testing-rules.md`.
3.  **Wenn du existierenden Code refaktorisierst:** Beachte ZUSÄTZLICH die Anweisungen in `ai-assistants/03-refactoring-rules.md`.

Deine Antworten müssen dem Stil und der Qualität des existierenden Codes im `src/`- und `tests/`-Verzeichnis entsprechen.

**NACH JEDER AUFGABE, DIE ÄNDERUNGEN IM `src/` VERZEICHNIS BEINHALTET:**

4.  **Aktualisiere immer die Repository-Dokumentation:** Folge den Anweisungen in `ai-assistants/06-update-current-state.md` um `ai-assistants/current-state.md` zu aktualisieren. Dies ist OBLIGATORISCH bei jeder Änderung im `src/` Verzeichnis - egal ob neue Dateien, geänderte Dateien oder gelöschte Dateien.

---

# 02-testing-rules.md
## Rules for Writing Tests

- **Vollständige Abdeckung:** Jede neue Funktion in `src/` benötigt einen Unit-Test in `tests/` der alle Fälle abdeckt. Die Coverage wird überprüft.
- **Test Data Generation:** Erstelle **IMMER** Testdaten für Pydantic-Modelle mit `Polyfactory`. Schreibe keine manuellen Dictionaries.
  - *Zweck:* Um Boilerplate zu reduzieren und sicherzustellen, dass Testdaten immer valide sind.
- **Property-Based Testing PBT:** PBT ergänzt Unit-Tests, ersetzt sie aber nicht. Es eignet sich besonders für reine Funktionen, Datenstrukturen und Algorithmen mit universellen Invarianten (z. B. Kommutativität, Assoziativität, Round-Trip-Encode/Decode). Hypothesis generiert automatisch zufällige Eingaben, entdeckt Edge Cases und schrinkt fehlerhafte Beispiele zum minimalen Gegenbeispiel ein. PBT lohnt sich, wenn man bereits umfangreiche @pytest.mark.parametrize-Tests hat, komplexe Geschäftslogik oder zuverlässige Referenzimplementierungen zum Vergleich einsetzt. Nicht geeignet ist PBT bei Seiteneffekten, performanzkritischen Tests oder wenn sich keine klaren Eigenschaften formulieren lassen. Beginne mit klassischen Unit-Tests und abstrahiere wiederkehrende Eingabemuster in Property-Tests.
  - *Zweck:* Um die Robustheit über tausende von Fällen zu beweisen, nicht nur Einzelfälle.
- **Mocking:** Verwende **IMMER** Test-Doubles, die dem `Protocol` der Abhängigkeit entsprechen. Nutze keine Magie-Mocks ohne Spezifikation.
  - *Zweck:* Um sicherzustellen, dass Mocks und echter Code synchron bleiben.

---

# 03-refactoring-rules.md
## Rules for Refactoring Code

- **Ziel: Funktionale Reinheit:** Dein Hauptziel ist es, Side-Effects zu reduzieren und Funktionen reiner zu machen.
- **`try/except` -> `Result`:** Refaktoriere `try/except`-Blöcke in der Business-Logik zu Funktionen, die `returns.Result` zurückgeben.
- **`dict` -> `Pydantic`:** Ersetze rohe Dictionaries, die als Entitäten dienen, durch stark typisierte `Pydantic`-Modelle.
- **Harte Abhängigkeiten -> `Protocol` (nur wenn sinnvoll!):** Wenn eine Funktion eine konkrete Klasse (z.B. einen API-Client) direkt importiert, prüfe zuerst, ob mehrere Implementierungen wirklich gebraucht werden (z.B. für Tests, verschiedene Backends). Nur dann refaktoriere auf ein `Protocol` als Argument. In allen anderen Fällen bleibe beim "functional first"-Ansatz (freie Funktionen, reine Datenstrukturen). Das Protocol-Muster ist kein Selbstzweck und darf nicht für einfache Services mit nur einer Implementierung verwendet werden.

---

# 04-general-coding-rules.md
## General Coding Rules

- **Functional First:** Setze das Muster "functional core, imperative shell" um, details dazu findest du in `ai-assistants/05-fcis.md`. Schreibe reine Funktionen, wann immer möglich. Trenne Daten und Logik konsequent. Vermeide OOP-Klassen mit Methoden.
    - **Datenstrukturen:**
      - Nutze `@dataclass(frozen=True)` oder `Pydantic BaseModel` **NUR** für Daten
      - Datenklassen dürfen **KEINE** Methoden enthalten (außer `__post_init__` für Validierung)
      - Alle Felder müssen typ-annotiert und immutable sein
    - **Verhalten:**
      - Implementiere Logik als **freie Funktionen** außerhalb der Datenklassen
      - Funktionen nehmen Datenstrukturen als Parameter entgegen
      - Funktionen geben neue, unveränderliche Datenstrukturen zurück (keine In-Place-Mutation)
      - Nutze `TypeVar` und Generics für wiederverwendbare Funktionen
      - Pattern Matching mit `match`/`case` für unterschiedliches Verhalten basierend auf Datentypen, bei `mypy` Problemen mit Type Narrowing benutzen normale conditionals da diese besser funktionieren.
    - **Verboten:**
      - Klassen mit Methoden (außer Magic Methods wie `__str__`, `__eq__`)
      - Vererbung von Klassen zur Code-Wiederverwendung
      - Stateful Klassen mit `self`-Mutation
      - Service-Klassen mit `__init__` und Instanzvariablen
    - **Erlaubt (Ausnahmen):**
      - `Pydantic` Validators und `Config` in Modellen (für Data Boundaries)
      - Magic Methods für Python-Protokolle (`__str__`, `__repr__`, `__eq__`, `__hash__`)
      - Properties für berechnete Read-Only Felder (sparsam verwenden)
    - **Zustandsänderung:**
      - Erzeuge neue Instanzen statt Objekte zu mutieren
    - **Organisation:**
      - Gruppiere verwandte Funktionen in Modulen (z.B. `user_operations.py`)
      - Nutze Namespaces durch Module statt Klassen
- **Polymorphismus:**
  - Verwende `Protocol` für Interfaces statt Vererbung – **aber nur, wenn mehrere Implementierungen wirklich gebraucht werden** (z.B. für Test-Doubles, verschiedene Backends). Für einfache Services mit nur einer Implementierung bleibe beim "functional first"-Ansatz (freie Funktionen, reine Datenstrukturen). Das Protocol-Muster ist kein Selbstzweck und darf nicht für triviale Fälle verwendet werden.
  - **Functional-First bleibt Standard:** Auch wenn das Protocol-Muster verwendet wird, gelten **alle Functional-First-Regeln** weiterhin: Daten und Logik müssen strikt getrennt bleiben, keine zustandsbehafteten Klassen, keine Methoden außer Magic Methods, keine In-Place-Mutation. Protocols dienen nur als Interface, nicht als Ausrede für OOP-Designs oder Service-Klassen mit Zustand!
- **Strict Typing:** Jeder Code muss vollständig mit `MyPy` im `strict`-Modus validieren. Vermeide `Any`.
- **Error Handling:** Verwende **IMMER** `returns` für Operationen, die fehlschlagen können. Wirf keine Exceptions für erwartbare Fehler.
  - *Zweck & Beispiel:* Um sicherzustellen, dass alle Fehlerfälle im Typsystem abgebildet und behandelt werden müssen. Siehe die lauffähigen Beispiele in `docs/01_core_concepts.ipynb`.
- **Data Boundaries:** Validiere **ALLE** externen Daten (API-Responses, DB-Queries, User-Input) mit `Pydantic`-Modellen an den Rändern der Anwendung. Verwende `Annotated` für detailierte Beschreibungen.
  - *Zweck & Beispiel:* Um eine typsichere Domäne im Inneren der Anwendung zu garantieren. Siehe die Pydantic-Beispiele in `docs/01_core_concepts.ipynb`.
- **Don't Repeat Yourself (DRY):** Vermeide Code-Duplizierung durch die Nutzung von wiederverwendbaren Service-Funktionen und Protokollen.
  - *Zweck & Beispiel:* Um die Wartbarkeit zu erhöhen. Das `Fetcher`-Protocol in `docs/04_architecture_and_design.ipynb` ist ein Beispiel für eine wiederverwendbare Abstraktion.
- Teste deinen Code mit dem Kommando `poe check-all` um sicher zu gehen das alles korrekt ist. Dieses Kommando formatiert den Code, führt die Type Checkes aus sowie die Tests.
- Benutze `Loguru` wenn du logging brauchst um Fehler zu finden oder generell für debug logs die bei bedarf angeschaltet werden können. In `docs/01_core_concepts.ipynb` sind Beispiele zu finden für die Benutzung.

---

# 05-fcis.md
## 5. Functional Core, Imperative Shell (FCIS)

### Kernkonzept
Das FCIS Pattern teilt Software in **zwei klare Schichten**:

**Functional Core (Funktionaler Kern):**
- Enthält **alle Geschäftslogik** als pure functions
- **Keine Seiteneffekte** (kein I/O, keine Mutability)
- `../src/core/`

**Imperative Shell (Imperative Schale):**
- Behandelt **alle Seiteneffekte**: I/O, Datenbank, HTTP, Logging
- Orchestriert Aufrufe zum funktionalen Kern
- Sollte **möglichst dünn** gehalten werden
- `../src/shell/`

### Architektur-Prinzipien
1. **Unidirektionale Abhängigkeit**: Shell → Core (niemals umgekehrt)
2. **Seiteneffekte minimieren**: Alle unreinen Operationen an den Rand drängen
3. **Domain Logic im Core**: Geschäftsregeln bleiben rein und testbar

### Typischer Ablauf
```
Eingabe → Shell → Core (reine Berechnung) → Shell → Ausgabe
```

Die Shell:
1. Empfängt externe Eingaben
2. Konvertiert zu reinen Datenstrukturen
3. Ruft funktionalen Kern auf
4. Führt Seiteneffekte basierend auf Ergebnis aus

### Ausnahmen

* logging ist auch im Kern erlaubt

---

# 06-update-current-state.md
## Update Current State Documentation

### Wann diese Datei aktualisiert werden muss

**IMMER** nach jeder Änderung im `src/` Verzeichnis:
- Neue Dateien erstellt
- Bestehende Dateien geändert (jede Änderung, nicht nur signifikante)
- Dateien gelöscht
- Dateien umbenannt oder verschoben
- Funktionen, Klassen oder Module hinzugefügt/entfernt/geändert

### Was zu aktualisieren ist

#### Bei neuen Dateien
- Datei zur entsprechenden Sektion hinzufügen
- Beschreibung in maximal 50 Wörtern erstellen
- Format: `- **` + '`' + `dateiname.py` + '`' + `** - Beschreibung`
- Alphabetische Sortierung innerhalb der Sektion beibehalten

#### Bei geänderten Dateien
- Bestehende Beschreibung überprüfen und aktualisieren
- Sicherstellen dass die Beschreibung die aktuelle Funktionalität widerspiegelt
- 50-Wörter-Regel einhalten
- Neue Funktionen, Klassen oder wichtige Änderungen erwähnen

#### Bei gelöschten Dateien
- Entsprechenden Eintrag komplett aus current-state.md entfernen
- Prüfen ob andere Beschreibungen Referenzen zur gelöschten Datei enthalten
- Diese Referenzen ebenfalls entfernen oder aktualisieren

#### Bei umbenannten/verschobenen Dateien
- Dateiname und Pfad in der Beschreibung aktualisieren
- Sektion wechseln falls Datei zwischen core/ und shell/ verschoben wurde
- Beschreibung anpassen falls sich die Funktion geändert hat

### Repository Overview Updates

#### Features implementiert
- Implementierte Funktionalitäten auflisten
- Setup-Teile von Feature-Teilen unterscheiden

#### Architektur-Änderungen
- FCIS-Struktur anpassen falls sich die Organisation ändert
- Neue Module oder Packages dokumentieren
- Veränderte Abhängigkeiten zwischen Core und Shell reflektieren

### Format-Regeln

#### Datei-Beschreibungen
- Maximal 50 Wörter pro Datei
- Fokus auf Hauptfunktion der Datei
- Wichtige Klassen, Funktionen oder Konzepte erwähnen
- Zweck und Rolle im Gesamtsystem erklären

#### Struktur-Konsistenz
- Core-Module vor Shell-Module
- Alphabetische Sortierung innerhalb jeder Sektion
- Einheitliche Markdown-Formatierung
- Hierarchische Organisation beibehalten

### Workflow für KI Agenten

#### Nach jeder src/ Änderung
1. Aktuelle `ai-assistants/current-state.md` lesen
2. Alle geänderten, neuen oder gelöschten Dateien identifizieren
3. Entsprechende Sektionen in current-state.md lokalisieren
4. Beschreibungen prüfen und bei Bedarf aktualisieren
5. Neue Einträge hinzufügen oder gelöschte entfernen
6. 50-Wörter-Regel für alle Beschreibungen verifizieren
7. Aktualisierte current-state.md speichern

#### Prüfliste
- Sind alle src/ Dateien dokumentiert?
- Stimmen alle Beschreibungen mit dem aktuellen Code überein?
- Sind gelöschte Dateien entfernt?
- Ist die alphabetische Sortierung korrekt?
- Sind alle Beschreibungen unter 50 Wörtern?
- Ist die Repository Overview aktuell?

### Was NICHT dokumentiert wird

- Test-Dateien im tests/ Verzeichnis
- Konfigurationsdateien außerhalb von src/
- Build-Artefakte oder temporäre Dateien
- AI-Assistant Regeln außer current-state.md
- Dokumentationsdateien außerhalb von src/

---

# current-state.md
## Current State: Radio Bob Spotify Repository

### Repository Overview

Dies ist ein **funktionales Python-Projekt**. Aktuell sind **keine Features implementiert**, aber komplette **Infrastruktur, Tooling und Code-Style-Grundlagen** sind konfiguriert mit Beispielcode für AI Coding Assistants.

### Architektur: Functional Core, Imperative Shell (FCIS)

- **`src/core/`** - Funktionaler Kern: reine Business-Logik, keine Seiteneffekte
- **`src/shell/`** - Imperative Schale: I/O, APIs, CLI, Logging, orchestriert Core-Funktionen

### Aktuelle Dateien im `src/` Verzeichnis

#### Core-Module (Funktionaler Kern)

- **`src/__init__.py`** - Leere Package-Initialisierung
- **`src/py.typed`** - Signalisiert Type-Checker Unterstützung für Inline Type-Hints (PEP 561)

##### src/core/

- **`__init__.py`** - Leere Core-Package Initialisierung
- **`config.py`** - Pydantic Settings für `log_level`, `log_to_file`. Lädt aus `.env`. Globale type-safe `settings` Instanz
- **`models.py`** - Pydantic Datenmodelle: `User` (id, name, age mit Validierung), `ApiResponse` (status, data). Immutable Strukturen
- **`protocols.py`** - `Fetcher[KeyType, ReturnType]` Protocol. Generisches Interface für Daten-Fetching mit `future_safe` async Operations
- **`services.py`** - Business-Logik: `example_transform_service()` (Text-Transform mit Result), `get_user_details()` (User-Fetching mit Dependency Inversion)

#### Shell-Module (Imperative Schale)

##### src/shell/

- **`__init__.py`** - Leere Shell-Package Initialisierung
- **`api.py`** - FastAPI Web-Interface: `InMemoryUserFetcher` (Protocol-Implementierung), Endpoints `/users/{id}`, `/transform/`. Demonstriert Core-Service Integration
- **`cli.py`** - Typer CLI: Commands `transform`, `get-user`. Rich-formatierte Ausgabe. Async Integration mit Core-Services via `anyio.run()`
- **`logging_config.py`** - Loguru-Setup basierend auf Settings. Console-Logger mit Farben, optionaler File-Logger (10MB Rotation, 7 Tage Retention)

### Development Setup

**Tools:** Ruff (Lint+Format), MyPy+BasedPyright (Strict Typing), Pytest (95% Coverage), Poetry, Poe Tasks
**Environment:** Python 3.12, Conda