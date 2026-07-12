export interface PlanetInterpretation {
  domain: string;
  keywords: string[];
  description: string;
}

export interface SignInterpretation {
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  mode: 'Cardinal' | 'Fixed' | 'Mutable';
  personality: string[];
  description: string;
}

export interface HouseInterpretation {
  houseNumber: number;
  title: string;
  description: string;
}

export interface AspectInterpretation {
  nature: 'harmonious' | 'challenging' | 'neutral';
  description: string;
}

export interface MoonPhaseInterpretation {
  description: string;
}

export interface AsteroidInterpretation {
  domain: string;
  description: string;
}

export const planetInterpretations: Record<string, PlanetInterpretation> = {
  Sun: {
    domain: 'Self',
    keywords: ['Identity', 'Vitality', 'Purpose', 'Ego', 'Creative expression'],
    description:
      'The Sun represents your core identity, the radiant essence of who you are at your deepest level. It illuminates the path toward self-realization and reveals the unique way you shine your light into the world. Your Sun sign reflects your fundamental character, life purpose, and the qualities you are meant to develop and express fully.',
  },
  Moon: {
    domain: 'Emotions',
    keywords: ['Feelings', 'Intuition', 'Nurturing', 'Habits', 'Subconscious'],
    description:
      'The Moon governs your emotional nature, instinctive reactions, and the deepest needs that make you feel safe and secure. It reveals how you nurture yourself and others, and how you process feelings on a subconscious level. Your Moon sign speaks to your innermost self, the part of you that only emerges when you are truly comfortable and vulnerable.',
  },
  Mercury: {
    domain: 'Communication',
    keywords: ['Thinking', 'Speaking', 'Learning', 'Logic', 'Perception'],
    description:
      'Mercury rules the way you gather, process, and share information with the world around you. It shapes your communication style, intellectual interests, and how your mind naturally makes connections. This planet reveals whether you think quickly or deliberately, and how you translate the thoughts in your head into words and ideas.',
  },
  Venus: {
    domain: 'Love',
    keywords: ['Relationships', 'Beauty', 'Values', 'Pleasure', 'Harmony'],
    description:
      'Venus represents what you find beautiful, how you express affection, and the qualities you are drawn to in relationships. It governs your values around love, money, and pleasure, revealing what brings you joy and how you create harmony in your life. Your Venus placement shows the way you attract others and what you need to feel fulfilled in partnership.',
  },
  Mars: {
    domain: 'Action',
    keywords: ['Drive', 'Ambition', 'Passion', 'Courage', 'Assertion'],
    description:
      'Mars is the planet of raw energy, ambition, and the assertive force that propels you toward your desires. It reveals how you pursue what you want, how you channel your anger, and where you find the courage to take action. Your Mars placement shows your fighting spirit and the unique way you go after your goals with determination.',
  },
  Jupiter: {
    domain: 'Growth',
    keywords: ['Expansion', 'Luck', 'Wisdom', 'Optimism', 'Abundance'],
    description:
      'Jupiter represents growth, abundance, and the benevolent forces of expansion in your life. It guides you toward meaning through exploration, higher learning, and philosophical understanding. Your Jupiter placement reveals where you experience good fortune, how you grow, and the areas of life where your optimism can flourish most naturally.',
  },
  Saturn: {
    domain: 'Responsibility',
    keywords: ['Discipline', 'Structure', 'Lessons', 'Maturity', 'Boundaries'],
    description:
      'Saturn is the teacher of the zodiac, bringing structure, discipline, and the valuable lessons that come with time and experience. It reveals where you face challenges that ultimately build your strength, character, and resilience. Your Saturn placement shows the areas where you must work hardest, but also where you can achieve the most lasting and meaningful success.',
  },
  Uranus: {
    domain: 'Change',
    keywords: ['Innovation', 'Rebellion', 'Freedom', 'Originality', 'Awakening'],
    description:
      'Uranus is the planet of sudden change, innovation, and the impulse to break free from convention. It awakens you to new possibilities and pushes you to embrace your authentic individuality, often through unexpected events. Your Uranus placement reveals where you are most unconventional and where life invites you to revolutionize the way you live.',
  },
  Neptune: {
    domain: 'Inspiration',
    keywords: ['Dreams', 'Intuition', 'Transcendence', 'Creativity', 'Compassion'],
    description:
      'Neptune dissolves boundaries and connects you to the mystical, artistic, and transcendent dimensions of life. It governs your dreams, your imagination, and your capacity for unconditional compassion and spiritual connection. Your Neptune placement reveals where you may experience inspired creativity, but also where you might need to stay grounded against illusion and escapism.',
  },
  Pluto: {
    domain: 'Transformation',
    keywords: ['Power', 'Rebirth', 'Depth', 'Shadow', 'Evolution'],
    description:
      'Pluto represents the forces of profound transformation, power, and the deep psychological undercurrents that shape your destiny. It governs death and rebirth, inviting you to release what no longer serves you and emerge stronger and more authentic. Your Pluto placement reveals where you experience the most intense metamorphosis and where you must confront your own power.',
  },
};

