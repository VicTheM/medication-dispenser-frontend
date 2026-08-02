import { Schedule, Compartment } from "../api/types";

const LETTERS: Compartment[] = ["A", "B", "C", "D", "E", "F", "G"];

interface CompartmentStripProps {
  schedules: Schedule[];
  onSelect?: (letter: Compartment) => void;
  highlightNow?: boolean;
  missedCompartments?: Set<string>;
}

function currentTimeHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function CompartmentStrip({ schedules, onSelect, highlightNow, missedCompartments }: CompartmentStripProps) {
  const now = currentTimeHHMM();
  const byLetter = new Map(schedules.map((s) => [s.compartment, s]));

  return (
    <div className="cstrip" role="list" aria-label="Compartment schedule A through G">
      {LETTERS.map((letter) => {
        const s = byLetter.get(letter);
        const isMissed = missedCompartments?.has(letter);
        const isNow = highlightNow && s && Math.abs(timeDiffMinutes(s.dispense_time, now)) <= 20;
        const classes = [
          "cstrip-cell",
          onSelect ? "clickable" : "",
          s ? "filled" : "empty",
          isMissed ? "missed" : "",
          isNow && !isMissed ? "active-now" : "",
        ].filter(Boolean).join(" ");
        return (
          <button
            key={letter}
            type="button"
            role="listitem"
            className={classes}
            style={s ? { background: `var(--c-${letter.toLowerCase()})`, borderColor: `var(--c-${letter.toLowerCase()})` } : undefined}
            onClick={() => onSelect?.(letter)}
            disabled={!onSelect}
            title={s ? `${s.medication_names.join(", ")} at ${s.dispense_time}` : `Compartment ${letter} — empty`}
          >
            <span className="cstrip-letter">{letter}</span>
            <span className="cstrip-time">{s ? s.dispense_time : "—"}</span>
          </button>
        );
      })}
    </div>
  );
}

function timeDiffMinutes(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return (ah * 60 + am) - (bh * 60 + bm);
}
