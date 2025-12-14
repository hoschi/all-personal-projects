# 🚀 Projekt-Insights: FinanceForecast Datenbank-Integration

Diese Datei enthält alle wichtigen Erkenntnisse und Fallstricke, die bei der Implementierung der PostgreSQL-Datenbankintegration aufgetreten sind. Diese Lektionen sollten bei zukünftigen ähnlichen Projekten direkt berücksichtigt werden.

---

## 🔧 Kritische Projekt-Konfiguration

### 1. Package Manager: Bun statt NPM
- **Problem**: Das Repo verwendet `bun` als Package Manager, nicht `npm`
- **Lösung**: Immer `bun run` statt `npm run` verwenden

### 2. .env.example vs .env
- **Problem**: dotenv lädt standardmäßig `.env`, nicht `.env.example`
- **Lösung**: `cp .env.example .env` ausführen falls `.env` nicht verfügbar oder `.env` lesen um zu überprüfen ob alle benötigten Keys verfügbar sind

---

## 🗄️ PostgreSQL-spezifische Erkenntnisse

### 3. Schema-Parameter in URLs
- **Problem**: PostgreSQL-URLs unterstützen **KEINEN** `schema=` Parameter
- **Falsch**: `postgresql://user:pass@host:port/db?schema=financy_forecast`
- **Korrekt**: `postgresql://user:pass@host:port/db?sslmode=disable`
- **Lösung**: Schema über `SET search_path TO financy_forecast;` nach Verbindung setzen

### 4. PostgreSQL 17 Kompatibilität
- **Problem**: `uuid-ossp` Extension ist in PostgreSQL 17 veraltet
- **Problem**: `gen_random_uuid()` ist in PostgreSQL 17 bereits eingebaut
- **Lösung**: Extension-Zeile entfernen und nur `gen_random_uuid()` verwenden

### 5. Schema-Namen mit Bindestrich
- **Problem**: `financy-forecast` (mit Bindestrich) verursacht SQL-Syntaxfehler
- **Lösung**: `financy_forecast` (mit Unterstrich) verwenden

### 6. SSL-Konfiguration für lokale Entwicklung
- **Problem**: Lokale PostgreSQL-Server unterstützen oft kein SSL
- **Falsch**: `sslmode=require`
- **Korrekt**: `sslmode=disable`

---

## 💻 Shell- und Scripting-Probleme

### 7. Shell-Escaping bei komplexen SQL-Befehlen
- **Problem**: Direktes Einfügen von SQL in `-c` Parameter verursacht Escaping-Probleme
- **Lösung**: Temporäre SQL-Dateien verwenden:
```typescript
const tempSqlFile = '/tmp/temp_seed_sql.sql';
writeFileSync(tempSqlFile, `SET search_path TO financy_forecast, public; ${sql}`);
execSync(`psql "${DATABASE_URL}" -f "${tempSqlFile}"`, { stdio: 'pipe', env: process.env });
unlinkSync(tempSqlFile);
```

### 8. PostgreSQL Template-Commands
- **Problem**: `\i` (include) funktioniert nicht mit `-c` Parameter
- **Lösung**: Separate `-f` Parameter für Dateien verwenden

---

## 🗃️ Datenbankdesign-Patterns

### 11. Schema-Management für Multi-Tenant Apps
- **Pattern**: Jedes Projekt bekommt eigenes Schema (`financy_forecast`)
- **Vorteil**: Saubere Trennung zwischen Projekten
- **Implementation**: `SET search_path TO projekt_schema;`

### 12. Singleton-Tabellen (Settings)
- **Pattern**: Settings-Tabelle mit fester UUID als Primary Key
- **SQL Beispiel**:
```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000',
    estimated_monthly_variable_costs BIGINT NOT NULL DEFAULT 0
);
```

---

## 🧪 Testing und Qualitätskontrolle

### 13. Obligatorische Qualitätskontrollen
- **Schritt 1**: `bun lint` - Code-Qualität prüfen
- **Schritt 2**: `bun check-types` - TypeScript-Typen prüfen
- **Erkenntnis**: Niemals Aufgabe als abgeschlossen markieren ohne diese Prüfungen

---