export const signInterpretations: Record<string, SignInterpretation> = {
  Aries: {
    element: 'Fire',
    mode: 'Cardinal',
    personality: ['Bold', 'Independent', 'Pioneering'],
    description:
      'Aries is the first sign of the zodiac, burning with the raw energy of initiation and courageous self-assertion. Those born under this sign are natural leaders who charge ahead with confidence, unafraid to blaze new trails. Their impulsive enthusiasm inspires others, though they benefit from learning patience and consideration along the way.',
  },
  Taurus: {
    element: 'Earth',
    mode: 'Fixed',
    personality: ['Steadfast', 'Sensual', 'Patient'],
    description:
      'Taurus is grounded, reliable, and deeply connected to the physical pleasures of life. Those born under this sign value stability and consistency, building their world with careful determination and an appreciation for beauty. Their stubbornness is matched only by their loyalty, making them devoted friends and partners who can be counted on through any storm.',
  },
  Gemini: {
    element: 'Air',
    mode: 'Mutable',
    personality: ['Curious', 'Adaptable', 'Witty'],
    description:
      'Gemini is the sign of the eternal student, driven by an insatiable curiosity about the world and everyone in it. Those born under this sign possess a quick mind and a gift for communication, effortlessly weaving between ideas and social circles. Their adaptability is their greatest strength, though they thrive when they learn to focus their many talents.',
  },
  Cancer: {
    element: 'Water',
    mode: 'Cardinal',
    personality: ['Nurturing', 'Intuitive', 'Protective'],
    description:
      'Cancer is the heart of the zodiac, ruled by the Moon and deeply attuned to the emotional currents of life. Those born under this sign are naturally nurturing and protective, creating safe havens for the people they love. Their intuitive sensitivity gives them profound emotional depth, and they find strength in honoring their feelings while building healthy boundaries.',
  },
  Leo: {
    element: 'Fire',
    mode: 'Fixed',
    personality: ['Generous', 'Charismatic', 'Dramatic'],
    description:
      'Leo shines with radiant warmth, creativity, and an irrepressible zest for life. Those born under this sign are natural performers who light up every room they enter, generously sharing their joy and encouragement with others. Their proud and loyal heart seeks to create, love, and lead with both courage and magnanimity.',
  },
  Virgo: {
    element: 'Earth',
    mode: 'Mutable',
    personality: ['Analytical', 'Detail-oriented', 'Helpful'],
    description:
      'Virgo brings precision, thoughtfulness, and a deep desire to be of service to the world. Those born under this sign have a sharp analytical mind and an eye for detail, constantly refining and improving everything they touch. Their dedication to excellence is driven by a genuine wish to help others, and they find fulfillment in creating order and wellness.',
  },
  Libra: {
    element: 'Air',
    mode: 'Cardinal',
    personality: ['Diplomatic', 'Graceful', 'Idealistic'],
    description:
      'Libra is the sign of partnership, balance, and an innate appreciation for harmony and beauty. Those born under this sign are natural diplomats who see all sides of every situation, striving to create fairness and connection in their relationships. Their refined taste and social grace make them charming companions, and they flourish when they find equilibrium between giving and receiving.',
  },
  Scorpio: {
    element: 'Water',
    mode: 'Fixed',
    personality: ['Intense', 'Resourceful', 'Transformative'],
    description:
      'Scorpio dives deep into the mysteries of life, unafraid to explore the shadows in search of truth and transformation. Those born under this sign possess remarkable emotional depth, penetrating insight, and an unwavering determination that carries them through any challenge. Their passion is immense, and they emerge from every trial more powerful and authentic than before.',
  },
  Sagittarius: {
    element: 'Fire',
    mode: 'Mutable',
    personality: ['Adventurous', 'Philosophical', 'Optimistic'],
    description:
      'Sagittarius is the seeker of truth, forever expanding horizons through exploration, adventure, and the pursuit of wisdom. Those born under this sign radiate infectious optimism and a love for freedom that propels them toward new experiences and cultures. Their philosophical nature and honest directness inspire others to see the bigger picture and embrace life as a grand journey.',
  },
  Capricorn: {
    element: 'Earth',
    mode: 'Cardinal',
    personality: ['Ambitious', 'Disciplined', 'Practical'],
    description:
      'Capricorn is the architect of the zodiac, building success through patience, discipline, and unwavering determination. Those born under this sign have a natural sense of responsibility and a strategic mind that plans for the long term. Their ambition is balanced by practicality, and they earn their achievements through persistent effort and a commitment to excellence.',
  },
  Aquarius: {
    element: 'Air',
    mode: 'Fixed',
    personality: ['Visionary', 'Independent', 'Humanitarian'],
    description:
      'Aquarius looks to the future with a visionary mind that embraces innovation, originality, and the collective good. Those born under this sign value their independence and think in ways that often defy convention, bringing fresh perspectives to everything they do. Their humanitarian spirit drives them to create meaningful change, and they thrive when connecting with communities that share their ideals.',
  },
  Pisces: {
    element: 'Water',
    mode: 'Mutable',
    personality: ['Compassionate', 'Artistic', 'Mystical'],
    description:
      'Pisces flows with the currents of empathy, imagination, and spiritual connection, making them the most intuitively gifted of the zodiac. Those born under this sign possess a profound sensitivity to the emotions of others and a rich inner world filled with creative and dreamy visions. Their compassionate heart and artistic soul remind us of the beauty of unconditional love and the power of transcendence.',
  },
};

