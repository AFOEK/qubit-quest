import { courseById, lessonById, type Lesson } from '../curriculum';
import type { MascotState } from './mascot-state';

/** Static copy introduces ideas; feedback deliberately avoids facts that could disclose an answer. */
export const topicProfiles = {
  mathematics: {
    facts: [
      'Vectors, matrices, and probabilities: a toolkit fit for quantum curiosity.',
      'Tensor products build descriptions of composite systems. More room for mathematical pawprints!',
      'An eigenvector maps to a scalar multiple of itself. A very focused mathematical cat.',
    ],
    support: 'Quantum mathematics takes practice. Let’s revisit the worked example together.',
    praise: 'Nicely reasoned! Your quantum mathematics toolkit is growing.',
    playful: 'A mathematical study break? Count me in, imaginary friends and all.',
  },
  complexNumbers: {
    facts: [
      'Complex numbers pair real and imaginary parts. An imaginary friend for a real calculation!',
      'Complex amplitudes carry phase as well as magnitude. Plenty for a curious cat to explore.',
      'Multiplying by a phase can change a complex number’s direction without changing its magnitude.',
    ],
    support: 'Complex numbers take practice. A slower pass through the example is welcome.',
    praise: 'Well reasoned about complex numbers! That deserves a friendly wave.',
    playful: 'Complex numbers? My imaginary friend brought a very real study snack.',
  },
  mechanics: {
    facts: [
      'Quantum states help us predict measurement probabilities. Curiosity is an excellent starting state.',
      'The Schrödinger equation describes quantum time evolution. A familiar name for a thoughtful cat!',
      'Entanglement produces correlations, not a faster-than-light messaging service.',
    ],
    support:
      'Quantum mechanics can feel unfamiliar. Let’s revisit the explanation without rushing.',
    praise: 'Nicely reasoned about quantum mechanics! A little more clarity, one idea at a time.',
    playful: 'Quantum mechanics has my curiosity positively entangled. Prrr…',
  },
  qubits: {
    facts: [
      'A qubit’s amplitudes depend on the basis we choose. A head tilt can be a useful reminder.',
      'A Bloch sphere visualizes a single-qubit state. My favorite sphere still contains yarn.',
      'Superposition and a classical mixture are different descriptions. Let’s explore that distinction.',
    ],
    support: 'Qubit ideas take time to settle. The worked example is a good place to pause.',
    praise: 'That’s it! Your qubit reasoning is taking shape.',
    playful: 'Qubits have state spaces. I have a very enthusiastic study face.',
  },
  gates: {
    facts: [
      'Quantum circuit symbols each have a job. Let’s meet this lesson’s building blocks.',
      'Single-qubit unitary gates can rotate a Bloch vector. A mathematical turn of the paw!',
      'Measurement records an outcome; unitary gates describe reversible transformations.',
    ],
    support: 'Gate notation can look busy. Let’s return to this lesson’s worked example.',
    praise: 'Well reasoned about quantum gates! A wave for your circuit curiosity.',
    playful: 'Quantum gates today? My paws are ready for a very small circuit dance.',
  },
  hadamard: {
    facts: [
      'Hadamard maps computational-basis states to plus/minus states. A new quantum perspective!',
      'Superposition depends on the chosen basis. A perspective change worth a head tilt.',
      'Hadamard is its own inverse. Two ideal H gates bring the state back.',
    ],
    support:
      'Hadamard takes a little getting used to. Give the explanation another unhurried look.',
    praise: 'Nicely reasoned about Hadamard! A friendly wave for a change of basis.',
    playful: 'Hadamard has a new basis. I have a new excuse to wave my paw.',
  },
  algorithms: {
    facts: [
      'Quantum algorithms arrange interference to make useful information accessible.',
      'Oracles and input assumptions matter when comparing algorithm costs. Curious cats read the fine print.',
      'A quantum algorithm needs a suitable problem; there is no universal speedup button.',
    ],
    support: 'Algorithm steps can take a few passes. Let’s reread the explanation together.',
    praise: 'Well reasoned about quantum algorithms! One more idea worth celebrating.',
    playful:
      'Quantum algorithms have my attention. My treat-search algorithm is still under review.',
  },
  grover: {
    facts: [
      'Grover uses an oracle and diffusion to amplify marked amplitudes. A theoretical treat hunt!',
      'Grover’s unstructured-search query advantage is quadratic. Assumptions still matter.',
      'More Grover iterations are not always better: the amplitudes rotate past the target too.',
    ],
    support: 'Grover’s steps can be subtle. Let’s revisit the explanation at your pace.',
    praise: 'Nicely reasoned about Grover! My hypothetical treat hunt salutes you.',
    playful: 'Grover has an oracle. I have a purely hypothetical missing-treat investigation.',
  },
  errorCorrection: {
    facts: [
      'Logical qubits can be encoded across physical qubits. Quantum teamwork!',
      'Syndrome measurements diagnose errors without directly reading the encoded logical information.',
      'Noise and decoherence make reliable quantum computing an engineering challenge.',
    ],
    support:
      'Noise and error correction involve several layers. The worked example can help untangle them.',
    praise: 'Nicely reasoned about noise and error correction! Mistakes are part of learning.',
    playful: 'Even an error-correction study partner appreciates a gentle paw break.',
  },
  mitigation: {
    facts: [
      'Error mitigation and error correction use different approaches to handling noise.',
      'Mitigation estimates can have extra sampling cost. Curious cats keep an eye on uncertainty.',
      'Readout calibration describes a measurement model; it does not promise perfect future measurements.',
    ],
    support: 'Mitigation has careful assumptions. Let’s take another look at the explanation.',
    praise: 'Well reasoned about error mitigation! Careful assumptions deserve a wave.',
    playful: 'An error-mitigation break? I’m estimating a high probability of purring.',
  },
  hardware: {
    facts: [
      'Quantum hardware brings physics, controls, and calibration together. Tiny details, big engineering jobs.',
      'Coherence times describe how long quantum information can remain useful under specified conditions.',
      'Hardware models and real devices have different limits. Curious engineers check both.',
    ],
    support: 'Hardware concepts combine many details. Let’s revisit this lesson’s explanation.',
    praise: 'Nicely reasoned about quantum hardware! Precision and patience make a good team.',
    playful: 'Quantum hardware has careful controls. My paw wave is a much simpler operation.',
  },
  cryptography: {
    facts: [
      'Post-quantum cryptography runs on classical computers. My keyboard approves.',
      'Quantum key distribution and post-quantum cryptography use different approaches to secure communication.',
      'A cryptographic security claim depends on its assumptions and threat model.',
    ],
    support: 'Cryptography involves careful assumptions. An unhurried reread is a good next step.',
    praise: 'Well reasoned about cryptography! A friendly wave from your security-minded cat.',
    playful: 'Cryptography study break: my secret snack location remains undisclosed.',
  },
  optimization: {
    facts: [
      'An objective function tells an optimizer what to improve. Mine would probably involve snacks.',
      'QAOA combines a problem cost with mixing operations. The model and parameters both matter.',
      'Variational algorithms pair circuit evaluations with classical parameter updates.',
    ],
    support: 'Optimization models can take a few passes. Let’s revisit the worked example.',
    praise: 'Nicely reasoned about optimization! Careful modeling deserves a small celebration.',
    playful: 'Optimization break! My snack objective remains strictly a thought experiment.',
  },
  chemistry: {
    facts: [
      'Quantum chemistry models electrons and molecular energies. Catnip has my curiosity.',
      'An active space chooses which orbitals and electrons a model treats explicitly.',
      'A variational energy estimate depends on the Hamiltonian, ansatz, and measurements.',
    ],
    support: 'Quantum chemistry has many moving parts. Let’s return to the explanation together.',
    praise: 'Well reasoned about quantum chemistry! One more molecular idea explored.',
    playful: 'Quantum chemistry? I wonder what makes catnip so interesting. Prrr…',
  },
  machineLearning: {
    facts: [
      'Quantum models still need data, evaluation, and a classical baseline.',
      'A quantum feature map encodes inputs into quantum states. A new way to represent data!',
      'Training performance and generalization are different questions. Curious cats ask both.',
    ],
    support:
      'Quantum machine learning brings several ideas together. The worked example is here to help.',
    praise: 'Nicely reasoned about quantum machine learning! Keep that evaluation curiosity.',
    playful: 'Machine learning study break! My paw-wave model requires no training data.',
  },
  software: {
    facts: [
      'A compiler adapts a circuit to a target’s supported operations and connectivity.',
      'Circuit syntax describes instructions; executing them still needs a suitable backend.',
      'Routing and scheduling can change a circuit’s hardware cost. Details worth a curious look!',
    ],
    support: 'Quantum software notation takes practice. Let’s reread this lesson’s example.',
    praise: 'Well reasoned about quantum software! A wave for your programming curiosity.',
    playful: 'Quantum software break: my paws have not been granted keyboard write access.',
  },
  boundaries: {
    facts: [
      'Some quantum circuits are classically simulable. Structure matters!',
      'Tensor networks represent quantum states using connected tensors; their cost depends on that structure.',
      'Classical baselines help us assess where a quantum method could be useful.',
    ],
    support: 'Simulation boundaries can be subtle. Let’s revisit the explanation without rushing.',
    praise: 'Nicely reasoned about simulation boundaries! Comparing models takes care.',
    playful: 'Classical–quantum boundaries? I’m observing from the comfortable side of the desk.',
  },
  generic: {
    facts: [
      'A new quantum idea is a good reason for a curious head tilt.',
      'A worked example can turn unfamiliar notation into something approachable.',
      'Small steps leave plenty of room for quantum curiosity.',
    ],
    support: 'There’s no rush. Let’s revisit this lesson’s worked example together.',
    praise: 'Nicely reasoned! One quantum idea at a time.',
    playful: 'A little quantum curiosity, a little purring. A fine study combination.',
  },
} as const;
export type DialogueTopic = keyof typeof topicProfiles;
export type DialogueTrigger = 'open' | 'incorrect' | 'retry' | 'correct' | 'click' | 'complete';
export type LessonContext = {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  topics: readonly string[];
  subject: string;
  topic: DialogueTopic;
};
export type DialogueEntry = {
  id: string;
  topic: DialogueTopic;
  trigger: DialogueTrigger;
  text: string;
  animation: MascotState;
};

