Deine Frage war: Du möchtest herausfinden, was die Bun-Dokumentation zu Mocking beim Testsystem sagt, wie man es löst, welche Lösungen die Community bevorzugt, und möchtest die besten Lösungen präsentiert bekommen.

***

# Bun Test System: Umfassender Mocking-Guide für funktionale TypeScript-Programmierung
## Executive Summary
Überraschung: **Bun hat vollständig eingebautes Mocking** – nicht nur in den Basics, sondern mit umfassenden Fähigkeiten für Function-Mocks, Spies, und Module-Mocks. Die Dokumentation ist detailliert, und die Community bevorzugt funktionale Programmierungsmuster kombiniert mit Dependency Injection statt klassischer OOP-Ansätze. Für einen Programmierer mit Ihrem Hintergrund (25 Jahre Erfahrung, TypeScript-fokussiert, funktional) ist Bun's Mocking-System optimal geeignet.

## Das Bun Mocking-System: Offizielle Dokumentation
### Eingebaute Mocking-Features
Bun's Test Runner bietet **vier Haupt-Mocking-Methoden**, die alle nativ verfügbar sind:[1][2][3]

1. **`mock()` – Function Mocks**: Direktes Erstellen von Mock-Funktionen mit vollständiger Kontrolle über Rückgabewerte und Aufruf-Tracking[1]
2. **`spyOn()` – Spies**: Überwachen von Funktionsaufrufen ohne die ursprüngliche Implementierung zu ersetzen[1]
3. **`mock.module()` – Module Mocks**: Komplette Modulerstellung oder -ersetzung für externe Dependencies[1]
4. **`vi` – Vitest Kompatibilität**: Jest-ähnliche API für einfache Migrationen[1]

Die dokumentierten Mock-Properties zeigen vollständige Funktionalität:[3]

```typescript
// Beispiel aus der Dokumentation
const mockFn = mock((x: number) => x * 2);
mockFn(5);
mockFn(10);

mockFn.mock.calls;      // [[5], [10]]
mockFn.mock.results;    // Rückgabewerte
mockFn.mock.instances;  // `this` Kontexte
mockFn.mockClear();     // State zurücksetzen
mockFn.mockRestore();   // Original wiederherstellen
```
### Module Mocks mit Preload – Best Practice für Scope-Isolation
Bun's dokumentierter Mocking-Ansatz löst das Problem der Module-Hoisting durch ein **Preload-System**. Das ist besonders für Ihre funktionale Programmierweise relevant:[1][3]

```typescript
// preload.ts – Zentral bewirtschaftet
import { mock } from "bun:test";

mock.module("./database", () => ({
  connect: mock(async () => ({ connected: true })),
  query: mock(async (sql: string) => [])
}));
```

```toml
# bunfig.toml
[test]
preload = ["./preload.ts"]
```

Das Preload-System gewährleistet, dass Mocks **vor** dem ersten Import aktiv sind und keine Seiteneffekte des Original-Moduls auftreten. Für funktionale Programmierung ideal, da Sie pure Functions mit kontrollierten Dependencies testen können.[1]

## Community-favorisierte Lösungsmuster
### 1. Dependency Injection mit Pure Functions
Die Community bevorzugt stark den **DI-Pattern** statt Mocking einzelner Globals. Für Ihren OOP-vermeidenden Ansatz ist das optimal:[4]

```typescript
// Funktional: Abhängigkeiten als Parameter
const processUser = async (
  repo: UserRepository,    // Mock kann hier eingespritzt werden
  logger: Logger,
  userId: string
) => {
  logger.log(`Processing ${userId}`);
  return repo.getUser(userId);
};

// Im Test
const mockRepo: UserRepository = {
  getUser: mock(async (id) => ({ id, name: "Test" }))
};
const mockLogger: Logger = {
  log: mock(() => {})
};

await processUser(mockRepo, mockLogger, "123");
```