export const houseInterpretations: HouseInterpretation[] = [
  {
    houseNumber: 1,
    title: 'Self & Identity',
    description:
      'The First House represents your outward personality, physical appearance, and the initial impression you make on others. It is the house of self-expression and the mask you wear as you navigate the world. Planets here strongly color your approach to life and how you assert your identity.',
  },
  {
    houseNumber: 2,
    title: 'Finances & Values',
    description:
      'The Second House governs your material resources, personal finances, and the things you value most in life. It reflects your relationship with money, possessions, and the resources you use to build security. This house also reveals your self-worth and what you are willing to invest your energy in.',
  },
  {
    houseNumber: 3,
    title: 'Communication',
    description:
      'The Third House rules communication, learning, and your immediate environment including siblings, neighbors, and early education. It describes how you think, speak, and process information in your daily life. This house also governs short trips and the way you connect with the world around you through words and ideas.',
  },
  {
    houseNumber: 4,
    title: 'Home & Family',
    description:
      'The Fourth House represents your roots, home life, family heritage, and the foundation upon which you build your life. It reveals your relationship with your parents, your private inner world, and where you feel most safe and nurtured. This house also speaks to your later years and the legacy you carry from your ancestry.',
  },
  {
    houseNumber: 5,
    title: 'Creativity & Romance',
    description:
      'The Fifth House is the house of joy, creative self-expression, romance, and the pleasures that make life worth living. It governs your hobbies, artistic talents, love affairs, and the spirit of play and adventure. This house also rules children and the sense of pride and delight you take in your creations.',
  },
  {
    houseNumber: 6,
    title: 'Health & Service',
    description:
      'The Sixth House governs your daily routines, physical health, work environment, and your approach to service and self-improvement. It reveals how you care for your body, organize your responsibilities, and find meaning in helping others. This house also speaks to your relationship with coworkers and the habits that shape your well-being.',
  },
  {
    houseNumber: 7,
    title: 'Partnerships',
    description:
      'The Seventh House represents committed relationships, marriage, business partnerships, and the significant others in your life. It reveals what you seek in a partner and how you navigate the dynamics of one-on-one connections. This house teaches you about balance, compromise, and the reflections of yourself you encounter through others.',
  },
  {
    houseNumber: 8,
    title: 'Transformation & Shared Resources',
    description:
      'The Eighth House is the house of deep transformation, shared finances, intimacy, and the mysteries of life and death. It governs inheritance, joint resources, and the profound psychological changes that reshape your soul. This house invites you to release control, embrace vulnerability, and discover your own power through times of crisis and rebirth.',
  },
  {
    houseNumber: 9,
    title: 'Philosophy & Travel',
    description:
      'The Ninth House rules higher education, philosophy, spirituality, long-distance travel, and the search for meaning beyond the familiar. It expands your horizons through learning, exploration, and exposure to different cultures and belief systems. This house represents your quest for wisdom and the truths that give your life a broader perspective.',
  },
  {
    houseNumber: 10,
    title: 'Career & Public Life',
    description:
      'The Tenth House represents your career, public reputation, social status, and the contributions you make to the world. It reveals your ambitions, the legacy you wish to build, and the authority figures who have shaped your path. This house speaks to your highest aspirations and the role you play in society.',
  },
  {
    houseNumber: 11,
    title: 'Friendships & Community',
    description:
      'The Eleventh House governs friendships, social networks, group affiliations, and the hopes and wishes that fuel your dreams. It reveals the kind of communities you attract, your sense of belonging, and the causes that inspire your idealism. This house reminds you that your greatest aspirations often come to life through connection with like-minded souls.',
  },
  {
    houseNumber: 12,
    title: 'Spirituality & Subconscious',
    description:
      'The Twelfth House is the house of the subconscious, solitude, spirituality, and the hidden realms of the psyche. It governs your dreams, secrets, karmic patterns, and the compassionate service you offer without expectation of recognition. This house invites you to heal old wounds, release what no longer serves you, and connect with the divine through silence and reflection.',
  },
];