export const courseDialogueTopics: Readonly<Record<string, DialogueTopic>> = {
  math: 'mathematics',
  'quantum-mechanics': 'mechanics',
  qubits: 'qubits',
  'gates-1': 'gates',
  'gates-2': 'gates',
  'software-compilation': 'software',
  'algorithms-1': 'algorithms',
  'algorithms-2': 'algorithms',
  'algorithms-3': 'algorithms',
  'noise-qec': 'errorCorrection',
  'error-mitigation': 'mitigation',
  'hardware-1': 'hardware',
  'hardware-2': 'hardware',
  'hardware-3': 'hardware',
  'hardware-4': 'hardware',
  'applied-optimization': 'optimization',
  'boundaries-1': 'boundaries',
  'boundaries-2': 'boundaries',
  'boundaries-3': 'boundaries',
  'cryptography-1': 'cryptography',
  'cryptography-2': 'cryptography',
  'chemistry-1': 'chemistry',
  'chemistry-2': 'chemistry',
  'chemistry-3': 'chemistry',
  'ml-1': 'machineLearning',
  'ml-2': 'machineLearning',
  'ml-3': 'machineLearning',
};
export function detectDialogueTopic(
  lesson: Pick<Lesson, 'id' | 'title' | 'topics'> & { courseId: string },
): DialogueTopic {
  const topic = Object.hasOwn(courseDialogueTopics, lesson.courseId)
    ? courseDialogueTopics[lesson.courseId]
    : 'generic';
  const metadata = [lesson.id, lesson.title, ...lesson.topics].join(' ').toLowerCase();
  if (topic === 'mathematics' && metadata.includes('complex')) return 'complexNumbers';
  if (topic === 'gates' && metadata.includes('hadamard')) return 'hadamard';
  if (topic === 'algorithms' && metadata.includes('grover')) return 'grover';
  return topic;
}
export function lessonContext(lessonId: string): LessonContext | null {
  const lesson = lessonById.get(lessonId);
  if (!lesson) return null;
  const course = courseById.get(lesson.courseId);
  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    courseId: lesson.courseId,
    courseTitle: course?.title ?? 'Quantum learning',
    topics: lesson.topics,
    subject:
      lesson.topics.find((topic) => topic.length <= 48) ?? course?.title ?? 'this quantum idea',
    topic: detectDialogueTopic(lesson),
  };
}

