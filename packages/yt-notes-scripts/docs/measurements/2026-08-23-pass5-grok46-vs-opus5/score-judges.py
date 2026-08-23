#!/usr/bin/env python3
"""Deblindet die Richter-Berichte und zaehlt Urteile und Fundzahlen aus.

Aufruf (aus dem Mess-Verzeichnis):
    python3 score-judges.py
Schreibt judge-scores.json und eine Tabelle auf stdout.
"""
import json
import os
import re
import sys
from collections import Counter, defaultdict

HIER = os.path.dirname(os.path.abspath(__file__))
ZUORDNUNG = json.load(open(os.path.join(HIER, "judge", "_zuordnung.json"), encoding="utf-8"))
METAS = {m["youtubeId"]: m for m in json.load(open(os.path.join(HIER, "meta", "_index.json"), encoding="utf-8"))}

KRITERIEN = ["Treue", "Vollstaendigkeit", "Vollständigkeit", "Praezision", "Präzision", "Regeltreue"]
NORM = {
    "Treue": "treue",
    "Vollstaendigkeit": "vollstaendigkeit",
    "Vollständigkeit": "vollstaendigkeit",
    "Praezision": "praezision",
    "Präzision": "praezision",
    "Regeltreue": "regeltreue",
}
ZAEHL_ABSCHNITTE = {
    "nicht gedeckte aussagen": "nicht_gedeckt",
    "eigene spekulation": "spekulation",
    "fehlende wichtige inhalte": "fehlend",
}


def urteil_zeilen(text):
    """Gibt {kriterium: 'A'|'B'|'gleich'} aus dem Abschnitt '## Urteil'."""
    m = re.search(r"^##\s*Urteil\s*$(.*)", text, re.M | re.S)
    if not m:
        return {}
    block = m.group(1)
    out = {}
    for zeile in re.finditer(r"^-\s*\*{0,2}(\w+)\*{0,2}\s*:\s*(.*)$", block, re.M):
        krit, rest = zeile.group(1), zeile.group(2)
        if krit not in NORM:
            continue
        rest_l = rest.lower().replace("*", "")
        if rest_l.startswith("gleichwertig"):
            out[NORM[krit]] = "gleich"
        elif re.match(r"^a\s+besser", rest_l):
            out[NORM[krit]] = "A"
        elif re.match(r"^b\s+besser", rest_l):
            out[NORM[krit]] = "B"
    return out


def zaehlungen(text):
    """Gibt {abschnitt: (a, b)} aus den 'Zaehlung: A=n B=n'-Zeilen."""
    out = {}
    aktueller = None
    for zeile in text.splitlines():
        h = re.match(r"^##\s+(.*)$", zeile)
        if h:
            titel = h.group(1).strip().lower().replace("ä", "ae").replace("ü", "ue").replace("ö", "oe")
            aktueller = ZAEHL_ABSCHNITTE.get(titel)
            continue
        z = re.search(r"Z(?:ae|ä)hlung\s*:\s*A\s*=\s*(\d+)\s+B\s*=\s*(\d+)", zeile)
        if z and aktueller:
            out[aktueller] = (int(z.group(1)), int(z.group(2)))
    return out


RICHTER = sys.argv[1] if len(sys.argv) > 1 else "opus"

zeilen = []
fehlend = []
for vid, zu in ZUORDNUNG.items():
    pfad = os.path.join(HIER, "judge", f"{vid}.{RICHTER}.md")
    if not os.path.exists(pfad):
        fehlend.append(vid)
        continue
    text = open(pfad, encoding="utf-8").read()
    u = urteil_zeilen(text)
    z = zaehlungen(text)
    eintrag = {"youtubeId": vid, "art": METAS[vid]["art"], "A": zu["A"], "urteil": {}, "zaehlung": {}}
    for krit, sieger in u.items():
        eintrag["urteil"][krit] = "gleich" if sieger == "gleich" else zu[sieger]
    for abschnitt, (a, b) in z.items():
        eintrag["zaehlung"][abschnitt] = {zu["A"]: a, zu["B"]: b}
    zeilen.append(eintrag)

if fehlend and RICHTER == "opus":
    print("FEHLENDE BERICHTE:", ", ".join(fehlend), file=sys.stderr)

json.dump(
    zeilen,
    open(os.path.join(HIER, f"judge-scores-{RICHTER}.json"), "w", encoding="utf-8"),
    indent=2,
    ensure_ascii=False,
)
print(f"Richter: {RICHTER} — {len(zeilen)} Berichte\n")

# Tabelle je Video
print("id\tart\tA\ttreue\tvollst\tpraez\tregel\tnichtGedeckt g/o\tspek g/o\tfehlend g/o")
for e in zeilen:
    z = e["zaehlung"]

    def paar(k):
        d = z.get(k)
        return f"{d['grok']}/{d['opus']}" if d else "-/-"

    print(
        "\t".join(
            [
                e["youtubeId"],
                e["art"][:12],
                e["A"],
                e["urteil"].get("treue", "?"),
                e["urteil"].get("vollstaendigkeit", "?"),
                e["urteil"].get("praezision", "?"),
                e["urteil"].get("regeltreue", "?"),
                paar("nicht_gedeckt"),
                paar("spekulation"),
                paar("fehlend"),
            ]
        )
    )

# Summen
print("\n== Urteile ueber alle Videos ==")
for krit in ["treue", "vollstaendigkeit", "praezision", "regeltreue"]:
    c = Counter(e["urteil"].get(krit, "?") for e in zeilen)
    print(f"{krit:16s} grok={c['grok']}  opus={c['opus']}  gleich={c['gleich']}  fehlt={c['?']}")

print("\n== Urteile je Video-Art ==")
je_art = defaultdict(list)
for e in zeilen:
    je_art[e["art"]].append(e)
for art, es in je_art.items():
    teile = []
    for krit in ["treue", "vollstaendigkeit", "praezision", "regeltreue"]:
        c = Counter(e["urteil"].get(krit, "?") for e in es)
        teile.append(f"{krit[:6]}: g{c['grok']}/o{c['opus']}/={c['gleich']}")
    print(f"{art:32s} " + "  ".join(teile))

print("\n== Summe der gezaehlten Funde (kleiner ist besser bei 1+2, bei 3 auch) ==")
for k, name in [
    ("nicht_gedeckt", "nicht gedeckte Aussagen"),
    ("spekulation", "eigene Spekulation"),
    ("fehlend", "fehlende Inhalte"),
]:
    g = sum(e["zaehlung"][k]["grok"] for e in zeilen if k in e["zaehlung"])
    o = sum(e["zaehlung"][k]["opus"] for e in zeilen if k in e["zaehlung"])
    n = sum(1 for e in zeilen if k in e["zaehlung"])
    print(f"{name:26s} grok={g:4d}  opus={o:4d}   (aus {n}/{len(zeilen)} Berichten)")

print("\n== Positions-Kontrolle (gewinnt A haeufiger, egal wer A ist?) ==")
for krit in ["treue", "vollstaendigkeit", "praezision", "regeltreue"]:
    a_siege = sum(1 for e in zeilen if e["urteil"].get(krit) == e["A"])
    b_siege = sum(1 for e in zeilen if e["urteil"].get(krit) not in (e["A"], "gleich", None, "?"))
    print(f"{krit:16s} PositionA={a_siege}  PositionB={b_siege}")