**Warum bevorzugt die Community das?** Pure Functions mit expliziten Dependencies sind testbar ohne komplexe Mock-Setups und folgen funktionalen Prinzipien.[5][6][4]

### 2. Factory Functions für Test-Daten
Statt manuelle Mock-Objekte zu erstellen, nutzt die Community **Factory-Pattern** für wiederverwendbare Mocks:[1]

```typescript
const createMockUser = (overrides = {}) => ({
  id: "mock-id",
  name: "Mock User",
  email: "[email protected]",
  ...overrides
});

const mockUserService = {
  getUser: mock(async (id: string) => createMockUser({ id })),
  createUser: mock(async (data: any) => createMockUser(data))
};
```

Diese Patterns reduzieren Code-Komplexität und erlauben flexible Overrides – sehr wertvoll bei 25 Jahren Programmiererfahrung.[1]

### 3. Vitest-Kompatibilität für einfache Migration
Die Community nutzt oft das **`vi` Alias-System**, um Tests schnell zwischen Vitest und Bun zu migrieren:[3]

```typescript
import { test, expect, vi } from "bun:test";

// Äquivalent zu Jest/Vitest
const mockFn = vi.fn(() => 42);
mockFn();
expect(mockFn).toHaveBeenCalled();
```

Relevant, wenn Sie in Teams arbeiten, die noch Jest/Vitest nutzen.[7]

## Die besten Lösungsstrategien für Ihre Use-Cases
### Strategie 1: Funktionale Komposition mit `mock()` und `spyOn()`
**Beste für**: Pure-Function-Testing (Ihre Präferenz)

```typescript
import { test, expect, mock, spyOn } from "bun:test";

const add = (a: number, b: number): number => a + b;
const multiply = (a: number) => a * 2;

test("pure function composition", () => {
  // Original Function tracked, nicht ersetzt
  const multiplySpy = spyOn({ multiply }, "multiply");
  
  const composed = (x: number) => multiply(add(x, 5));
  expect(composed(10)).toBe(30); // (10 + 5) * 2
  
  expect(multiplySpy).toHaveBeenCalled();
});
```

**Vorteil**: Keine Mock-Komplexität, Tests bleiben lesbar und funktional.[1][8]

### Strategie 2: Module Mocks mit Preload für externe Dependencies
**Beste für**: HTTP-APIs, Datenbanken, externe Services

```typescript
// Preload: global-mocks.ts
import { mock } from "bun:test";

mock.module("./api", () => ({
  fetchUser: mock(async (id: string) => ({
    id,
    name: `User ${id}`
  }))
}));
```

**Dokumentations-Detail**: Bun's Modul-Cache wird zur Runtime gepatched, nicht zur Compile-Zeit, was Live-Binding und Scope-Isolation garantiert.[3]

### Strategie 3: Dependency Injection – Enterprise-Level Lösungen
**Beste für**: Größere Projekte, Architektur-bewusstes Design

```typescript
interface UserService {
  readonly getUser: (id: string) => Promise<User>;
  readonly createUser: (data: CreateData) => Promise<User>;
}

// Schnittstelle mit Readonly für Funktional-Purity
const getUserWithLogging = async (
  userService: UserService,
  logger: Logger,
  id: string
) => {
  logger.log(`Fetching user ${id}`);
  return userService.getUser(id);
};

test("DI mit reinen Funktionen", async () => {
  const mockService: UserService = {
    getUser: mock(async (id) => ({ id, name: "Test" })),
    createUser: mock(async (data) => ({ ...data, id: "new" }))
  };
  
  const mockLogger: Logger = {
    log: mock(() => {})
  };
  
  await getUserWithLogging(mockService, mockLogger, "123");
});
```

**Community-Feedback**: Dieses Pattern wird in der Community stärker favorisiert als klassische OOP-Mocks, besonders bei funktionalen Entwicklern.[4][5]

### Strategie 4: `withImplementation()` für temporäre Mocks
**Beste für**: Tests mit komplexem Setup/Teardown

