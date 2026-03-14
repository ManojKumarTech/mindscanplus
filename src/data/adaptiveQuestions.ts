export interface AdaptiveTheme {
  id: string; // e.g., 'worry', 'panic'
  title: string;
  description: string;
  baseQuestion: string;
  levels: {
    [key: number]: {
      goal: string;
      questions: string[];
    };
  };
}

export const adaptiveThemes: AdaptiveTheme[] = [
  {
    id: "worry",
    title: "Cognitive Stress & Worry",
    description: "Assessing mental clutter, overthinking, and cognitive tension.",
    baseQuestion: "I worry excessively about things.",
    levels: {
      1: {
        goal: "Confirm emotional stability and healthy thinking patterns.",
        questions: [
          "Do you generally feel mentally calm throughout the day?",
          "Are you able to let go of small concerns quickly?",
          "Do problems rarely stay in your mind for long?",
          "Do you feel confident handling unexpected situations?",
          "Do you usually think clearly without mental clutter?",
          "Are you able to stay focused without worrying about future problems?",
          "Do you trust your decisions without second-guessing yourself?",
          "Do you feel relaxed when thinking about upcoming tasks?",
          "Do stressful situations rarely disturb your thoughts?",
          "Are you able to move on quickly after solving a problem?",
          "Do you sleep peacefully without repetitive thinking?",
          "Do you feel emotionally balanced most days?",
          "Do you rarely imagine worst-case scenarios?",
          "Do you feel in control of your thoughts?",
          "Do you feel mentally relaxed most of the time?"
        ]
      },
      2: {
        goal: "Detect mild worry patterns.",
        questions: [
          "Do small worries occasionally stay on your mind longer than expected?",
          "Do you sometimes replay conversations in your head?",
          "Do you occasionally think about negative possibilities?",
          "Do worries sometimes distract you briefly?",
          "Do concerns increase slightly during busy days?",
          "Do you sometimes need effort to calm your thoughts?",
          "Do worries appear occasionally before sleep?",
          "Do you sometimes feel uncertain about small decisions?",
          "Do you sometimes overthink simple situations?",
          "Do worries return even after problems are solved?",
          "Do you feel mild tension when thinking about responsibilities?",
          "Do you occasionally check things repeatedly to be sure?",
          "Do worries slightly reduce your concentration?",
          "Do you sometimes feel mentally cluttered?",
          "Do small issues sometimes feel bigger than they should?"
        ]
      },
      3: {
        goal: "Measure functional impact of worry.",
        questions: [
          "Do you find yourself worrying about multiple things during the day?",
          "Do worries interrupt your concentration?",
          "Do you struggle to stop thinking about problems?",
          "Do worries delay your ability to complete tasks?",
          "Do you often expect negative outcomes?",
          "Do you feel mentally tired from thinking too much?",
          "Do worries affect your sleep several nights a week?",
          "Do you avoid making decisions due to overthinking?",
          "Do worries affect your mood?",
          "Do you feel distracted during conversations because of worries?",
          "Do worries make it difficult to relax?",
          "Do you feel mentally preoccupied during daily activities?",
          "Do you find it difficult to stay present in the moment?",
          "Do worries return even after trying to distract yourself?",
          "Do you feel that worrying is becoming a regular habit?"
        ]
      },
      4: {
        goal: "Identify strong distress and impairment.",
        questions: [
          "Do worries dominate your thoughts most of the day?",
          "Do you feel unable to stop thinking about problems?",
          "Do worries affect your ability to work or study?",
          "Do you experience headaches or tension while worrying?",
          "Do you feel emotionally drained from overthinking?",
          "Do worries make you feel irritable or frustrated?",
          "Do you struggle to make even simple decisions?",
          "Do you repeatedly seek reassurance from others?",
          "Do worries disturb your sleep frequently?",
          "Do you imagine worst-case outcomes automatically?",
          "Do worries make you avoid certain responsibilities?",
          "Do you feel overwhelmed by the number of things on your mind?",
          "Do worries affect your relationships with others?",
          "Do you feel mentally exhausted by the end of the day?",
          "Do worries feel difficult to control most of the time?"
        ]
      },
      5: {
        goal: "Detect severe distress and possible crisis level.",
        questions: [
          "Do worries feel constant throughout the day?",
          "Do you feel mentally exhausted from thinking about problems?",
          "Do worries prevent you from completing daily tasks?",
          "Do even small problems feel overwhelming?",
          "Do worries trigger panic or intense fear?",
          "Do you feel unable to calm your thoughts?",
          "Do worries make you feel hopeless about the future?",
          "Do you struggle to sleep because your mind keeps racing?",
          "Do you feel trapped in your thoughts?",
          "Do worries cause strong physical symptoms like a racing heart?",
          "Do you feel unable to relax even when nothing is happening?",
          "Do worries affect your ability to function normally?",
          "Do you feel close to emotional breakdown due to stress?",
          "Do you avoid decisions because they feel too overwhelming?",
          "Do you feel you need help managing these thoughts?"
        ]
      }
    }
  },
  {
    id: "panic",
    title: "Panic & Sudden Anxiety",
    description: "Assessing physiological fear, sudden panic, and physical symptoms.",
    baseQuestion: "I experience panic or fear without clear reason.",
    levels: {
      1: {
        goal: "Confirm feelings of safety, physical calmness, and absence of sudden fear.",
        questions: [
          "Do you generally feel safe and relaxed in your daily environment?",
          "Is your breathing usually steady and calm?",
          "Do you feel physically comfortable when sitting still?",
          "Are you able to handle sudden noises without feeling startled?",
          "Do you feel physically grounded throughout the day?",
          "Is your resting heart rate usually calm and unnoticeable?",
          "Do you rarely feel physical tension when waking up?",
          "Are you comfortable being alone without feeling uneasy?",
          "Do you feel secure when entering new or unfamiliar places?",
          "Is your body generally free of sudden 'butterflies' in the stomach?",
          "Do you rarely experience sudden temperature changes (hot/cold flashes) without physical cause?",
          "Do you feel completely in control of your physical reactions?",
          "Are you able to fall asleep without a sense of dread?",
          "Do you rarely feel a sudden need to escape a room or situation?",
          "Do you feel physically relaxed most of the time?"
        ]
      },
      2: {
        goal: "Detect mild, occasional unease or physical jumpiness.",
        questions: [
          "Do you occasionally feel a slight flutter in your chest for no reason?",
          "Do sudden loud noises startle you more easily than they used to?",
          "Do you sometimes feel briefly uneasy when stepping into crowded spaces?",
          "Do you occasionally take a deep breath to settle mild nervous energy?",
          "Do you sometimes feel slightly 'on edge' without knowing why?",
          "Do you occasionally notice your heart beating a little faster when at rest?",
          "Do you sometimes feel a vague sense that something might go wrong?",
          "Does your body occasionally feel tense even when you are relaxing?",
          "Do you sometimes feel a sudden, brief drop in your stomach?",
          "Do you occasionally feel restless and need to move around slightly?",
          "Do you sometimes feel mildly lightheaded for a passing moment?",
          "Does minor unexpected news cause a brief spike of fear?",
          "Do you occasionally feel uncomfortable when sitting in a quiet, enclosed space?",
          "Do you sometimes clench your jaw or fists without realizing it?",
          "Do brief moments of unaccountable fear pass within a few minutes?"
        ]
      },
      3: {
        goal: "Measure functional impact of sudden anxiety and noticeable physical symptoms.",
        questions: [
          "Do you frequently experience a racing heart when sitting quietly?",
          "Do sudden waves of fear interrupt what you are doing?",
          "Do you sometimes feel short of breath without physical exertion?",
          "Does the fear of a panic attack make you slightly alter your daily plans?",
          "Do you sometimes feel dizzy or unsteady when fear suddenly hits?",
          "Do you frequently experience sweaty palms or sudden chills?",
          "Does unexplained fear make it difficult to focus on conversations?",
          "Do you sometimes feel a tight, heavy sensation in your chest?",
          "Do you often feel an unexplained urge to leave the room you are in?",
          "Do these feelings of panic take a long time to settle down?",
          "Do you sometimes feel like your surroundings are slightly unreal or foggy?",
          "Does sudden fear wake you up in the middle of the night?",
          "Do you find yourself avoiding places where you previously felt uneasy?",
          "Do you frequently need a distraction to calm your racing thoughts?",
          "Does the fear sometimes strike you when you are actively trying to relax?"
        ]
      },
      4: {
        goal: "Identify strong panic episodes, fear of losing control, and avoidance behaviors.",
        questions: [
          "Do you experience intense, overwhelming waves of panic multiple times a week?",
          "Does your heart pound so hard it physically hurts or scares you?",
          "Do you frequently feel like you cannot get enough air into your lungs?",
          "Do you actively avoid social events or certain locations to prevent panic?",
          "Do you quickly look for exits as soon as you enter a new room?",
          "Do you experience tingling or numbness in your hands or face during fear?",
          "Do you often feel terrified that you might faint or lose control of your body?",
          "Do these panic episodes severely disrupt your ability to work or study?",
          "Do you often feel a sense of impending doom or danger?",
          "Do you rely heavily on specific people to feel safe when leaving the house?",
          "Does the physical exhaustion from these episodes ruin the rest of your day?",
          "Do you frequently experience nausea or severe stomach distress during panic?",
          "Do you live in constant fear of when the next panic wave will hit?",
          "Do you often feel detached from your own body during these episodes?",
          "Is it extremely difficult for you to calm down once the fear begins?"
        ]
      },
      5: {
        goal: "Detect severe panic disorder symptoms, debilitating fear, and potential need for immediate intervention.",
        questions: [
          "Are you experiencing daily, debilitating panic attacks?",
          "Do you frequently fear that you are having a heart attack or dying during these episodes?",
          "Are you almost entirely unable to leave your home due to the fear of panic?",
          "Does the panic feel completely uncontrollable and overwhelmingly intense?",
          "Are you constantly hyperventilating or struggling to breathe?",
          "Does the fear completely paralyze you, preventing you from moving or speaking?",
          "Do you constantly feel a severe, choking sensation in your throat?",
          "Does the environment frequently feel completely unreal, distorted, or dream-like?",
          "Do you feel completely exhausted to the point where basic tasks are impossible?",
          "Do you experience violent trembling or shaking that you cannot stop?",
          "Has the panic caused you to completely isolate yourself from friends and family?",
          "Do you constantly feel like you are losing your mind or going crazy?",
          "Are you relying entirely on coping mechanisms (or substances) just to make it through the day?",
          "Does the constant physical terror make you feel completely hopeless?",
          "Do you feel you need immediate, urgent professional help to manage this panic?"
        ]
      }
    }
  }
];