/** Context selection is separate from the existing animation and emotional-state rules. */
export function dialogueEntries(
  context: LessonContext | null,
  trigger: DialogueTrigger,
  animation?: MascotState,
): DialogueEntry[] {
  const topic = context?.topic ?? 'generic';
  const profile = topicProfiles[topic];
  const subject = context?.subject ?? 'this quantum idea';
  let lines: { text: string; animation: MascotState }[];
  switch (trigger) {
    case 'open':
      lines = profile.facts.map((text, index) => ({
        text,
        animation: (['curious', 'lookAround', 'happy'] as const)[index],
      }));
      break;
    case 'incorrect':
      lines = [
        profile.support,
        `Take your time with ${subject}. The worked example is here to help.`,
      ].map((text) => ({ text, animation: 'sad' }));
      break;
    case 'retry':
      lines = [
        `Still working on ${subject}? Try rereading the explanation; I’ll stay with you.`,
        `A fresh pass through the worked example can help with ${subject}. There’s no rush.`,
      ].map((text) => ({ text, animation: 'sad' }));
      break;
    case 'correct':
      lines = [
        profile.praise,
        `Nicely reasoned about ${subject}! A little more quantum confidence.`,
      ].map((text) => ({ text, animation: 'happy' }));
      break;
    case 'complete':
      lines = [
        {
          text: context
            ? `${context.lessonTitle} — complete! One quantum leap forward.`
            : 'Lesson complete! One quantum leap forward.',
          animation: 'excited',
        },
      ];
      break;
    case 'click':
      lines = [
        {
          animation: 'happy',
          text: `A wave for ${subject}! Your quantum study partner says hello.`,
        },
        { animation: 'idle', text: `A blinking break from ${subject}. Curiosity stays awake.` },
        { animation: 'curious', text: `Curious about ${subject}? My head tilt is with you.` },
        { animation: 'lookAround', text: `Let’s look at ${subject} from another angle.` },
        {
          animation: 'walking',
          text: `A tiny stroll through ${context?.courseTitle ?? 'quantum ideas'}. One idea at a time.`,
        },
        { animation: 'playful', text: profile.playful },
      ];
      break;
  }
  return lines
    .map((line, index) => ({ ...line, id: `${topic}.${trigger}.${index}`, topic, trigger }))
    .filter((line) => !animation || line.animation === animation);
}
export function createDialogueSelector() {
  const previous = new Map<string, string>();
  return (context: LessonContext | null, trigger: DialogueTrigger, animation?: MascotState) => {
    const entries = dialogueEntries(context, trigger, animation);
    if (!entries.length) return undefined;
    const key = `${context?.topic ?? 'generic'}.${trigger}.${animation ?? ''}`;
    const last = previous.get(key);
    const entry = entries[(entries.findIndex((item) => item.id === last) + 1) % entries.length];
    if (entry) previous.set(key, entry.id);
    return entry;
  };
}
