# Switch Test

Dies Testet wie Tanstack Start Server Functions Implementation mit dem Caching Problem in NextJs umgeht und wie die UI für "read-your-own-write" Szenarios aussieht.

Kurzbeschreibung des Problems mit Next v16 (Stand Januar 2026): Die neuen Caching Mechanismen funktionieren nicht wenn der Client ein schlechtes Netzwerk hat. Das ist problematisch da man dies nicht kontrollieren kann.

Szenario: Man den gleichen Daten Satz, in diesem Fall `hasDiscount`, ein mehreren Views der App sowohl sehen als auch ändern. Bei flaky oder langsamen Netzwerken ist die Frage wie die App darauf reagiert.

## Steps

- man startet auf der `/` Route
- geht man zur `/list` und `/categories` Route sieht man die default pending Komponente, zur besseren Sichtbarkeit habe ich die Einstellungen angepasst damit diese früher angezeigt wie sonst
- auf einer Seite kann man hier eine oder mehrere switches umlegen und durch das 5s delay zur anderen Seite wechseln bevor die Änderung gespeichert ist

## Ablauf

- das daten laden passiert mit einem 500ms delay und ist somit _schneller_ als das switch update! Das soll flaky Internet simulieren da man bei langsamen Internet erwarten würde das auch die Daten lange laden und somit _nach_ dem update die schon neuen Daten zurück geben.
- die `/list` Route benutzt `useTransition` um den pending state der update Aktion zu visualisieren. Wichtig ist das man hier sieht das der item spinner verschwindet obwohl der switch sich _erst umlegt_ wenn die Daten durch die Invalidierung der Route neu laden!
- legt man nun drei schalter um und geht auf die andere Seite sieht man jetzt den alten Zustand und dann werden nacheinander die Daten auch drei mal invalidiert und neu geladen. Die UI updated sicht automatisch, völlig korrekt.
- legt man jetzt die drei Schalter um, geht zur anderen seite, legt hier zwei andere schalter um und geht wieder auf die andere Seite funktioniert trotzdem alles.
- geht man wieder zurück auf die andere Seite wird hier auch alles korrekt aktualisiert.
- ein switch der auf "ein" ist und erst auf der einen Seite dann auf der anderen seite angeklickt wird, bleibt auch "aus" wenn alle Seiten mit Datenladen fertig sind

## Fazit

- im Gegensatz zu der NextJs Problematik hat diese Implementierung keine der vielfältigen Nachteile und ist Einsatz bereit.
- was noch fehlt ist eine Möglichkeit den loading state des data loaders anzuzeigen wenn im Hintergrund Daten geladen werden. Der Route state wird nicht auf `pending` gesetzt. Das kann auch sein das es nicht möglich ist und der einfachen Implementierung geschuldet ist im Gegensatz zu einer ausgefeilteren Logik die aber komplexer ist.