export const aspectInterpretations: Record<string, AspectInterpretation> = {
  conjunction: {
    nature: 'neutral',
    description:
      'A conjunction occurs when two planets are close together, merging their energies into a powerful and focused force. This aspect intensifies the qualities of both planets, creating a concentrated point of influence in the chart. Depending on the planets involved, a conjunction can be either harmonious or challenging, but it always represents a significant area of life where energy is amplified.',
  },
  sextile: {
    nature: 'harmonious',
    description:
      'A sextile forms when two planets are approximately sixty degrees apart, creating a flow of supportive and cooperative energy. This aspect brings opportunities for growth, creativity, and positive expression with relative ease. Sextiles encourage you to develop your natural talents and often point to areas where you can find graceful solutions to challenges.',
  },
  square: {
    nature: 'challenging',
    description:
      'A square occurs when two planets are approximately ninety degrees apart, generating tension, friction, and the pressure that drives growth. This aspect forces you to confront obstacles and inner conflicts, pushing you to take action and make changes. While squares can feel uncomfortable, they are powerful catalysts for building strength, resilience, and lasting transformation.',
  },
  trine: {
    nature: 'harmonious',
    description:
      'A trine forms when two planets are approximately one hundred twenty degrees apart, creating a smooth and effortless flow of favorable energy. This aspect represents natural talents and areas of life where things seem to come easily to you. Trines bestow grace and intuition, allowing you to express the combined energy of the planets with harmony and creativity.',
  },
  opposition: {
    nature: 'challenging',
    description:
      'An opposition occurs when two planets are approximately one hundred eighty degrees apart, creating a dynamic tension that asks you to find balance between opposing forces. This aspect often manifests through relationships, reflecting qualities you project onto others that you may not fully own in yourself. Oppositions invite you to integrate polarities and discover wholeness through conscious awareness and compromise.',
  },
};