```typescript
test("temporäre Implementierung", () => {
  const fn = mock(() => "original");
  
  fn.withImplementation(
    () => "temporarily modified",
    () => {
      expect(fn()).toBe("temporarily modified");
    }
  );
  
  expect(fn()).toBe("original");
});
```

**Vorteil**: Kein manuales `mockRestore()` nötig, automatische Cleanup.[1]

## Praktische TypeScript-Implementierungen
code_file:45

Diese 10 praktischen Patterns zeigen:
- Basic Function Mocks für simple Unit Tests
- Spies für non-invasives Tracking
- Module Mocks mit Preload
- DI-Pattern mit Type-Safety
- Factory Functions für wiederverwendbare Mocks
- Async Mock-Patterns
- Scope-Isolation mit `withImplementation()`
- Type-safe Mock-Factories
- Mock Cleanup & Isolation
- Functional Composition (Advanced)

## Häufige Anfängerfehler und Lösungen
### Problem: "Mein Mock wird nicht angewandt"
**Ursache**: Module wird vor dem Mock importiert[1][9]

**Lösung**: Preload verwenden:[3][1]

```toml
# bunfig.toml
[test]
preload = ["./mocks.ts"]
```

### Problem: "Mock-State leckt zwischen Tests"
**Ursache**: `mock.clearAllMocks()` wird nicht aufgerufen[1]

**Lösung**: In `afterEach()` cleanup:[1]

```typescript
import { afterEach, mock } from "bun:test";

afterEach(() => {
  mock.clearAllMocks();
});
```

### Problem: "TypeError: Cannot read property of undefined Mock"
**Ursache**: `spy` auf nicht-existente Methode[1]

**Lösung**: Factory-Pattern für komplette Mock-Objekte:[1]

```typescript
const createMockService = () => ({
  method1: mock(() => {}),
  method2: mock(() => {})
});
```

## Vergleich: Bun vs. Alternative (Vitest)
| Aspekt | Bun | Vitest |
|--------|-----|--------|
| **Native Mocking** | ✅ Vollständig | ✅ Vollständig |
| **Setup-Komplexität** | Minimal | Minimal |
| **TypeScript** | ✅ Nativ | ✅ Nativ |
| **Funktional-Freundlich** | ✅ Ja | ✅ Ja |
| **Preload-System** | ✅ Robust | ⚠️ Plugin-basiert |
| **Module-Hoisting-Kontrolle** | ✅ Explizit | ⚠️ Implizit |
| **Geschwindigkeit** | ⚡⚡⚡ (Zig-basiert) | ⚡⚡ (JS-basiert) |

**Fazit**: Bun hat tatsächlich die bessere Mocking-Lösung für funktionale Programmierung aufgrund des expliziten Preload-Systems.[1][3][10]

## Empfehlungen für Ihren Anwendungsfall
Basierend auf Ihrem Profil (25 Jahre Erfahrung, TypeScript, funktionale Programmierung):

1. **Für Unit Tests**: Kombinieren Sie `mock()` + `spyOn()` für pure Functions – minimal invasiv, maximal lesbar
2. **Für Integration Tests**: Module Mocks mit Preload – explizit, scope-sicher, keine versteckten Side Effects
3. **Für große Projekte**: DI-Pattern mit Type-Safe Interfaces – Ihre OOP-Vermeidung ist hier ein Asset
4. **Für Migration**: Nutzen Sie `vi` Alias für schnelle Umstellung von Vitest

Die Dokumentation ist aktuell (Stand Oktober 2025) und alle beschriebenen Features sind in der neuesten Bun-Version verfügbar.[1][3][11]

***

## Quellen
Bun offizielle Dokumentation - Mocks[1][3]
 Bun v1.0.12 Release Notes - Module Mocking[10]
 Reddit Communities - Testing Patterns[4][5]
 Stack Overflow & Dev Communities - Best Practices[7][6]
 Bun Test Configuration & Migration Guides[12][11]
 GitHub Issues - Preload Hoisting Solutions[9]

