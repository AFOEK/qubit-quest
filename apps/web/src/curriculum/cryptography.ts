import type { Course } from './types';

export const cryptography: Course[] = [
  {
    id: 'cryptography-1',
    title: 'Cryptography I',
    track: 'applications',
    icon: '⌘',
    color: 'lavender',
    description:
      'Use nonorthogonal states and entanglement to understand quantum key distribution, from BB84 and B92 to E91 and device-independent security.',
    prerequisites: ['algorithms-1'],
    outcomes: [
      'Explain no-cloning and the role of authenticated classical communication.',
      'Trace sifting, testing, reconciliation, and privacy amplification in QKD.',
      'Compare prepare-and-measure, entanglement-based, and device-independent protocols.',
    ],
    lessons: [
      {
        id: 'no-cloning',
        title: 'No-cloning: why unknown states cannot be copied',
        time: 8,
        level: 'Core',
        topics: [
          'No-cloning theorem',
          'No-cloning theorems',
          'Nonorthogonal states',
          'Quantum cryptography',
        ],
        body: [
          'No single physical operation can perfectly copy every unknown quantum state. A unitary copying machine would have to preserve overlaps while producing two copies, which changes the overlap for nonorthogonal inputs.',
          'Known orthogonal states can be copied in a chosen basis: CX copies a computational-basis bit into a blank target. On a superposed input, the same circuit generally creates entanglement instead of independent copies. No-cloning helps explain QKD security, but a complete protocol also needs authentication, testing, and a security analysis.',
        ],
        math: {
          formula: 'If U|ψ⟩|0⟩ = |ψ⟩|ψ⟩, then |⟨ψ|φ⟩| = |⟨ψ|φ⟩|²',
          explanation:
            'For distinct nonorthogonal states the overlap magnitude lies strictly between 0 and 1, contradicting this condition.',
        },
        example:
          'CX acting on |+⟩|0⟩ gives (|00⟩+|11⟩)/√2. Two independent copies |+⟩|+⟩ would instead have four equal computational-basis amplitudes.',
        practice: {
          prompt:
            'For |0⟩ and |+⟩, compare their overlap magnitude with the overlap magnitude of the proposed two-copy outputs.',
          answer:
            'The input overlap is 1/√2. Two copies would have overlap (1/√2)² = 1/2, so a unitary cannot perform both cloning transformations.',
        },
        question: 'What happens when CX tries to copy a |+⟩ control into a |0⟩ target?',
        answers: [
          'It creates an entangled pair',
          'It creates two independent |+⟩ states',
          'It reveals the input amplitudes',
        ],
        correct: 0,
        why: 'The output is a Bell state, not the product of two copies. Copying a classical basis value does not provide a universal quantum cloner.',
        followUp: ['bb84', 'b92'],
      },
      {
        id: 'qkd',
        title: 'QKD: from quantum signals to a secret key',
        time: 9,
        level: 'Introduction',
        topics: [
          'QKD',
          'Quantum key distribution',
          'Sifting',
          'Privacy amplification',
          'Authentication',
        ],
        body: [
          'Quantum key distribution lets two parties establish a shared secret key using quantum signals and authenticated classical messages. It distributes key material; a separate encryption scheme uses that key to protect a message.',
          'After detection, the parties sift compatible measurements, sacrifice a sample for parameter estimation, reconcile remaining errors, and shorten the key by privacy amplification. If the security test fails, they abort. Authentication is essential: without it an attacker can impersonate each party, even if the quantum devices work ideally.',
        ],
        math: {
          formula: 'For equal random X/Z basis choices: P(same basis) = 1/2',
          explanation:
            'This is the ideal BB84 sifting fraction, not a universal QKD key rate. Loss, testing, reconciliation leakage, and finite-size privacy analysis reduce the final secret-key yield.',
        },
        example:
          'From 1,000 detected BB84 signals, roughly 500 may survive basis sifting. Sacrificing 100 of those for testing leaves 400 before reconciliation and privacy amplification; the final secret key will generally be shorter.',
        practice: {
          prompt:
            'Does publishing the measurement bases eliminate the need to authenticate the classical channel?',
          answer:
            'No. Basis announcements may be public, but they must be authenticated so an attacker cannot substitute messages or run separate sessions with each party.',
        },
        question: 'What does QKD primarily establish?',
        answers: [
          'A direct quantum copy of every message',
          'A shared secret key after security processing',
          'Authentication without any prior trust mechanism',
        ],
        correct: 1,
        why: 'QKD produces key material under stated assumptions. Authentication and subsequent message encryption have separate roles.',
      },
      {
        id: 'bb84',
        title: 'BB84: two bases, four signal states',
        time: 11,
        level: 'Application',
        topics: ['BB84', 'Prepare-and-measure QKD', 'Quantum bit error rate', 'QBER'],
        body: [
          'Alice encodes random bits in the Z basis {|0⟩,|1⟩} or X basis {|+⟩,|−⟩}. Bob independently chooses a measurement basis. They announce bases over an authenticated channel and keep matching-basis events.',
          'A wrong-basis measurement cannot reliably reveal the encoded bit and disturbs the signal. In the simple ideal intercept-and-resend attack with Eve choosing a random basis on every signal, the sifted error rate is 25%. Real QBER also includes ordinary noise; security thresholds depend on the protocol, device assumptions, and finite-size analysis.',
        ],
        math: {
          formula:
            'QBER = mismatched test bits / compared test bits;  QBERintercept-resend = (1/2)(1/2) = 1/4',
          explanation:
            'Eve chooses the wrong basis half the time; those events cause a wrong matching-basis bit half the time in this attack model.',
        },
        example:
          'Alice sends bit 1 in X, preparing |−⟩. If Bob chooses X, his ideal result is 1. If he chooses Z, his result is random and that event is discarded during basis sifting.',
        practice: {
          prompt:
            'Alice uses bases Z,X,X,Z with bits 0,1,0,1. Bob chooses Z,Z,X,X. Which positions survive sifting?',
          answer:
            'Positions 1 and 3. With ideal signals and readout, the retained bits are 0 and 0. A subset must still be tested before deriving a secret key.',
        },
        question: 'Which events form the ideal BB84 sifted data?',
        answers: [
          'Only events where Alice sent 0',
          'Every event regardless of basis',
          'Events with matching preparation and measurement bases',
        ],
        correct: 2,
        why: 'Matching bases make the bit predictable in the ideal protocol; incompatible bases do not.',
      },
      {
        id: 'e91',
        title: 'E91: distribute entanglement, test correlations',
        time: 11,
        level: 'Application',
        topics: ['E91', 'Entanglement-based QKD', 'Bell tests', 'Singlet state'],
        body: [
          'E91 uses shared entangled pairs and different measurement settings. Some compatible settings contribute key data, while other correlations support a Bell-inequality test. For a singlet, matching-axis outcomes are opposite, so one party flips their bit to align the key.',
          'Entanglement-based key distribution connects the earlier Bell lessons to communication. Interpreting the observed correlations still requires a protocol-specific security proof and treatment of device behavior, losses, and finite statistics. An arbitrary Bell-pair histogram is not by itself a secure-key demonstration.',
        ],
        math: {
          formula: '|Ψ−⟩ = (|01⟩−|10⟩)/√2;  ⟨Z⊗Z⟩ = −1',
          explanation:
            'For the singlet, ideal measurements along the same axis are perfectly anticorrelated. Suitable CHSH settings can attain |S| = 2√2.',
        },
        example:
          'If Alice and Bob measure the singlet in Z and Alice obtains 0, Bob obtains 1. Flipping Bob’s bit makes their candidate key bits agree.',
        practice: {
          prompt:
            'The existing Bell lab prepares |Φ⁺⟩, not the singlet. Should its Z outcomes be anticorrelated?',
          answer:
            'No. |Φ⁺⟩ gives correlated 00/11 outcomes. E91’s singlet convention gives 01/10. The state and decoding convention must be declared.',
        },
        question: 'For an ideal singlet measured in the same Z basis, how do the two bits relate?',
        answers: ['They are opposite', 'They are always both zero', 'They are independent'],
        correct: 0,
        why: 'Only 01 and 10 occur for |Ψ−⟩. One party can invert their bit to obtain aligned candidate key data.',
        followUp: ['device-independent-qkd'],
      },
      {
        id: 'b92',
        title: 'B92: two nonorthogonal states and inconclusive results',
        time: 11,
        level: 'Application',
        topics: ['B92', 'Nonorthogonal signal states', 'Unambiguous state discrimination'],
        body: [
          'B92 uses two nonorthogonal signal states, such as |0⟩ and |+⟩. Bob sometimes obtains a result that rules out one candidate with certainty, and sometimes obtains an inconclusive result.',
          'For a simple receiver, Bob randomly measures Z or X. A Z result 1 rules out |0⟩, identifying |+⟩; an X result − rules out |+⟩, identifying |0⟩. Other results are discarded. Loss and inconclusive outcomes are central to the security analysis; accepting every detection would defeat this inference rule.',
        ],
        math: {
          formula: '|⟨0|+⟩| = 1/√2;  P(conclusive) = (1/2)(1/2) = 1/4',
          explanation:
            'The conclusive fraction is for this particular random-basis receiver with ideal signals, not the optimum over all possible measurements.',
        },
        example:
          'If Alice sends |0⟩ and Bob chooses X, outcome |−⟩ occurs with probability 1/2. It could not arise from a |+⟩ input in an ideal X measurement, so it identifies Alice’s signal.',
        practice: {
          prompt:
            'Bob chooses Z and obtains 0. Can he distinguish input |0⟩ from input |+⟩ from this event alone?',
          answer:
            'No. Both inputs can produce Z outcome 0. This event is inconclusive under the stated receiver rule.',
        },
        question: 'Why are some B92 measurement results discarded?',
        answers: [
          'Because only bit 1 is useful',
          'They do not uniquely identify either signal state',
          'Because both signals are orthogonal',
        ],
        correct: 1,
        why: 'Nonorthogonal inputs cannot always be identified perfectly. Conclusive outcomes exclude one candidate; the others do not.',
      },
      {
        id: 'device-independent-qkd',
        title: 'Device-independent QKD: security from tested behavior',
        time: 12,
        level: 'Introduction',
        topics: ['Device-independent QKD', 'DIQKD', 'CHSH', 'Detection loophole'],
        body: [
          'Device-independent QKD derives security bounds from observed nonlocal correlations without requiring a detailed trusted model of each measurement device’s internals. Bell-test statistics help bound an adversary’s information.',
          'It still requires assumptions: isolated secure laboratories, authenticated classical communication, suitably independent random choices, and a security proof handling losses and finite data. Discarding inconvenient nondetections can open a detection loophole. A CHSH violation alone does not automatically certify a positive finite secret-key length.',
        ],
        math: {
          formula: 'Local correlations: |S| ≤ 2;  quantum maximum: |S| ≤ 2√2',
          explanation:
            'S is the CHSH combination introduced in Quantum Mechanics. A key-rate bound also uses error rates, sample size, and the chosen protocol’s assumptions.',
        },
        example:
          'An observed |S| = 2.4 exceeds the local bound under a valid test. To claim a secret key, the parties must also bound uncertainty, account for detections, reconcile errors, and apply the protocol’s privacy analysis.',
        practice: {
          prompt: 'Does “device-independent” mean the parties can trust no assumptions at all?',
          answer:
            'No. They relax the internal-device model, while still relying on lab isolation, authentication, appropriate randomness, and a valid statistical/security analysis.',
        },
        question: 'Which assumption remains necessary in the DIQKD setting described here?',
        answers: [
          'A perfect description of every detector component',
          'Publishing the final key to verify it',
          'Authenticated classical communication',
        ],
        correct: 2,
        why: 'Device independence does not remove the need to prevent impersonation on the classical channel.',
      },
    ],
  },
  {
    id: 'cryptography-2',
    title: 'Cryptography II',
    track: 'applications',
    icon: '⌗',
    color: 'lavender',
    description:
      'Compare post-quantum algorithms running on classical computers: lattice-based key establishment/signatures, hash-based signatures, and code-based cryptography.',
    prerequisites: ['cryptography-1', 'algorithms-2'],
    outcomes: [
      'Distinguish post-quantum cryptography from QKD and quantum hardware.',
      'Explain the mathematical assumptions behind lattice, hash, and code families.',
      'Separate key encapsulation from signatures and recognize standardized scheme names.',
    ],
    lessons: [
      {
        id: 'post-quantum-cryptography',
        title: 'Post-quantum cryptography: classical algorithms for a quantum threat',
        time: 10,
        level: 'Introduction',
        topics: ['Post-quantum cryptography', 'PQC', 'Key encapsulation', 'Digital signatures'],
        body: [
          'Post-quantum cryptography uses classical algorithms designed to resist known classical and quantum attacks. It differs from QKD: the parties do not need to transmit quantum states. Shor’s algorithm motivates replacing vulnerable factoring- and discrete-log-based public-key systems; Grover’s algorithm affects symmetric search costs differently.',
          'A key encapsulation mechanism (KEM) establishes a shared secret for subsequent symmetric encryption. A digital signature authenticates a message. NIST’s ML-KEM, ML-DSA, and SLH-DSA are examples of standardized post-quantum schemes with distinct roles. Security depends on the specified scheme, parameters, and implementation, rather than the family name alone.',
        ],
        math: {
          formula: '(ct,K) ← Encaps(pk);  K′ ← Decaps(sk,ct);  honest execution: K′ = K',
          explanation:
            'pk/sk are the recipient’s public/secret key, ct is the encapsulation ciphertext, and K is shared key material. A KEM alone does not authenticate the peer.',
        },
        example:
          'A protocol can use ML-KEM to establish key material and an appropriate signature scheme to authenticate the handshake, then protect application data with symmetric authenticated encryption.',
        practice: {
          prompt: 'Does a laptop need a quantum processor to use an ML-KEM implementation?',
          answer:
            'No. Post-quantum algorithms execute on classical hardware. Their design targets an adversary who may have quantum computing capabilities.',
        },
        question: 'Which statement describes post-quantum cryptography?',
        answers: [
          'Classical cryptographic algorithms designed against known quantum attacks',
          'Encryption that always sends entangled photons',
          'A synonym for BB84',
        ],
        correct: 0,
        why: 'PQC changes classical cryptographic constructions and assumptions; QKD uses quantum communication.',
      },
      {
        id: 'lattice-cryptography',
        title: 'Lattice-based cryptography and noisy equations',
        time: 11,
        level: 'Core',
        topics: ['Lattice-based cryptography', 'Learning with errors', 'LWE', 'ML-KEM', 'ML-DSA'],
        body: [
          'A lattice is a structured set of integer combinations of basis vectors. Many lattice-based constructions use problems related to recovering information from modular linear equations with deliberately added small errors.',
          'Learning with errors illustrates the idea; practical module-lattice schemes add specific algebraic structure and carefully selected distributions and parameters. ML-KEM and ML-DSA serve different purposes and rely on specified assumptions, including module-LWE and, for signatures, related short-vector problems. The tiny arithmetic example below demonstrates noise, not cryptographic hardness.',
        ],
        math: {
          formula: 'b = As + e mod q',
          explanation:
            'A is public, s is a secret vector, e is a small error vector, and arithmetic wraps modulo q. High-dimensional parameterized instances underpin the security assumptions.',
        },
        example:
          'In a one-dimensional toy equation with q = 7, A = 3, s = 2, and e = 1, b = 0 mod 7. Ignoring the error and solving 3s = 0 would suggest s = 0, not the actual secret 2.',
        practice: {
          prompt:
            'For the same toy values with e = 0, calculate b and recover s using 3⁻¹ = 5 mod 7.',
          answer:
            'b = 6. Then s = 5×6 mod 7 = 2. Small noisy toy equations remain easy to explore; practical security uses much larger specified instances.',
        },
        question: 'What does the e term represent in the illustrative LWE equation?',
        answers: [
          'The final message signature',
          'A deliberately introduced small error',
          'A quantum measurement gate',
        ],
        correct: 1,
        why: 'Recovering the secret from noisy modular equations motivates the learning-with-errors assumption.',
      },
      {
        id: 'hash-signatures',
        title: 'Hash-based signatures and one-time key logic',
        time: 11,
        level: 'Core',
        topics: ['Hash-based signatures', 'Lamport signatures', 'Merkle trees', 'SLH-DSA'],
        body: [
          'A hash-based signature builds authentication from cryptographic hash properties. In a toy Lamport one-time signature, each message-digest bit selects one of two secret values to reveal, and verification checks it against a published hash.',
          'Merkle trees combine many verification keys under one authenticated root. Modern designs specify how to manage many signatures: some schemes are stateful, while the standardized SLH-DSA is stateless and uses a more elaborate hash-based construction. Reusing a one-time signing key for different digests can expose both secret alternatives.',
        ],
        math: {
          formula: 'public values: H(sᵢ,₀), H(sᵢ,₁);  digest bit bᵢ selects revealed secret sᵢ,bᵢ',
          explanation:
            'This describes the teaching example, not the complete SLH-DSA algorithm. Verification hashes the revealed value and compares the selected public entry.',
        },
        example:
          'A three-bit digest 101 selects secret values s₀,₁, s₁,₀, s₂,₁. Signing another digest with the same one-time key can reveal additional values and undermine its security.',
        practice: {
          prompt: 'What does a Merkle authentication path let a verifier check?',
          answer:
            'That a leaf verification key belongs to the tree committed by the trusted root hash. It does not make arbitrary reuse of a one-time signing key safe.',
        },
        question:
          'Which operation lets a verifier check a revealed Lamport secret against its public value?',
        answers: [
          'Cloning the signer’s state',
          'Running Shor’s algorithm',
          'Hashing the revealed value',
        ],
        correct: 2,
        why: 'The public key commits to hashes of the secret values; the selected preimage is revealed during signing.',
      },
      {
        id: 'code-based-cryptography',
        title: 'Code-based cryptography and syndrome decoding',
        time: 11,
        level: 'Core',
        topics: [
          'Code-based cryptography',
          'Syndrome decoding',
          'McEliece',
          'Error-correcting codes',
        ],
        body: [
          'Code-based cryptography uses the difficulty of decoding certain error-corrupted words without secret structure. A parity-check matrix maps an error vector to a syndrome, and recovering a low-weight error from that syndrome illustrates the underlying task.',
          'Schemes such as the McEliece family use a code structure that helps the key holder decode while concealing useful structure from an attacker. Parameter choice, key sizes, and the exact construction matter. This differs from quantum error correction: cryptography seeks hard decoding for an outsider, while a QEC decoder is deliberately available for the modeled physical errors.',
        ],
        math: {
          formula: 's = Heᵀ mod 2;  recover e with small Hamming weight',
          explanation:
            'H is a binary parity-check matrix here, not a Hadamard gate. Hamming weight counts the nonzero bits of e.',
        },
        example:
          'For H = [[1,1,0],[0,1,1]] and e = [0,1,0], the syndrome is [1,1]. The weight-two error [1,0,1] gives the same syndrome, showing why the weight constraint matters.',
        practice: {
          prompt: 'Using the example H, calculate the syndrome of e = [1,0,0].',
          answer: 's = [1,0]. It is the first column of H because only the first error bit is set.',
        },
        question:
          'What extra condition is important when recovering an error vector from a syndrome?',
        answers: [
          'A constraint such as low Hamming weight',
          'All matrix entries being real amplitudes',
          'Measuring the syndrome as a Bell state',
        ],
        correct: 0,
        why: 'Many vectors can share a syndrome; the decoding problem includes a constraint on the allowed errors.',
      },
    ],
  },
];