export const moonPhaseInterpretations: Record<string, MoonPhaseInterpretation> = {
  'New Moon': {
    description:
      'The New Moon marks a time of fresh beginnings, when the sky is dark and the seed of intention is planted in fertile potential. This is a powerful moment for setting goals, initiating new projects, and turning inward to discover what you truly wish to cultivate. The energy is quiet yet potent, inviting you to rest in the darkness and trust the process of emergence.',
  },
  'Waxing Crescent': {
    description:
      'The Waxing Crescent Moon appears as a slender sliver of light, signaling that your intentions are beginning to take form. This phase is about taking the first small steps toward your goals, gathering resources, and building momentum. Hope and optimism grow as you see the faint but unmistakable evidence of your dreams beginning to manifest.',
  },
  'First Quarter': {
    description:
      'The First Quarter Moon presents a moment of decision and action, when the light has grown to half and the tension between intention and reality becomes apparent. Challenges may arise that test your commitment and force you to make choices aligned with your goals. This phase calls for determination, courage, and the willingness to push through obstacles.',
  },
  'Waxing Gibbous': {
    description:
      'The Waxing Gibbous Moon is nearly full, and the energy is one of refinement, adjustment, and preparation. You have made significant progress, and now is the time to fine-tune your approach, perfect your craft, and attend to the details. Trust the process and remain adaptable as you prepare for the illumination that awaits.',
  },
  'Full Moon': {
    description:
      'The Full Moon is a time of culmination, illumination, and heightened emotion, when the Sun and Moon stand opposite one another in perfect luminous balance. This is the harvest moment when seeds planted during the New Moon reach their full expression and results become visible. The Full Moon reveals truths, amplifies feelings, and invites celebration, release, and conscious awareness of what has come to fruition.',
  },
  'Waning Gibbous': {
    description:
      'The Waning Gibbous Moon begins the release cycle, inviting gratitude, sharing, and the dissemination of wisdom gained during the Full Moon. This phase encourages you to give back, teach others, and express the insights you have gathered. The energy supports reflection on what you have learned and how you can integrate these lessons into your life.',
  },
  'Last Quarter': {
    description:
      'The Last Quarter Moon is a powerful time for letting go, forgiveness, and releasing what no longer serves your highest good. As the light diminishes, you are called to evaluate what is working and what must be released to make space for new growth. This phase supports honest self-assessment and the courageous act of surrendering old patterns and attachments.',
  },
  'Waning Crescent': {
    description:
      'The Waning Crescent Moon is the final subtle sliver of light before the cycle begins anew, a deeply introspective and restorative phase. This is a time of rest, dreamwork, and quiet surrender, when you connect with your innermost wisdom and prepare for the next New Moon. The energy is subtle but profound, inviting you to heal, dream, and trust in the eternal rhythm of beginnings and endings.',
  },
};

export const asteroidInterpretations: Record<string, AsteroidInterpretation> = {
  Ceres: {
    domain: 'Nurturing & Loss',
    description:
      'Ceres represents your capacity for nurturing, both giving and receiving care, and your relationship with the cycles of growth and loss. It reveals how you experience grief and how you allow yourself to be nurtured through difficult transitions. This asteroid also speaks to your connection with nature, fertility, and the unconditional love that sustains all life.',
  },
  Pallas: {
    domain: 'Wisdom & Strategy',
    description:
      'Pallas embodies wisdom, strategic thinking, creative intelligence, and the ability to see patterns that others miss. It reveals how you approach problem-solving, your unique creative gifts, and your capacity for justice and fairness. This asteroid highlights your intellectual talents and the way you bring wisdom into your creative and professional endeavors.',
  },
  Juno: {
    domain: 'Commitment & Partnership',
    description:
      'Juno represents the archetype of the committed partner and reveals what you seek in a lasting, meaningful relationship. It speaks to your ideals around marriage, loyalty, equality, and the dynamics of power within partnerships. This asteroid highlights where you need to find balance between independence and togetherness, and what you require to sustain a deeply fulfilling union.',
  },
  Vesta: {
    domain: 'Dedication & Focus',
    description:
      'Vesta represents your sacred focus, devotion, and the area of life where you dedicate yourself with unwavering commitment. It reveals where you channel your energy with the most purity and discipline, often at the expense of other areas. This asteroid speaks to your capacity for spiritual devotion, your work ethic, and the flame of purpose that burns at the center of your being.',
  },
};

export function getSynastryAspectInterpretation(
  planetA: string,
  aspectType: string,
  planetB: string
): string {
  const aspectLower = aspectType.toLowerCase();

  const aspectQualities: Record<string, string> = {
    conjunction: 'intensely merged and amplified',
    sextile: 'supportive and flowing with ease',
    square: 'challenging yet growth-inducing through creative tension',
    trine: 'harmonious and naturally aligned',
    opposition: 'dynamic, calling for balance and conscious awareness',
  };

  const quality = aspectQualities[aspectLower] || 'uniquely connected';

  const templates = [
    `Your ${planetA} forms a ${quality} connection with their ${planetB}, creating a dynamic where your ${planetA.toLowerCase()}-energy directly meets their ${planetB.toLowerCase()}-energy. This aspect encourages mutual growth as you learn from the interplay between these planetary forces.`,
    `With your ${planetA} in ${aspectType} to their ${planetB}, the energies between you are ${quality}. This alignment shapes how you express these planetary qualities together, offering both gifts and opportunities for deeper understanding.`,
    `The ${aspectType} between your ${planetA} and their ${planetB} creates a bond that is ${quality}. This aspect highlights an area of your relationship where you can support each other's growth and discover new dimensions of connection.`,
  ];

  const index =
    (planetA.length + aspectType.length + planetB.length) % templates.length;
  return templates[index];
}