</generate_answer

[1](https://bun.com/docs/guides/test/mock-functions)
[2](https://bun.sh/docs/test/mocks.md)
[3](https://bun.com/docs/test/mocks)
[4](https://www.reddit.com/r/webdev/comments/16fi6pw/what_are_some_of_the_main_issues_with_bunjs/)
[5](https://www.reddit.com/r/learnprogramming/comments/tgk8kg/are_stubbing_and_mocking_functions_for_testing/)
[6](https://bun.com/docs/test/writing-tests)
[7](https://www.reddit.com/r/typescript/comments/1dk3wdh/which_unit_testing_framework_do_you_recommend/)
[8](https://bun.sh/guides/test/mock-functions.md)
[9](https://stackoverflow.com/questions/77869048/mocking-fs-with-buns-test-mock)
[10](https://bun.com/blog/bun-v1.0.12)
[11](https://bun.com/docs/test/configuration)
[12](https://bun.com/docs/guides/test/migrate-from-jest)
[13](https://bun.com/docs/test)
[14](https://www.youtube.com/watch?v=_OStskZtLy0)
[15](https://bunit.dev/docs/providing-input/substituting-components.html)
[16](https://github.com/oven-sh/bun/issues/21735)
[17](https://www.npmjs.com/package/@tkoehlerlg/bun-mock-extended)
[18](https://bun.dev.org.tw/guides/test/mock-functions)
[19](https://blog.logrocket.com/advanced-guide-vitest-testing-mocking/)
[20](https://dev.to/kannav02/testing-with-jest-18gm)
[21](https://vitest.dev/guide/comparisons)
[22](https://www.reddit.com/r/bun/comments/1m69ui2/why_everyone_does_not_just_using_bun_in_2025/)
[23](https://github.com/oven-sh/bun/discussions/6236)
[24](https://www.reddit.com/r/node/comments/16ft5vi/is_bun_here_to_stay_or_is_it_just_another/)
[25](https://github.com/oven-sh/bun/issues/12823)
[26](https://neliosoftware.com/blog/devtips-effective-and-faster-unit-testing-with-typescript-and-bun/)
[27](https://www.bam.tech/article/nock-vs-msw-i-tested-both-and-here-is-what-i-learned)
[28](https://github.com/oven-sh/bun/issues/24950)
[29](https://www.libhunt.com/compare-msw-vs-mockoon)
[30](https://bun.com/docs/guides/test/testing-library)
[31](https://github.com/oven-sh/bun/discussions/3493)
[32](https://zuplo.com/learning-center/top-api-mocking-frameworks)
[33](https://www.reddit.com/r/coding/comments/1ehbpvf/how_are_we_properly_testing_something_if_by/)
[34](https://stackoverflow.com/questions/77304283/how-can-i-mock-bun-global-object-with-jest)
[35](https://www.reddit.com/r/typescript/comments/1ei9f4a/is_it_me_or_mocking_everything_everywhere_in/)
[36](https://bun.sh/reference/node/test/default/MockFunctionContext/mockImplementation)
[37](https://www.reddit.com/r/programming/comments/1e734ma/mocking_is_an_antipattern/)
[38](https://www.geeksforgeeks.org/system-design/dependency-injection-vs-factory-pattern/)
[39](https://www.reddit.com/r/javascript/comments/1astjz2/askjs_any_emerging_new_libraries_to_replace_jest/)
[40](https://stackoverflow.com/questions/36487867/how-to-write-factories-which-follow-the-dependency-injection-pattern)
[41](https://stackoverflow.com/questions/64818305/simple-fetch-mock-using-typescript-and-jest)
[42](https://stackoverflow.com/questions/557742/dependency-injection-vs-factory-pattern)
[43](https://github.com/oven-sh/bun/issues/7035)