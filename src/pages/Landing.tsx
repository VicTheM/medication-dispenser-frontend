import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Compartment } from "../api/types";

const LETTERS: Compartment[] = ["A", "B", "C", "D", "E", "F", "G"];
const DEMO_SCHEDULE: Record<string, { med: string; time: string }> = {
  A: { med: "Metformin 500mg", time: "07:30" },
  B: { med: "Lisinopril 10mg", time: "07:30" },
  D: { med: "Vitamin D", time: "13:00" },
  F: { med: "Atorvastatin 20mg", time: "20:00" },
};

function HeroVisual() {
  const [filled, setFilled] = useState<string[]>([]);

  useEffect(() => {
    const keys = Object.keys(DEMO_SCHEDULE);
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % (keys.length + 1);
      setFilled(keys.slice(0, i));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-visual">
      <div className="hero-visual-head">
        <span className="eyebrow" style={{ marginBottom: 0 }}>Live from device</span>
        <span className="device-name">DEV-2201 · online</span>
      </div>
      <div className="cstrip" aria-hidden="true">
        {LETTERS.map((l) => {
          const demo = DEMO_SCHEDULE[l];
          const isFilled = demo && filled.includes(l);
          return (
            <div
              key={l}
              className={`cstrip-cell ${isFilled ? "filled" : demo ? "" : "empty"}`}
              style={isFilled ? { background: `var(--c-${l.toLowerCase()})`, borderColor: `var(--c-${l.toLowerCase()})` } : undefined}
            >
              <span className="cstrip-letter">{l}</span>
              <span className="cstrip-time">{demo ? demo.time : "—"}</span>
            </div>
          );
        })}
      </div>
      <div className="hero-visual-caption">
        <span>7:30 AM · dispensed &amp; confirmed on video</span>
        <span style={{ color: "var(--moss)", fontWeight: 600 }}>✓ Taken</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <div className="container">
        <nav className="landing-nav">
          <Link to="/" className="auth-brand" style={{ marginBottom: 0 }}>
            <span aria-hidden="true">⬢</span> MedAdhere
          </Link>
          <div className="links">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#audience">Who it's for</a>
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
          </div>
        </nav>
      </div>

      <header className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">For families managing medication at a distance</span>
            <h1>Medication that keeps <em>its promises.</em></h1>
            <p className="hero-sub">
              MedAdhere pairs a 7-compartment dispenser with real-time confirmation, so
              you don't have to guess whether a dose was taken — you'll know, the moment it happens.
            </p>
            <div className="hero-ctas">
              <Link to="/register" className="btn btn-primary">Set up a patient</Link>
              <Link to="/login" className="btn btn-ghost">I'm a patient</Link>
            </div>
            <p className="hero-note">No credit card required. Works with the MedAdhere dispenser hardware.</p>
          </div>
          <HeroVisual />
        </div>
      </header>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Three steps, then it runs itself.</h2>
            <p>Once a schedule is set, the device dispenses and confirms on its own — no app to open, no button to remember.</p>
          </div>
          <div className="steps">
            <div className="step">
              <span className="step-num">01</span>
              <h3>Enrol &amp; hand over the device</h3>
              <p>Add a patient, hand them their dispenser, and it pairs to their account automatically.</p>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <h3>Build the schedule</h3>
              <p>Assign medications to any of the 7 compartments and set dispense times — changes sync to the device in real time.</p>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <h3>Dispense, confirm, relax</h3>
              <p>The device dispenses on schedule, records a short confirmation clip, and alerts you the moment something's off.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Built for peace of mind</span>
            <h2>Everything adherence tracking should have included from the start.</h2>
          </div>
          <div className="features">
            <div className="card feature-card">
              <div className="icon-mark" style={{ background: "var(--horizon-tint)", color: "var(--horizon)" }}>⏱</div>
              <h3>Autonomous dispensing</h3>
              <p>Schedules live on the device itself, so doses go out on time even if Wi-Fi drops.</p>
            </div>
            <div className="card feature-card">
              <div className="icon-mark" style={{ background: "var(--moss-tint)", color: "var(--moss)" }}>▶</div>
              <h3>Video-confirmed adherence</h3>
              <p>A short clip after every dispense — actual confirmation, not just a "dispensed" timestamp.</p>
            </div>
            <div className="card feature-card">
              <div className="icon-mark" style={{ background: "var(--dawn-tint)", color: "#a06526" }}>◈</div>
              <h3>Ask-anything voice assistant</h3>
              <p>Patients can ask the device a question out loud and get a spoken answer, grounded in their own care plan.</p>
            </div>
            <div className="card feature-card">
              <div className="icon-mark" style={{ background: "var(--clay-tint)", color: "var(--clay)" }}>◔</div>
              <h3>Real alerts, not noise</h3>
              <p>Missed doses, low battery, and offline devices surface immediately — everything else stays quiet.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="audience">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Two views, one source of truth</span>
            <h2>Caregivers configure. Patients see everything, unaltered.</h2>
          </div>
          <div className="audience-grid">
            <div className="card audience-card">
              <span className="tag" style={{ color: "var(--horizon)" }}>For caregivers</span>
              <h3>Full control, from anywhere</h3>
              <p>Enrol patients, manage medications and schedules, and watch adherence in real time.</p>
              <ul>
                <li>Assign hardware and push schedule changes instantly</li>
                <li>Review dispense logs, telemetry, and confirmation video</li>
                <li>Feed the assistant your own care-plan documents</li>
              </ul>
            </div>
            <div className="card audience-card">
              <span className="tag" style={{ color: "var(--moss)" }}>For patients</span>
              <h3>Clear, read-only, no surprises</h3>
              <p>See exactly what's been set up — nothing to configure, nothing to break.</p>
              <ul>
                <li>Today's schedule, at a glance, in the compartment view</li>
                <li>A full history of what was taken and when</li>
                <li>Ask a question out loud, anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Set up your first patient today.</h2>
            <p>It takes about five minutes to enrol a patient, assign a device, and build their first schedule.</p>
            <div className="hero-ctas">
              <Link to="/register" className="btn btn-accent">Create a caregiver account</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="container">
        <div className="landing-footer">
          <span>© {new Date().getFullYear()} MedAdhere. Built for care that shows up on time.</span>
          <span>Not a substitute for professional medical advice.</span>
        </div>
      </footer>
    </div>
  );
}
