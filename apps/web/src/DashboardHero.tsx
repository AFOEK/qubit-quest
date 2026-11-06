import { ArrowRight, Clock3, FlaskConical, Network, Sparkles, Zap } from 'lucide-react';

type Props = {
  name?: string;
  title: string;
  course: string;
  time: number;
  completed: number;
  finished: boolean;
  totalCourses: number;
  onStart: () => void;
  onLab: () => void;
};

function SignalNetwork() {
  return (
    <svg className="signal-network" viewBox="0 0 420 330" aria-hidden="true">
      <defs>
        <radialGradient id="quantum-core">
          <stop stopColor="#4c6cc9" stopOpacity=".3" />
          <stop offset="1" stopColor="#111d35" stopOpacity=".05" />
        </radialGradient>
        <pattern id="quantum-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".8" fill="#7594c5" opacity=".24" />
        </pattern>
      </defs>
      <rect width="420" height="330" fill="url(#quantum-grid)" />
      <circle cx="230" cy="162" r="112" fill="url(#quantum-core)" />
      <g className="signal-traces" fill="none" stroke="#324767" strokeWidth="1.2">
        <path d="M26 163H90Q112 163 112 143V99Q112 79 135 79H181" />
        <path d="M26 163H181" />
        <path d="M258 163H296Q316 163 316 142V93Q316 73 338 73H396" />
        <path d="M258 163H296Q316 163 316 184V231Q316 251 338 251H396" />
        <path d="M220 206V272Q220 290 241 290H275" strokeDasharray="4 6" />
      </g>
      <g className="signal-pulses" fill="none" strokeWidth="2">
        <path className="signal-packet" d="M26 163H181" stroke="#77e7ff" />
        <path
          className="signal-packet packet-b"
          d="M258 163H296Q316 163 316 142V93Q316 73 338 73H396"
          stroke="#77e7ff"
        />
        <path
          className="signal-packet packet-c"
          d="M258 163H296Q316 163 316 184V231Q316 251 338 251H396"
          stroke="#b6a4ff"
        />
      </g>
      <g className="network-ports" fill="#101d32" stroke="#5c7fac">
        <circle cx="26" cy="163" r="5" />
        <circle cx="396" cy="73" r="5" />
        <circle cx="396" cy="251" r="5" />
        <circle cx="275" cy="290" r="4" />
      </g>
      <g className="network-gate">
        <rect x="62" y="141" width="45" height="44" rx="9" fill="#182e46" stroke="#5da8c5" />
        <text x="84" y="169" textAnchor="middle" fill="#a7f0ff">
          H
        </text>
      </g>
      <g className="network-core">
        <circle cx="220" cy="163" r="51" fill="#182642" stroke="#8f9ee6" />
        <ellipse
          cx="220"
          cy="163"
          rx="51"
          ry="17"
          fill="none"
          stroke="#8f9ee6"
          opacity=".6"
          transform="rotate(-28 220 163)"
        />
        <ellipse
          cx="220"
          cy="163"
          rx="18"
          ry="51"
          fill="none"
          stroke="#70cde7"
          opacity=".6"
          transform="rotate(-28 220 163)"
        />
        <path d="M220 163L252 126" stroke="#8ceaff" strokeWidth="2.5" />
        <circle cx="252" cy="126" r="5" fill="#aff3ff" />
      </g>
      <g className="network-labels" fontSize="12" fontFamily="monospace" fill="#a9bedc">
        <text x="17" y="139">
          |0⟩
        </text>
        <text x="350" y="59">
          |0⟩
        </text>
        <text x="350" y="278">
          |1⟩
        </text>
        <text x="139" y="64">
          phase
        </text>
        <text x="282" y="294">
          state
        </text>
      </g>
      <text x="220" y="25" textAnchor="middle" fill="#a1b7d7" fontSize="10" fontFamily="monospace">
        |ψ⟩ = α|0⟩ + β|1⟩
      </text>
    </svg>
  );
}

export function DashboardHero(props: Props) {
  return (
    <>
      <div className="page-heading dashboard-heading">
        <div>
          <p className="hello">
            {props.name ? `Welcome back, ${props.name.split(' ')[0]}.` : 'Your quantum workspace'}
          </p>
          <h1>Think beyond the bit.</h1>
          <p>Trace the state. Apply the gate. Understand the result.</p>
        </div>
        <div className="pace-note">
          <Network size={20} />
          <span>
            {props.totalCourses} connected courses<strong>One idea at a time</strong>
          </span>
        </div>
      </div>
      <section className="hero quantum-hero" aria-labelledby="next-discovery">
        <div className="hero-copy">
          <span className="lesson-kicker">
            <span className="live-dot" />
            {props.finished
              ? 'Trail complete'
              : props.completed
                ? 'Pick up where you left off'
                : 'Your first discovery'}
          </span>
          <p className="hero-course">{props.course}</p>
          <h2 id="next-discovery">{props.title}</h2>
          <div className="hero-meta">
            <span>
              <Clock3 size={15} />
              {props.time} min
            </span>
            <span>
              <Zap size={15} />
              {props.finished ? 'Review at your pace' : '+25 XP'}
            </span>
            <span>
              <Sparkles size={15} />
              Interactive lesson
            </span>
          </div>
          <div className="hero-actions">
            <button className="primary" onClick={props.onStart}>
              {props.finished
                ? 'Review a lesson'
                : props.completed
                  ? 'Continue learning'
                  : 'Let’s get started'}
              <ArrowRight size={19} />
            </button>
            <button className="hero-lab-link" onClick={props.onLab}>
              <FlaskConical size={17} />
              Explore the lab
            </button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <SignalNetwork />
          <span className="state-caption">Explore the possibilities.</span>
        </div>
      </section>
    </>
  );
}
