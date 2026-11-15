// ========================================================
// ASTRO WORLD (أسترو وورلد) - APPLICATION LOGIC ENGINE
// Senior Full-Stack & UI/UX Specialist Implementation
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Application State - Dark Cosmic Theme Locked Permanently
  try { localStorage.removeItem('ASTRO_THEME'); } catch (e) { }
  document.documentElement.setAttribute('data-theme', 'dark');

  const state = {
    currentLang: localStorage.getItem('ASTRO_LANG') || 'ar',
    theme: 'dark',
    soundEnabled: true,
    astroMuted: localStorage.getItem('ASTRO_MUTED') === 'true',
    currentUser: null,
    isTyping: false,
    typewriterTimer: null,
    audioCtx: null,
    threeRenderer: null,
    threeScene: null,
    threeCamera: null,
    threeAnimId: null
  };

  // Comprehensive Multi-Language Dictionary
  const i18n = {
    ar: {
      dir: 'rtl',
      brandTitle: 'أسترو وورلد',
      brandSubtitle: 'بوابة استكشاف الفضاء والمجرات • وكالة ناسا',
      authHeading: 'انضم إلى أسترو وورلد',
      authSubheading: 'سجّل بياناتك للانطلاق في رحلتك الفضائية مع أسترو',
      labelMissionLang: 'لغة الاستكشاف (Language)',
      labelFullName: 'الاسم الكامل',
      labelAge: 'السن (العمر: 5 - 12 سنة)',
      labelEmail: 'البريد الإلكتروني (جيميل)',
      labelPassword: 'كلمة المرور',
      placeholderName: 'أدخل اسمك الكريم...',
      placeholderAge: 'من 5 إلى 12 سنة',
      placeholderEmail: 'astronaut@gmail.com',
      submitBtnText: 'تسجيل الدخول إلى ناسا',
      supabaseReady: 'سوبابيز متصل',
      dashWelcomeTitle: 'مرحباً بك في أسترو وورلد',
      dashWelcomeSubtitle: 'المحطة الفضائية الرئيسية • وكالة ناسا',
      astroStatus: 'أسترو متصل ومستعد',
      astroNameTag: 'المساعد الذكي أسترو',
      missionStatus: 'جاهز للانطلاق • المحطة الرئيسية',
      gatewayTitle: 'ابدأ مغامرتك الكونية',
      gatewaySubtitle: 'استكشف أسرار الكون، وعجائب الكواكب، وأحدث تكنولوجيا الفضاء في العالم بصحبة رفيقك الفضائي أسترو.',
      startBtnLabel: 'ابدأ الآن',
      missionAwaiting: 'أسترو في انتظار توجيهاتك لبدء الرحلة',
      astroWelcomeMsg: (name) => `مَرْحَباً بِكَ${name ? ` يَا ${name}` : ''} فِي أَسْتْرُو وُورْلِدْ! أَنَا أَسْتْرُو، رَفِيقُكَ وَمُسَاعِدُكَ الفَضَائِيُّ الذَّكِيُّ. سَأَصْحَبُكَ فِي جَوْلَةٍ مُمْتِعَةٍ لِاسْتِكْشَافِ أَسْرَارِ الكَوْنِ، وَعَجَائِبِ المَجَرَّاتِ وَالكَوَاكِبِ، وَأَحْدَثِ تِكْنُولُوجْيَا وَكَالَةِ نَاسَا! 🚀`,
      astroHubPrompt: 'أَهْلاً بِكَ فِي مَحَطَّةِ الِاسْتِكْشَافِ الرَّئِيسِيَّةِ! اخْتَرْ وِجْهَتَكَ الكَوْنِيَّةَ: المَجَرَّاتِ السَّحِيقَةَ، أَوْ كَوَاكِبَ مَجْمُوعَتِنَا الشَّمْسِيَّةِ، أَوْ أَقْوَى تِكْنُولُوجْيَا لِوَكَالَةِ نَاسَا!',
      astroVoiceBadge: 'صوت أسترو',
      tabGalaxies: 'المجرات',
      tabPlanets: 'الكواكب',
      tabEquipment: 'المعدات الفضائية',
      tabAcademy: 'أكاديمية رواد الفضاء',
      returnLabel: 'العودة للرئيسية',
      fillAllFields: 'يرجى ملء جميع الحقول بشكل صحيح!',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح!',
      invalidAge: 'السن المسموح به هو من 5 إلى 12 سنة فقط!',
      quizCorrect: 'إجابة عبقرية وصحيحة تماماً!',
      quizWrong: 'حاول مجدداً يا بطل الفضاء!',
      solarTitle: 'المجموعة الشمسية ثلاثية الأبعاد • مجرة درب التبانة',
      returnGalaxies: 'العودة للمجرات',
      solarHint: 'انقر على أي كوكب للانتقال إليه وتكبيره ثلاثي الأبعاد • اسحب للتدوير • عجلة الماوس للتقريب',
      discoveryTitle: 'تاريخ الاكتشاف والرحلات الاستكشافية',
      labelGravity: 'الجاذبية',
      labelTemp: 'الحرارة',
      labelMoons: 'الأقمار',
      labelOrbit: 'الدورة المدارية',
      speakBtnText: 'استمع لشرح أسترو',
      resetOrbitText: 'عودة للمدارات الكاملة',
      navOutpost: 'محطة ISS 🛰️',
      outpostTitle: 'محاكاة محطة الفضاء الدولية (ISS) • وكالة ناسا',
      returnOutpost: 'العودة للاستكشاف',
      outpostScienceDoc: 'علوم ناسا',
      launcherBannerBadge: 'محاكاة ثلاثية الأبعاد • NASA ISS Space Mission',
      launcherBannerTitle: '🛰️ مهمة محطة الفضاء الدولية (ISS 3D Mission)',
      launcherBannerDesc: 'عش تجربة رائد فضاء حقيقي داخل محطة الفضاء الدولية بتقنية ثلاثية الأبعاد! تجوّل بحرية عبر 6 وحدات، وتصدَّ للحطام الفضائي، وازرع الخس الفضائي، وأصلح أنظمة الأكسجين مع أسترو.',
      launchOutpostBtn: 'انطلق إلى محطة ISS 🚀'
    },
    en: {
      dir: 'ltr',
      brandTitle: 'ASTRO WORLD',
      brandSubtitle: 'Space & Galaxies Exploration Gateway • NASA',
      authHeading: 'Join Astro World',
      authSubheading: 'Enter your cadet details to launch your space journey with Astro',
      labelMissionLang: 'Mission Language',
      labelFullName: 'Full Name',
      labelAge: 'Age (5 - 12 Years)',
      labelEmail: 'Email Address (Gmail)',
      labelPassword: 'Password',
      placeholderName: 'Enter your full name...',
      placeholderAge: '5 to 12 years',
      placeholderEmail: 'astronaut@gmail.com',
      submitBtnText: 'Register for NASA Mission',
      supabaseReady: 'Supabase Ready',
      dashWelcomeTitle: 'Welcome to Astro World',
      dashWelcomeSubtitle: 'Main Space Station • NASA Headquarters',
      astroStatus: 'Astro Online & Ready',
      astroNameTag: 'Astro AI Assistant',
      missionStatus: 'Ready for Launch • Main Station',
      gatewayTitle: 'Begin Your Cosmic Adventure',
      gatewaySubtitle: 'Unravel cosmic secrets, mesmerizing planets, and cutting-edge space equipment alongside your personal assistant Astro.',
      startBtnLabel: 'Start Now',
      missionAwaiting: 'Astro is awaiting your instructions to proceed',
      astroWelcomeMsg: (name) => `Welcome ${name} to Astro World! My name is Astro, your personal assistant in Astro World. I will guide you to learn about galaxies, planets, and space equipment, and I will help you become a professional astronaut! 🚀`,
      astroHubPrompt: 'Welcome to the Main Exploration Center! Choose what you wish to explore: Deep Galaxies, Solar System Planets, NASA Space Technology, or Astronaut Academy!',
      astroVoiceBadge: 'Astro Voice',
      tabGalaxies: 'Galaxies',
      tabPlanets: 'Planets',
      tabEquipment: 'Space Tech',
      tabAcademy: 'Astronaut Academy',
      returnLabel: 'Home',
      fillAllFields: 'Please fill in all fields correctly!',
      invalidEmail: 'Please enter a valid email address!',
      invalidAge: 'Allowed age is between 5 and 12 years only!',
      quizCorrect: 'Brilliant answer! Jupiter is indeed the king of our solar system!',
      quizWrong: 'Try again, space cadet!',
      solarTitle: '3D Solar System • Milky Way Galaxy',
      returnGalaxies: 'Back to Galaxies',
      solarHint: 'Click any planet to zoom in & focus • Drag to rotate • Scroll to zoom',
      discoveryTitle: 'Discovery History & Exploration Missions',
      labelGravity: 'Gravity',
      labelTemp: 'Temperature',
      labelMoons: 'Moons',
      labelOrbit: 'Orbital Period',
      speakBtnText: 'Listen to Astro',
      resetOrbitText: 'Full Orbit Overview',
      navOutpost: 'ISS Station 🛰️',
      outpostTitle: 'International Space Station (ISS) Mission • NASA',
      returnOutpost: 'Return to Exploration',
      outpostScienceDoc: 'NASA Science',
      launcherBannerBadge: '3D Simulation • NASA ISS Space Mission',
      launcherBannerTitle: '🛰️ ISS Space Station 3D Mission',
      launcherBannerDesc: 'Live the life of an astronaut inside the International Space Station in full 3D! Freely explore 6 modules, deflect orbital debris, harvest space lettuce, and repair life support with Astro.',
      launchOutpostBtn: 'Board the ISS 🚀'
    },
    fr: {
      dir: 'ltr',
      brandTitle: 'ASTRO WORLD',
      brandSubtitle: 'Portail d\'exploration spatiale et des galaxies • NASA',
      authHeading: 'Rejoindre Astro World',
      authSubheading: 'Enregistrez vos coordonnées pour débuter votre mission spatiale avec Astro',
      labelMissionLang: 'Langue de la Mission',
      labelFullName: 'Nom complet',
      labelAge: 'Âge (5 - 12 Ans)',
      labelEmail: 'Adresse e-mail (Gmail)',
      labelPassword: 'Mot de passe',
      placeholderName: 'Entrez votre nom complet...',
      placeholderAge: 'De 5 à 12 ans',
      placeholderEmail: 'astronaute@gmail.com',
      submitBtnText: 'S\'inscrire à la mission NASA',
      supabaseReady: 'Supabase Prêt',
      dashWelcomeTitle: 'Bienvenue sur Astro World',
      dashWelcomeSubtitle: 'Station Spatiale Principale • NASA',
      astroStatus: 'Astro en ligne et prêt',
      astroNameTag: 'Assistant IA Astro',
      missionStatus: 'Prêt au lancement • Station Principale',
      gatewayTitle: 'Commencez Votre Aventure Cosmique',
      gatewaySubtitle: 'Découvrez les mystères de l\'univers, les planètes fascinantes et les équipements spatiaux aux côtés de votre assistant personnel Astro.',
      startBtnLabel: 'Commencer',
      missionAwaiting: 'Astro attend vos instructions pour continuer',
      astroWelcomeMsg: (name) => `Bienvenue ${name} sur Astro World ! Je m'appelle Astro, votre assistant personnel sur Astro World. Je vais vous aider à découvrir les galaxies, les planètes et les équipements spatiaux, et vous apprendre à devenir un astronaute professionnel ! 🚀`,
      astroHubPrompt: 'Bienvenue au Centre Principal d\'Exploration ! Choisissez votre destination : Galaxies lointaines, Planètes du système solaire, Technologies de la NASA ou l\'Académie des Astronautes !',
      astroVoiceBadge: 'Voix Astro',
      tabGalaxies: 'Galaxies',
      tabPlanets: 'Planètes',
      tabEquipment: 'Équipements',
      tabAcademy: 'Académie Spatiale',
      returnLabel: 'Accueil',
      fillAllFields: 'Veuillez remplir tous les champs correctement !',
      invalidEmail: 'Veuillez saisir une adresse email valide !',
      invalidAge: 'L\'âge autorisé est entre 5 et 12 ans uniquement !',
      quizCorrect: 'Réponse brillante ! Jupiter est bien la planète géante de notre système !',
      quizWrong: 'Réessayez, cadet de l\'espace !',
      solarTitle: 'Système Solaire 3D • Voie Lactée',
      returnGalaxies: 'Retour aux Galaxies',
      solarHint: 'Cliquez sur une planète pour zoomer • Glissez pour pivoter • Molette pour zoomer',
      discoveryTitle: 'Histoire de la découverte et missions d\'exploration',
      labelGravity: 'Gravité',
      labelTemp: 'Température',
      labelMoons: 'Lunes',
      labelOrbit: 'Période orbitale',
      speakBtnText: 'Écouter Astro',
      resetOrbitText: 'Vue d\'ensemble',
      navOutpost: 'Station ISS 🛰️',
      outpostTitle: 'Mission Station Spatiale Internationale (ISS) • NASA',
      returnOutpost: 'Retour à l\'Exploration',
      outpostScienceDoc: 'Science NASA',
      launcherBannerBadge: 'Simulation 3D • NASA ISS Space Mission',
      launcherBannerTitle: '🛰️ Mission 3D Station Spatiale ISS',
      launcherBannerDesc: 'Vivez la vie d\'un astronaute dans la Station Spatiale Internationale en 3D ! Explorez 6 modules, repoussez les débris, cultivez la salade spatiale et réparez le support de vie.',
      launchOutpostBtn: 'Embarquer sur l\'ISS 🚀'
    }
  };

  // Domestic Data Catalog for Cosmic Sectors
  const cosmicCatalog = {
    galaxies: [
      {
        id: 'milkyway',
        name: { ar: 'درب التبانة', en: 'Milky Way Galaxy', fr: 'Voie Lactée' },
        type: { ar: 'مجرة حلزونية قضيبية', en: 'Barred Spiral Galaxy', fr: 'Galaxie spirale barrée' },
        defaultImg: 'https://images-assets.nasa.gov/image/PIA10748/PIA10748~medium.jpg',
        locked: false, // Unlocked home galaxy
        desc: {
          ar: 'موطن شمسنا وأرضنا، يبلغ قطرها 100,000 سنة ضوئية وتحوي أكثر من 200 مليار نجم، وفي قلبها يتربع الثقب الأسود الرامي A*.',
          en: 'Home to our solar system, spans 100,000 light-years with over 200 billion stars and a supermassive black hole Sagittarius A*.',
          fr: 'Berceau de notre système solaire, s\'étend sur 100 000 années-lumière avec plus de 200 milliards d\'étoiles.'
        },
        metric1: { ar: 'القطر: 100,000 سنة ضوئية', en: 'Diameter: 100,000 ly', fr: 'Diamètre: 100 000 al' },
        metric2: { ar: 'النجوم: 100-400 مليار', en: 'Stars: 100-400B', fr: 'Étoiles: 100-400M' }
      },
      {
        id: 'andromeda',
        name: { ar: 'مجرة أندروميدا', en: 'Andromeda Galaxy (M31)', fr: 'Galaxie d\'Andromède' },
        type: { ar: 'حلزونية عملاقة', en: 'Giant Spiral', fr: 'Spirale géante' },
        defaultImg: 'https://images-assets.nasa.gov/image/PIA04921/PIA04921~medium.jpg',
        locked: true, // Locked
        desc: {
          ar: 'أقرب مجرة كبرى لدرب التبانة، تبعد عنا 2.5 مليون سنة ضوئية، وتقترب نحونا بسرعة 110 كم/ثانية للاندماج بعد 4.5 مليار عام.',
          en: 'Our largest cosmic neighbor, 2.5 million light-years away, containing roughly one trillion stars on a collision course with us.',
          fr: 'Plus proche grande galaxie voisine, située à 2,5 millions d\'années-lumière et abritant mille milliards d\'étoiles.'
        },
        metric1: { ar: 'المسافة: 2.5 مليون س.ض', en: 'Distance: 2.5M ly', fr: 'Distance: 2,5M al' },
        metric2: { ar: 'النجوم: 1 تريليون نجم', en: 'Stars: 1 Trillion', fr: 'Étoiles: 1 Billion' }
      },
      {
        id: 'whirlpool',
        name: { ar: 'مجرة الدوامة', en: 'Whirlpool Galaxy (M51)', fr: 'Galaxie du Tourbillon' },
        type: { ar: 'حلزونية تصميمية نموذجية', en: 'Grand Design Spiral', fr: 'Spirale de grand style' },
        defaultImg: 'https://images-assets.nasa.gov/image/PIA04230/PIA04230~medium.jpg',
        locked: true, // Locked
        desc: {
          ar: 'تشتهر بأذرعها الحلزونية المضيئة والمثالية وتفاعلها الجذبي الملحمي مع المجرة القزمة المرافقة NGC 5195.',
          en: 'Famous for its picturesque spiral arms and dynamic gravitational interaction with its companion dwarf galaxy NGC 5195.',
          fr: 'Célèbre pour ses bras spiraux d\'une clarté spectaculaire en interaction avec la galaxie naine NGC 5195.'
        },
        metric1: { ar: 'المسافة: 23 مليون س.ض', en: 'Distance: 23M ly', fr: 'Distance: 23M al' },
        metric2: { ar: 'النوع: تفاعل مجري نشط', en: 'Interacting Galaxy', fr: 'Galaxie en interaction' }
      },
      {
        id: 'sombrero',
        name: { ar: 'مجرة سومبريرو', en: 'Sombrero Galaxy (M104)', fr: 'Galaxie du Sombrero' },
        type: { ar: 'حلزونية بقرص غباري كثيف', en: 'Spiral with Dust Lane', fr: 'Galaxie spirale à disque' },
        defaultImg: 'https://images-assets.nasa.gov/image/PIA15426/PIA15426~medium.jpg',
        locked: true, // Locked
        desc: {
          ar: 'تتميز بانتفاخ مركزي أبيض ساطع وطوق غباري داكن متماسك يمنحها مظهر القبعة المكسيكية الشهيرة.',
          en: 'Distinguished by a brilliant white nucleus and a prominent dark dust lane resembling a traditional Mexican hat.',
          fr: 'Caractérisée par un bulbe central brillant et une bande de poussière sombre évoquant un sombrero.'
        },
        metric1: { ar: 'المسافة: 28 مليون س.ض', en: 'Distance: 28M ly', fr: 'Distance: 28M al' },
        metric2: { ar: 'الكتلة: 800 مليار شمس', en: 'Mass: 800B Suns', fr: 'Masse: 800M Soleils' }
      }
    ],

    // Complete Photorealistic 3D Solar System & Discovery History Database
    solarSystem: {
      sun: {
        id: 'sun',
        name: { ar: 'الشمس', en: 'The Sun', fr: 'Le Soleil' },
        type: { ar: 'نجم قزم أصفر', en: 'Yellow Dwarf Star (G2V)', fr: 'Étoile naine jaune' },
        discovery: {
          ar: 'الشمس معروفة منذ فجر الإنسانية كأعظم جرم سماوي. رصد غاليليو بقعها الشمسية عام 1610 بواسطة التلسكوب لأول مرة لإثبات دورانها، وفي عام 1938 اكتشف الفيزيائي هانز بيته سر طاقتها العظيمة عبر تفاعلات الاندماج النووي الحراري!',
          en: 'Known since antiquity. Galileo first observed sunspots with a telescope in 1610 proving solar rotation, and in 1938 physicist Hans Bethe solved the secret of its immense energy via thermonuclear hydrogen fusion.',
          fr: 'Connue depuis les temps immémoriaux. Galilée a observé les taches solaires en 1610, et Hans Bethe a découvert la fusion nucléaire en 1938.'
        },
        gravity: { ar: '274 م/ث² (28 ضعف الأرض)', en: '274 m/s² (28x Earth)', fr: '274 m/s² (28x Terre)' },
        temp: { ar: '5,500°C السطح • 15 مليون°C اللب', en: '5,500°C Surface • 15M°C Core', fr: '5 500°C Surface • 15M°C Cœur' },
        moons: { ar: '8 كواكب + آلاف الكويكبات', en: '8 Planets + Thousands of Asteroids', fr: '8 Planètes + Milliers d\'astéroïdes' },
        orbit: { ar: '230 مليون سنة (سنة مجرية)', en: '230 Million Years (Galactic Year)', fr: '230 Millions d\'années' },
        speech: {
          ar: 'الشمس هي قلب نظامنا الشمسي ونجمنا الحيوي! تشكل 99.86 بالمائة من كتلة المجموعة الشمسية كلها، ورصد غاليليو بقعها عام 1610!',
          en: 'The Sun is the luminous heart of our solar system, containing 99.86 percent of all mass in our cosmic neighborhood!'
        }
      },
      mercury: {
        id: 'mercury',
        name: { ar: 'عطارد', en: 'Mercury', fr: 'Mercure' },
        type: { ar: 'كوكب صخري داخلي', en: 'Terrestrial Inner Planet', fr: 'Planète tellurique' },
        discovery: {
          ar: 'سجله علماء الفلك البابليون في الألفية الأولى قبل الميلاد (وسموه نينورتا). وكان أول رصد تلسكوبي له بواسطة غاليليو عام 1631. زارته مركبة ناسا مارينر 10 عام 1974، ثم أرسلت ناسا مركبة ميسنجر عام 2011 لرسم خرائطه بالكامل!',
          en: 'First recorded by Babylonian astronomers in the 14th century BC. Galileo made the first telescopic observation in 1631. NASA Mariner 10 flew by in 1974, and NASA MESSENGER orbited and mapped it in 2011.',
          fr: 'Enregistré par les Babyloniens. Galilée l\'a observé au télescope en 1631, et la sonde Mariner 10 de la NASA l\'a survolée en 1974.'
        },
        gravity: { ar: '3.7 م/ث²', en: '3.7 m/s²', fr: '3,7 m/s²' },
        temp: { ar: '-180°C ليلاً إلى 430°C نهاراً', en: '-180°C to 430°C', fr: '-180°C à 430°C' },
        moons: { ar: 'بلا أقمار', en: 'None (0 Moons)', fr: 'Aucune (0 lune)' },
        orbit: { ar: '88 يوماً أرضياً', en: '88 Earth Days', fr: '88 jours terrestres' },
        speech: {
          ar: 'عطارد هو أصغر كواكب المجموعة الشمسية وأقربها للشمس! يكمل دورته في 88 يوماً فقط وسجلته ناسا بمركبة ميسنجر!',
          en: 'Mercury is the smallest planet and closest to the Sun, completing its orbit in just 88 Earth days!'
        }
      },
      venus: {
        id: 'venus',
        name: { ar: 'الزهرة', en: 'Venus', fr: 'Vénus' },
        type: { ar: 'كوكب أرضي ذو احتباس حراري', en: 'Extreme Greenhouse Terrestrial', fr: 'Planète tellurique' },
        discovery: {
          ar: 'عُرف بنجمة الصباح والمساء منذ الحضارات السومرية والمصرية القديمة. في عام 1610 أثبت غاليليو كرويته وأطواره كدليل حاسم على دوران الكواكب حول الشمس! وكانت مركبة ناسا مارينر 2 عام 1962 أول مركبة تزوره بنجاح في التاريخ!',
          en: 'Known since prehistoric times. Galileo discovered its phases in 1610 proving planets orbit the Sun! NASA Mariner 2 was humanity\'s first successful planetary flyby in 1962.',
          fr: 'Observée depuis l\'Antiquité. Galilée a découvert ses phases en 1610, et Mariner 2 de la NASA l\'a survolée en 1962.'
        },
        gravity: { ar: '8.87 م/ث²', en: '8.87 m/s²', fr: '8,87 m/s²' },
        temp: { ar: '475°C ثابتة (أسخن كوكب)', en: '475°C Constant (Hottest Planet)', fr: '475°C Constante' },
        moons: { ar: 'بلا أقمار', en: 'None (0 Moons)', fr: 'Aucune' },
        orbit: { ar: '225 يوماً أرضياً', en: '225 Earth Days', fr: '225 jours terrestres' },
        speech: {
          ar: 'الزهرة هو أسخن كوكب في نظامنا الشمسي بسبب احتباس حراري هائل! رصده غاليليو عام 1610 وزارته ناسا عام 1962!',
          en: 'Venus is the hottest planet in the Solar System blanketed in dense carbon dioxide! Visited by NASA in 1962!'
        }
      },
      earth: {
        id: 'earth',
        name: { ar: 'كوكب الأرض', en: 'Earth', fr: 'Terre' },
        type: { ar: 'واحة الحياة الصخرية', en: 'Ocean Habitable World', fr: 'Monde océanique' },
        discovery: {
          ar: 'موطن الإنسانية الأبدي. قام العالم الإغريقي إراتوستينس بحساب محيط الأرض بدقة عام 240 قبل الميلاد، وبدأت رؤية الأرض من الفضاء الخارجي رسمياً في 12 أبريل 1961 مع أول رائد فضاء يوري غاغارين وصورة جوهرة زرقاء التقطتها أبولو 17 عام 1972!',
          en: 'Home of humanity. Eratosthenes calculated Earth\'s circumference in 240 BC. First seen in entirety from orbit in 1961, and famously captured in NASA\'s iconic Blue Marble photo in 1972 by Apollo 17.',
          fr: 'Berceau de l\'humanité. Ératosthène a calculé sa circonférence en 240 av. J.-C. Vue de l\'espace en 1961 et immortalisée par Apollo 17 en 1972.'
        },
        gravity: { ar: '9.807 م/ث²', en: '9.807 m/s²', fr: '9,807 m/s²' },
        temp: { ar: '15°C في المتوسط', en: '15°C Average', fr: '15°C Moyenne' },
        moons: { ar: 'قمر طبيعي واحد (The Moon)', en: '1 Natural Moon', fr: '1 Lune naturelle' },
        orbit: { ar: '365.25 يوم', en: '365.25 Days (1 Year)', fr: '365,25 Jours' },
        speech: {
          ar: 'كوكب الأرض، كوكبنا الأم والوحيد في الكون المعروف بوجود ماء سائل وحياة وغلاف جوي واقٍ!',
          en: 'Planet Earth, our majestic home and the only known world harboring vibrant oceans and life!'
        }
      },
      moon: {
        id: 'moon',
        name: { ar: 'القمر', en: 'The Moon', fr: 'La Lune' },
        type: { ar: 'تابع طبيعي صخري', en: 'Natural Satellite', fr: 'Satellite naturel' },
        discovery: {
          ar: 'رافق البشرية منذ الأزل. رسم غاليليو أول خريطة لتضاريسه وتجاويفه عام 1609. وفي 20 يوليو 1969 دخلت ناسا التاريخ بنجاح هبوط نيل أرمسترونغ وباز ألدرين على سطحه خلال مهمة أبولو 11 وخطوتهما العملاقة للبشرية!',
          en: 'Humanity\'s closest celestial companion. Galileo mapped its craters in 1609. On July 20, 1969, NASA made history as Neil Armstrong and Buzz Aldrin stepped onto its surface during Apollo 11!',
          fr: 'Compagnon de la Terre. Galilée a cartographié ses cratères en 1609, et la NASA a posé Apollo 11 sur sa surface le 20 juillet 1969.'
        },
        gravity: { ar: '1.62 م/ث² (سدس جاذبية الأرض)', en: '1.62 m/s² (1/6 Earth)', fr: '1,62 m/s² (1/6 Terre)' },
        temp: { ar: '-130°C ليلاً إلى 120°C نهاراً', en: '-130°C to 120°C', fr: '-130°C à 120°C' },
        moons: { ar: 'يدور حول كوكب الأرض', en: 'Orbits Planet Earth', fr: 'Orbite autour de la Terre' },
        orbit: { ar: '27.3 يوماً حول الأرض', en: '27.3 Days around Earth', fr: '27,3 jours autour de la Terre' },
        speech: {
          ar: 'القمر رفيق الأرض في رحلتها الكونية! في 20 يوليو 1969 هبطت ناسا بأول إنسان على سطحه في مهمة أبولو 11 الشهيرة!',
          en: 'The Moon is Earth\'s faithful companion! In 1969, NASA Apollo 11 astronauts took humanity\'s first giant leap upon its surface!'
        }
      },
      mars: {
        id: 'mars',
        name: { ar: 'المريخ', en: 'Mars', fr: 'Mars' },
        type: { ar: 'الكوكب الأحمر الصخري', en: 'Red Terrestrial Planet', fr: 'Planète rouge' },
        discovery: {
          ar: 'سُمي بالكوكب الأحمر منذ الحضارات البابلية والمصرية القديمة. رصده غاليليو عام 1610، وهبطت أول مركبة ناسا (فايكنج 1) على سطحه في يوليو 1976، وتجوب سطحه حالياً روبوتات ناسا المتطورة كيوريوسيتي وبرسيفيرنس بحثاً عن دلائل الحياة القديمة!',
          en: 'Known since antiquity as the Red Planet. Telescopically observed by Galileo in 1610. NASA Viking 1 made the first operational landing in 1976, followed by rovers Curiosity and Perseverance exploring ancient riverbeds today.',
          fr: 'Connue depuis l\'Antiquité. Galilée l\'a observée en 1610. Viking 1 de la NASA s\'y est posée en 1976, rejointe aujourd\'hui par Perseverance.'
        },
        gravity: { ar: '3.72 م/ث²', en: '3.72 m/s²', fr: '3,72 m/s²' },
        temp: { ar: '-65°C في المتوسط', en: '-65°C Average', fr: '-65°C Moyenne' },
        moons: { ar: 'قمران (فوبوس وديموس)', en: '2 Moons (Phobos & Deimos)', fr: '2 lunes (Phobos & Deimos)' },
        orbit: { ar: '687 يوماً أرضياً', en: '687 Earth Days', fr: '687 jours terrestres' },
        speech: {
          ar: 'المريخ الكوكب الأحمر الرائع! يحتوي على أضخم بركان في المجموعة الشمسية جبل أوليمبوس، وهبطت عليه فايكنج عام 1976!',
          en: 'Mars, the captivating Red Planet! Home to Olympus Mons, the largest volcano in the Solar System, explored by NASA rovers!'
        }
      },
      jupiter: {
        id: 'jupiter',
        name: { ar: 'المشتري', en: 'Jupiter', fr: 'Jupiter' },
        type: { ar: 'عملاق غازي هائل', en: 'Giant Gas Giant', fr: 'Géante gazeuse' },
        discovery: {
          ar: 'معروف منذ فجر التاريخ. في 7 يناير 1610 اكتشف غاليليو أقماره الأربعة الكبرى (أيو، يوروبا، غانيميد، كاليستو) مما غير علم الفلك للأبد. زارته مركبة ناسا بايونير 10 عام 1973، وتدور حوله حالياً مركبة ناسا جونو كاشفة أسرار عاصفته البقعة الحمراء!',
          en: 'Observed since prehistoric times. On January 7, 1610, Galileo discovered its 4 major moons, revolutionizing astronomy. NASA Pioneer 10 flew by in 1973, and NASA Juno orbits it today studying the Great Red Spot.',
          fr: 'Connu depuis toujours. Galilée a découvert ses 4 lunes en 1610. Pioneer 10 l\'a visitée en 1973, et la sonde Juno de la NASA l\'étudie actuellement.'
        },
        gravity: { ar: '24.79 م/ث²', en: '24.79 m/s²', fr: '24,79 m/s²' },
        temp: { ar: '-110°C في قمم السحب', en: '-110°C Cloud Tops', fr: '-110°C Sommet des nuages' },
        moons: { ar: '95 قمراً معتمداً', en: '95 Recognized Moons', fr: '95 lunes reconnues' },
        orbit: { ar: '11.86 سنة أرضية', en: '11.86 Earth Years', fr: '11,86 années terrestres' },
        speech: {
          ar: 'المشتري ملك الكواكب وأضخمها على الإطلاق! عاصفته الشهيرة البقعة الحمراء تدور منذ مئات السنين واكتشف غاليليو أقماره عام 1610!',
          en: 'Jupiter is the colossus of planets! Its iconic Great Red Spot has raged for centuries, and Galileo discovered its moons in 1610!'
        }
      },
      saturn: {
        id: 'saturn',
        name: { ar: 'زحل', en: 'Saturn', fr: 'Saturne' },
        type: { ar: 'عملاق غازي بحلقات جليدية', en: 'Ringed Gas Giant', fr: 'Géante aux anneaux' },
        discovery: {
          ar: 'رصده القدماء بالعين المجردة. رأى غاليليو أطراف حلقاته عام 1610 وظنها آذاناً، ثم فسر طبيعتها الحلقية الفلكي كريستيان هويجنز عام 1655. درست مركبة ناسا كاسيني نظام زحل وحلقاته الرائعة عن قرب بين عامي 2004 و2017!',
          en: 'Tracked by ancient astronomers. Galileo saw its handles in 1610, and Christiaan Huygens discovered they were rings in 1655. NASA Cassini spacecraft explored Saturn and its rings up close for over a decade from 2004 to 2017.',
          fr: 'Connu depuis l\'Antiquité. Huygens a découvert ses anneaux en 1655, et la sonde Cassini de la NASA l\'a explorée de 2004 à 2017.'
        },
        gravity: { ar: '10.44 م/ث²', en: '10.44 m/s²', fr: '10,44 m/s²' },
        temp: { ar: '-140°C', en: '-140°C', fr: '-140°C' },
        moons: { ar: '146 قمراً موثقاً', en: '146 Documented Moons', fr: '146 lunes' },
        orbit: { ar: '29.45 سنة أرضية', en: '29.45 Earth Years', fr: '29,45 années terrestres' },
        speech: {
          ar: 'زحل جوهرة النظام الشمسي بنظامه الحلقي المذهل المكون من الجليد والصخور! كشف هويجنز سر حلقاته عام 1655!',
          en: 'Saturn is the majestic jewel of the Solar System with breathtaking rings of ice and rock discovered by Huygens in 1655!'
        }
      },
      uranus: {
        id: 'uranus',
        name: { ar: 'أورانوس', en: 'Uranus', fr: 'Uranus' },
        type: { ar: 'عملاق جليدي مائل', en: 'Tilted Ice Giant', fr: 'Géante de glace' },
        discovery: {
          ar: 'أول كوكب يُكتشف بواسطة التلسكوب في التاريخ البشري! اكتشفه السير ويليام هيرشل في 13 مارس 1781. زارته مركبة ناسا الأسطورية فوياجر 2 في 24 يناير 1986 ملتقطة أولى الصور القريبة لغلافه الجوي المائل بزاوية 98 درجة!',
          en: 'The first planet discovered with a telescope in human history! Discovered by Sir William Herschel on March 13, 1781. NASA legendary Voyager 2 conducted the only close flyby on January 24, 1986.',
          fr: 'Première planète découverte au télescope par William Herschel le 13 mars 1781. Survolée par Voyager 2 de la NASA en 1986.'
        },
        gravity: { ar: '8.69 م/ث²', en: '8.69 m/s²', fr: '8,69 m/s²' },
        temp: { ar: '-195°C (أبرد غلاف جوي)', en: '-195°C (Coldest Atmosphere)', fr: '-195°C' },
        moons: { ar: '28 قمراً معتمداً', en: '28 Known Moons', fr: '28 lunes' },
        orbit: { ar: '84 سنة أرضية', en: '84 Earth Years', fr: '84 années terrestres' },
        speech: {
          ar: 'أورانوس أول كوكب يكتشفه البشر بالتلسكوب بواسطة ويليام هيرشل عام 1781! يدور على جنبه بميلان 98 درجة ويزوره أبرد فضاء!',
          en: 'Uranus was the first planet discovered using a telescope by William Herschel in 1781! It spins sideways at a 98-degree tilt!'
        }
      },
      neptune: {
        id: 'neptune',
        name: { ar: 'نبتون', en: 'Neptune', fr: 'Neptune' },
        type: { ar: 'عملاق جليدي أزرق عاصف', en: 'Deep Azure Ice Giant', fr: 'Géante bleue' },
        discovery: {
          ar: 'أول كوكب يُكتشف عبر الحسابات الرياضية البحتة! تنبأ بموقعه الرياضي أوربان لوفيرييه وجون آدامز، ورصده بالتلسكوب يوهان غاله في 23 سبتمبر 1846. اقتربت منه مركبة ناسا فوياجر 2 في أغسطس 1989 راصدة رياحاً عاتية تصل لـ 2,000 كم/ساعة!',
          en: 'The only planet discovered purely via mathematical prediction! Predicted by Le Verrier and Adams, and confirmed telescopically by Johann Galle on September 23, 1846. Visited by NASA Voyager 2 in 1989.',
          fr: 'Seule planète découverte par le calcul mathématique en 1846 par Le Verrier et Galle. Survolée par Voyager 2 de la NASA en 1989.'
        },
        gravity: { ar: '11.15 م/ث²', en: '11.15 m/s²', fr: '11,15 m/s²' },
        temp: { ar: '-200°C', en: '-200°C', fr: '-200°C' },
        moons: { ar: '16 قمراً موثقاً', en: '16 Documented Moons', fr: '16 lunes' },
        orbit: { ar: '164.8 سنة أرضية', en: '164.8 Earth Years', fr: '164,8 années terrestres' },
        speech: {
          ar: 'نبتون الكوكب الأزرق العاصف! هو الكوكب الوحيد المكتشف بالمعادلات الرياضية البحتة قبل التلسكوب عام 1846، وتصل رياحه إلى 2000 كم/ساعة!',
          en: 'Neptune is the tempestuous azure world, the only planet found by mathematics before telescope discovery in 1846, with winds over 1,200 mph!'
        }
      },
      iss: {
        id: 'iss',
        name: { ar: 'محطة الفضاء الدولية (ISS)', en: 'International Space Station (ISS)', fr: 'Station Spatiale Internationale (ISS)' },
        type: { ar: 'مختبر أبحاث مأهول في مدار الأرض', en: 'Habitable Microgravity Laboratory', fr: 'Laboratoire orbital habité' },
        discovery: {
          ar: 'أكبر هيكل من صنع البشر في الفضاء الخارجي! أُطلق أول أجزائها (الموديول زاريا) في 20 نوفمبر 1998 كتعاون بين ناسا وروسيا وأوروبا واليابان وكندا. تدور حول الأرض على ارتفاع 420 كم بسرعة مذهلة تبلغ 28,000 كم/ساعة، وتكمل دورة كاملة حول كوكبنا كل 90 دقيقة!',
          en: 'Humanity\'s greatest engineering marvel in orbit! The first module (Zarya) launched on November 20, 1998, as a global partnership between NASA, Roscosmos, ESA, JAXA, and CSA. It orbits Earth at 17,500 mph (28,000 km/h) every 90 minutes!',
          fr: 'Le plus grand chef-d\'œuvre de l\'ingénierie spatiale humaine ! Lancée le 20 novembre 1998 par la NASA, Roscosmos, l\'ESA, la JAXA et l\'ASC. Elle tourne autour de la Terre à 28 000 km/h toutes les 90 minutes !'
        },
        gravity: { ar: '0.9 م/ث² (سقوط حر / انعدام وزن)', en: '0.9 m/s² (Microgravity Freefall)', fr: 'Microgravité (Chute libre)' },
        temp: { ar: '-157°C في الظل إلى 121°C في الشمس', en: '-157°C to 121°C', fr: '-157°C à 121°C' },
        moons: { ar: 'مأهولة برواد فضاء مستمرين منذ عام 2000', en: 'Crew of 7 Astronauts (Continuously occupied)', fr: 'Équipage permanent de 7 astronautes' },
        orbit: { ar: '90 دقيقة (16 شروق وغروب شمس يومياً)', en: '90 Minutes (16 Sunrises/Day)', fr: '90 Minutes (16 levers de soleil/jour)' },
        speech: {
          ar: 'محطة الفضاء الدولية، أعظم إنجاز بشري علمي في الفضاء! تدور حول الأرض بسرعة 28 ألف كم في الساعة، ويشهد رواد الفضاء على متنها شروق الشمس ستة عشر مرة يومياً!',
          en: 'The International Space Station, humanity\'s crowning orbital laboratory! Traveling at 17,500 mph, astronauts aboard witness 16 breathtaking sunrises and sunsets every single day!'
        }
      }
    },
    planets: [
      {
        id: 'mercury',
        name: { ar: 'عطارد (Mercury)', en: 'Mercury', fr: 'Mercure' },
        badge: { ar: 'الكوكب الأقرب للشمس', en: 'Closest to the Sun', fr: 'Plus proche du Soleil' },
        desc: {
          ar: 'أصغر كواكب المجموعة الشمسية وأسرعها دوراناً حول الشمس، تنعدم فيه الرياح والغلاف الجوي الحابس للحرارة.',
          en: 'The smallest planet in the Solar System and closest to the Sun, completing an orbit in just 88 Earth days.',
          fr: 'La plus petite planète et la plus proche du Soleil, orbitant en seulement 88 jours terrestres.'
        },
        metric1: { ar: 'الجاذبية: 3.7 م/ث²', en: 'Gravity: 3.7 m/s²', fr: 'Gravité: 3,7 m/s²' },
        metric2: { ar: 'الحرارة: -180° إلى 430°C', en: 'Temp: -180° to 430°C', fr: 'Temp: -180° à 430°C' }
      },
      {
        id: 'venus',
        name: { ar: 'الزهرة (Venus)', en: 'Venus', fr: 'Vénus' },
        badge: { ar: 'الكوكب الأكثر حرارة', en: 'Hottest Planet', fr: 'Planète la plus chaude' },
        desc: {
          ar: 'توأم الأرض في الحجم ولكن بغلاف جوي كثيف من ثاني أكسيد الكربون وسحب حمض الكبريتيك مع احتباس حراري جهنمي.',
          en: 'Often called Earth\'s sister planet, blanketed in thick carbon dioxide clouds trapping heat at a scorching 475°C.',
          fr: 'Jumelle de la Terre par la taille, enveloppée d\'une atmosphère étouffante de CO2 et de nuages sulfuriques.'
        },
        metric1: { ar: 'الجاذبية: 8.87 م/ث²', en: 'Gravity: 8.87 m/s²', fr: 'Gravité: 8,87 m/s²' },
        metric2: { ar: 'الحرارة: 475°C ثابتة', en: 'Temp: 475°C Constant', fr: 'Temp: 475°C Constante' }
      },
      {
        id: 'earth',
        name: { ar: 'الأرض (Earth)', en: 'Earth', fr: 'Terre' },
        badge: { ar: 'واحة الحياة الكونية', en: 'Oasis of Life', fr: 'Oasis de la vie' },
        desc: {
          ar: 'الكوكب الوحيد المعروف بوجود ماء سائل وحياة وغلاف جوي غني بالأكسجين ومجال مغناطيسي يحمي من الإشعاع الشمسي.',
          en: 'Our home planet, the only known celestial body harboring vibrant life, liquid oceans, and protective atmosphere.',
          fr: 'Notre planète, le seul monde connu abritant des océans d\'eau liquide et une biosphère florissante.'
        },
        metric1: { ar: 'الجاذبية: 9.8 م/ث²', en: 'Gravity: 9.8 m/s²', fr: 'Gravité: 9,8 m/s²' },
        metric2: { ar: 'الأقمار: قمر واحد طبيعي', en: 'Moons: 1 Natural Moon', fr: 'Lunes: 1 Lune' }
      },
      {
        id: 'mars',
        name: { ar: 'المريخ (Mars)', en: 'Mars', fr: 'Mars' },
        badge: { ar: 'الكوكب الأحمر الواعد', en: 'The Red Planet', fr: 'La Planète Rouge' },
        desc: {
          ar: 'كوكب صحراوي بارد يحتوي على جبل أوليمبوس أضخم بركان في المجموعة الشمسية، وهو هدف ناسا القادم لإنزال البشر.',
          en: 'Dusty, cold desert world with a thin atmosphere, giant extinct volcanoes, and primary destination for future human exploration.',
          fr: 'Monde désertique rougeoyant abritant le mont Olympe et cible majeure des futures missions humaines de la NASA.'
        },
        metric1: { ar: 'الجاذبية: 3.72 م/ث²', en: 'Gravity: 3.72 m/s²', fr: 'Gravité: 3,72 m/s²' },
        metric2: { ar: 'الأقمار: فوبوس وديموس', en: 'Moons: Phobos & Deimos', fr: 'Lunes: Phobos et Déimos' }
      },
      {
        id: 'jupiter',
        name: { ar: 'المشتري (Jupiter)', en: 'Jupiter', fr: 'Jupiter' },
        badge: { ar: 'سيد الكواكب الغازية', en: 'Gas Giant Giant', fr: 'Géante gazeuse' },
        desc: {
          ar: 'أضخم كواكب المجموعة الشمسية بأكثر من ضعفي كتلة كل الكواكب مجتمعة، وتشتهر ببقعتها الحمراء العظيمة كعاصفة عملاقة.',
          en: 'More than twice as massive as all other solar planets combined, featuring the iconic Great Red Spot storm.',
          fr: 'Plus massive que toutes les autres planètes réunies, réputée pour sa mythique Grande Tache Rouge.'
        },
        metric1: { ar: 'الجاذبية: 24.79 م/ث²', en: 'Gravity: 24.79 m/s²', fr: 'Gravité: 24,79 m/s²' },
        metric2: { ar: 'الأقمار: 95 قمراً معتمداً', en: 'Moons: 95 Confirmed', fr: 'Lunes: 95 Confirmées' }
      },
      {
        id: 'saturn',
        name: { ar: 'زحل (Saturn)', en: 'Saturn', fr: 'Saturne' },
        badge: { ar: 'جوهرة الحلقات الجليدية', en: 'The Ringed Jewel', fr: 'Joyau aux anneaux' },
        desc: {
          ar: 'كوكب غازي رائع يتميز بنظام حلقات مهيب ممتد لآلاف الكيلومترات ومكون من مليارات القطع الجليدية والصخرية.',
          en: 'Adorned with thousands of breathtaking ringlets made of ice and rock chunks, surrounded by 146 moons.',
          fr: 'Célèbre pour son complexe d\'anneaux spectaculaires de glace et de poussière et ses 146 satellites.'
        },
        metric1: { ar: 'الجاذبية: 10.44 م/ث²', en: 'Gravity: 10.44 m/s²', fr: 'Gravité: 10,44 m/s²' },
        metric2: { ar: 'الأقمار: 146 قمراً موثقاً', en: 'Moons: 146 Moons', fr: 'Lunes: 146 Lunes' }
      },
      {
        id: 'uranus',
        name: { ar: 'أورانوس (Uranus)', en: 'Uranus', fr: 'Uranus' },
        badge: { ar: 'العملاق الجليدي المائل', en: 'Tilted Ice Giant', fr: 'Géante de glace' },
        desc: {
          ar: 'أول كوكب يُكتشف بالتلسكوب، يتميز بميلانه الشديد بزاوية 98 درجة وأبرد غلاف جوي كوكبي في المجموعة الشمسية.',
          en: 'First planet discovered with a telescope, tilted sideways at 98 degrees and featuring the coldest planetary atmosphere.',
          fr: 'Première planète découverte au télescope, inclinée à 98 degrés avec l\'atmosphère la plus froide du système solaire.'
        },
        metric1: { ar: 'الجاذبية: 8.69 م/ث²', en: 'Gravity: 8.69 m/s²', fr: 'Gravité: 8,69 m/s²' },
        metric2: { ar: 'الأقمار: 28 قمراً معتمداً', en: 'Moons: 28 Confirmed', fr: 'Lunes: 28 Confirmées' }
      },
      {
        id: 'neptune',
        name: { ar: 'نبتون (Neptune)', en: 'Neptune', fr: 'Neptune' },
        badge: { ar: 'الكوكب الأزرق العاصف', en: 'Windy Azure Giant', fr: 'Géante bleue' },
        desc: {
          ar: 'الكوكب الأبعد المكتشف بالمعادلات الرياضية، يتميز برياح خارقة تفوق سرعة الصوت تصل إلى 2,000 كم/ساعة ولون أزرق داكن.',
          en: 'Outermost planet discovered by mathematics, known for supersonic winds up to 1,200 mph and vivid deep blue color.',
          fr: 'Planète la plus lointaine découverte par le calcul, avec des vents supersoniques atteignant 2 000 km/h.'
        },
        metric1: { ar: 'الجاذبية: 11.15 م/ث²', en: 'Gravity: 11.15 m/s²', fr: 'Gravité: 11,15 m/s²' },
        metric2: { ar: 'الأقمار: 16 قمراً موثقاً', en: 'Moons: 16 Moons', fr: 'Lunes: 16 Lunes' }
      }
    ],
    equipment: [
      {
        id: 'jwst',
        name: { ar: 'تلسكوب جيمس ويب (James Webb)', en: 'James Webb Space Telescope', fr: 'Télescope Spatial James Webb' },
        badge: { ar: 'مرصد الأشعة تحت الحمراء', en: 'Deep Infrared Observatory', fr: 'Observatoire Infrarouge' },
        desc: {
          ar: 'أقوى تلسكوب فضائي في تاريخ البشرية، مزود بمرايا سداسية مطلية بالذهب عيار 24 لرصد فجر أولى المجرات الكونية.',
          en: 'The premier deep-space observatory viewing the universe in high-resolution infrared light to unravel cosmic dawn.',
          fr: 'Le plus puissant télescope spatial jamais conçu, doté de miroirs béryllium dorés pour sonder les confins du cosmos.'
        },
        metric1: { ar: 'الموقع: نقطة لاغرانج L2', en: 'Location: Lagrange L2', fr: 'Poste: Point Lagrange L2' },
        metric2: { ar: 'قطر المرآة: 6.5 متر', en: 'Mirror: 6.5 meters', fr: 'Miroir: 6,5 mètres' }
      },
      {
        id: 'iss',
        name: { ar: 'محطة الفضاء الدولية (ISS)', en: 'International Space Station', fr: 'Station Spatiale Internationale' },
        badge: { ar: 'المختبر المداري المأهول', en: 'Orbital Microgravity Lab', fr: 'Laboratoire Orbital' },
        desc: {
          ar: 'أكبر مختبر فضائي دولي يدور حول الأرض كل 90 دقيقة بسرعة 28,000 كم/ساعة لإجراء أبحاث انعدام الجاذبية والطب الفضائي.',
          en: 'A football-field-sized habitable space station orbiting Earth every 90 minutes at 17,500 mph for science research.',
          fr: 'Structure orbitale géante habitée en permanence tournant à 28 000 km/h pour la recherche scientifique.'
        },
        metric1: { ar: 'السرعة: 28,000 كم/ساعة', en: 'Speed: 17,500 mph', fr: 'Vitesse: 28 000 km/h' },
        metric2: { ar: 'الارتفاع: 420 كم عن الأرض', en: 'Altitude: 420 km', fr: 'Altitude: 420 km' }
      },
      {
        id: 'artemis',
        name: { ar: 'صاروخ أرتميس SLS ومركبة أوريون', en: 'NASA Artemis SLS & Orion', fr: 'Fusée Artemis SLS & Orion' },
        badge: { ar: 'مشروع العودة إلى القمر', en: 'Moon & Deep Space Return', fr: 'Programme Lunaire Artemis' },
        desc: {
          ar: 'نظام الإطلاق الفضائي الخارق من ناسا المصمم لحمل الجيل الجديد من رواد الفضاء والهبوط على القطب الجنوبي للقمر.',
          en: 'NASA\'s most powerful super-heavy rocket designed to carry astronauts back to the Moon and onto Mars.',
          fr: 'Le plus puissant lanceur spatial conçu pour renvoyer des astronautes sur la surface de la Lune puis vers Mars.'
        },
        metric1: { ar: 'قوة الدفع: 39.1 ميجانيوتن', en: 'Thrust: 8.8M lbs', fr: 'Poussée: 39,1 MN' },
        metric2: { ar: 'الهدف: استكشاف القمر والمريخ', en: 'Target: Moon & Mars', fr: 'Objectif: Lune & Mars' }
      },
      {
        id: 'xemu',
        name: { ar: 'بدلة الفضاء المتطورة (xEMU)', en: 'Next-Gen xEMU Spacesuit', fr: 'Scaphandre Spatial xEMU' },
        badge: { ar: 'وحدة دعم الحياة الذاتية', en: 'Exploration Life Support', fr: 'Système de Survie Mobile' },
        desc: {
          ar: 'مركبة فضائية مصغرة على شكل بدلة توفر الأكسجين والضغط وحماية من درجات حرارة تتراوح بين -150° إلى +120°C.',
          en: 'A personalized spacecraft providing life support, mobility, radiation shielding, and thermal protection during spacewalks.',
          fr: 'Véritable vaisseau spatial miniature offrant oxygène, régulation thermique extrême et protection anti-radiation.'
        },
        metric1: { ar: 'مدة العمل: 8 ساعات متواصلة', en: 'EVA Duration: 8 hours', fr: 'Autonomie: 8 heures' },
        metric2: { ar: 'الحماية: من الإشعاع والحرارة', en: 'Shielding: Thermal & Rad', fr: 'Protection: Radiations' }
      }
    ],
    academy: [
      {
        step: 1,
        title: { ar: 'التأهيل البدني ومقاومة قوى G', en: 'Physical & G-Force Conditioning', fr: 'Conditionnement Physique & Force G' },
        desc: {
          ar: 'تمارين مكثفة لتقوية عضلات القلب والأوعية الدموية وتدريب جهاز الطرد المركزي لمقاومة قوى تسارع الصواريخ (حتى 4G).',
          en: 'Rigorous cardiovascular training and centrifuge tests conditioning the body to withstand heavy rocket acceleration forces.',
          fr: 'Entraînement cardiovasculaire intensif et centrifugeuse pour tolérer les accélérations foudroyantes du décollage.'
        }
      },
      {
        step: 2,
        title: { ar: 'مختبر الطفو الحيادي وانعدام الوزن', en: 'Neutral Buoyancy Laboratory', fr: 'Laboratoire de Flottabilité Neutre' },
        desc: {
          ar: 'ساعات تدريب تحت الماء داخل مسبح ناسا العملاق (NBL) لمحاكاة انعدام الجاذبية وإتقان حركة الذراعين بالأدوات الفضائية.',
          en: 'Diving deep in NASA\'s giant 6.2-million-gallon pool to simulate microgravity and master tool manipulation.',
          fr: 'Des dizaines d\'heures sous l\'eau dans la piscine géante de la NASA pour simuler la micropesanteur spatiale.'
        }
      },
      {
        step: 3,
        title: { ar: 'بروتوكول المشي في الفضاء (EVA)', en: 'Spacewalk Protocols & Systems', fr: 'Protocoles de Sortie Extravéhiculaire' },
        desc: {
          ar: 'التدرب على قفل الهواء والاتصال المستمر مع غرفة القيادة في هيوستن وحل حالات الطوارئ في البيئة الفراغية.',
          en: 'Mastering airlock cycling, tether management, communications with Mission Control in Houston, and vacuum survival.',
          fr: 'Maîtrise des sas pressurisés, communications avec Houston et gestion des urgences en milieu sous vide.'
        }
      },
      {
        step: 4,
        title: { ar: 'محاكي قيادة المركبات والالتحام', en: 'Flight Simulator & Docking', fr: 'Simulateur de Vol & Amarrage' },
        desc: {
          ar: 'التحكم اليدوي والآلي بكبسولة الفضاء والالتحام الدقيق مع محطة الفضاء الدولية بمعدل خطأ صفري.',
          en: 'Executing precise manual and automated spacecraft maneuvers, orbital trajectories, and zero-margin docking maneuvers.',
          fr: 'Pilotage manuel et automatique de capsules et manœuvres d\'amarrage de haute précision avec la station spatiale.'
        }
      }
    ]
  };

  // Sound Synthesizer (Native Web Audio API)
  function playSynthSound(type) {
    if (!state.soundEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!state.audioCtx) {
        state.audioCtx = new AudioCtxClass();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const ctx = state.audioCtx;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'whoosh') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.35);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'type') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1150 + Math.random() * 150, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'success') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.1, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + 1.0);
        });
      }
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  // ========================================================
  // ULTRA-HIGH-FIDELITY NEURAL ARABIC VOICE ENGINE (Human Studio Quality)
  // Primary: Cloud Neural Audio Stream (Studio-grade Arabic enunciation)
  // Fallback: Browser Web Speech API
  // ========================================================
  let availableVoices = [];
  function populateVoices() {
    if ('speechSynthesis' in window) {
      availableVoices = window.speechSynthesis.getVoices() || [];
    }
  }
  populateVoices();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }

  // Active audio player instance & queue for seamless sentence chaining
  let activeAudio = null;
  let speechQueue = [];
  let isSpeakingSequence = false;

  function stopAllSpeech() {
    isSpeakingSequence = false;
    speechQueue = [];
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.src = '';
      activeAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (window.astro3DController) {
      window.astro3DController.setSpeaking(false);
    }
  }

  // Prepares text for pristine Arabic phonetic recitation (removes Latin parentheticals, expands units)
  function prepareSpeechText(rawText, lang) {
    if (!rawText) return '';
    let text = rawText
      // Remove emojis & decorative symbols
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/[•\*#_`~]/g, '');

    if (lang === 'ar') {
      text = text
        // Remove Latin names inside parentheses, e.g. "درب التبانة (Milky Way)" -> "درب التبانة"
        .replace(/\s*\([A-Za-z0-9\s*#+._-]+\)/g, '')
        // Expand scientific units and abbreviations into fluent Arabic words
        .replace(/كم\/ساعة/g, ' كيلومتراً في الساعة ')
        .replace(/كم\/ثانية/g, ' كيلومتراً في الثانية ')
        .replace(/م\/ث²/g, ' متراً لكل ثانية مربعة ')
        .replace(/س\.ض/g, ' سنة ضوئية ')
        .replace(/°C/g, ' درجة مئوية ')
        .replace(/—|–/g, '، ')
        // Ensure commas give natural breathing pauses
        .replace(/([،,])\s*/g, '$1 ')
        .replace(/\s+/g, ' ');
    }
    return text.trim();
  }

  // Smart sentence chunker (max 120 chars per chunk at natural punctuation boundaries)
  function chunkSpeechText(text, maxLen = 120) {
    if (!text) return [];
    const tokens = text.split(/([.!؟،,\n]+)/);
    const chunks = [];
    let current = '';

    for (let i = 0; i < tokens.length; i++) {
      const part = tokens[i];
      if (!part) continue;
      if ((current + part).length <= maxLen) {
        current += part;
      } else {
        if (current.trim()) chunks.push(current.trim());
        if (part.length > maxLen) {
          const words = part.split(/\s+/);
          let sub = '';
          for (const w of words) {
            if ((sub + ' ' + w).length <= maxLen) {
              sub = sub ? sub + ' ' + w : w;
            } else {
              if (sub.trim()) chunks.push(sub.trim());
              sub = w;
            }
          }
          current = sub;
        } else {
          current = part;
        }
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  // Intelligent Voice Selector prioritizing Studio Neural & Natural Voices
  function selectBestVoice(targetLang) {
    if (!availableVoices || availableVoices.length === 0) {
      populateVoices();
    }
    const voices = availableVoices;
    if (!voices || voices.length === 0) return null;

    if (targetLang === 'ar') {
      const arVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ar'));
      if (arVoices.length === 0) return null;

      // Priority 1: High-Fidelity Natural / Neural / Online voices (Edge & Windows 11 studio voices)
      const natural = arVoices.find(v => /natural|neural|online/i.test(v.name));
      if (natural) return natural;

      // Priority 2: Google Arabic (Chrome high-quality TTS)
      const google = arVoices.find(v => /google/i.test(v.name));
      if (google) return google;

      // Priority 3: Premium curated Arabic voices (Salma, Shakir, Hamed, Zariyah, Maged, Tarik, Laila, Naayf)
      const premium = arVoices.find(v => /salma|shakir|hamed|zariyah|fatima|maged|tarik|laila|naayf/i.test(v.name));
      if (premium) return premium;

      // Priority 4: Regional Arabic voices (Saudi Arabia, Egypt)
      const regional = arVoices.find(v => /ar[-_](sa|eg)/i.test(v.lang));
      if (regional) return regional;

      return arVoices[0];
    } else if (targetLang === 'fr') {
      const frVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
      const natural = frVoices.find(v => /natural|neural|online|google/i.test(v.name));
      return natural || frVoices[0] || null;
    } else {
      const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
      const natural = enVoices.find(v => /natural|neural|online|google/i.test(v.name));
      return natural || enVoices[0] || null;
    }
  }

  // Offline Web Speech API fallback
  function fallbackSpeechSynthesis(chunk, lang, onDone) {
    if (!('speechSynthesis' in window)) {
      if (onDone) onDone();
      return;
    }
    try {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.94;
      utterance.pitch = 1.0;

      const bestVoice = selectBestVoice(lang);
      if (bestVoice) utterance.voice = bestVoice;

      utterance.onend = () => { if (onDone) onDone(); };
      utterance.onerror = () => { if (onDone) onDone(); };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onDone) onDone();
    }
  }

  // Main Speech Dispatcher: Streams Cloud Neural Audio for natural human accent
  function speakAstorVoice(text) {
    if (!state.soundEnabled || state.astroMuted) return;
    stopAllSpeech();

    const lang = state.currentLang || 'ar';
    const cleanText = prepareSpeechText(text, lang);
    if (!cleanText) return;

    const chunks = chunkSpeechText(cleanText);
    if (!chunks.length) return;

    speechQueue = [...chunks];
    isSpeakingSequence = true;

    // Trigger gestures & mouth
    if (window.astro3DController) {
      window.astro3DController.setSpeaking(true);
    }

    const playNext = () => {
      if (!isSpeakingSequence || state.astroMuted || speechQueue.length === 0) {
        isSpeakingSequence = false;
        if (window.astro3DController) {
          window.astro3DController.setSpeaking(false);
        }
        return;
      }

      const chunk = speechQueue.shift();
      const targetCode = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en';

      let fallbackHandled = false;
      const doFallback = () => {
        if (fallbackHandled) return;
        fallbackHandled = true;
        if (activeAudio) {
          activeAudio.onended = null;
          activeAudio.onerror = null;
          try { activeAudio.pause(); } catch (e) { }
          activeAudio = null;
        }
        fallbackSpeechSynthesis(chunk, lang, () => playNext());
      };

      // 1. Try local server proxy first (/api/tts), fallback to direct Google TTS endpoint
      const proxyUrl = `/api/tts?q=${encodeURIComponent(chunk)}&tl=${targetCode}`;
      const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${targetCode}&client=tw-ob`;

      const audio = new Audio();
      activeAudio = audio;

      audio.onended = () => {
        if (!fallbackHandled) {
          activeAudio = null;
          playNext();
        }
      };

      audio.onerror = () => {
        doFallback();
      };

      audio.src = proxyUrl;
      audio.play().catch(() => {
        if (!fallbackHandled) {
          audio.src = directUrl;
          audio.play().catch(() => {
            doFallback();
          });
        }
      });
    };

    playNext();
  }

  // ========================================================
  // 3D INTERACTIVE ASTRO ASSISTANT (WebGL Rig, Gestures & Physics)
  // ========================================================
  function initAstor3DScene() {
    if (window.initAstor3DSceneModern) {
      window.initAstor3DSceneModern();
    }
  }

  // DOM Elements
  const htmlDoc = document.documentElement;
  const brandTitle = document.getElementById('brandTitle');
  const brandSubtitle = document.getElementById('brandSubtitle');
  const authHeading = document.getElementById('authHeading');
  const authSubheading = document.getElementById('authSubheading');
  const labelFullName = document.getElementById('labelFullName');
  const labelAge = document.getElementById('labelAge');
  const labelEmail = document.getElementById('labelEmail');
  const labelPassword = document.getElementById('labelPassword');
  const fullNameInput = document.getElementById('fullNameInput');
  const ageInput = document.getElementById('ageInput');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const registerForm = document.getElementById('registerForm');
  const registerSection = document.getElementById('registerSection');

  // Session & Nav Elements
  const userSessionChip = document.getElementById('userSessionChip');
  const sessionUserName = document.getElementById('sessionUserName');
  const signOutBtn = document.getElementById('signOutBtn');

  // iPhone Setup Elements
  const iphoneSetupOverlay = document.getElementById('iphoneSetupOverlay');
  const iphoneHelloContainer = document.getElementById('iphoneHelloContainer');
  const iphoneHelloText = document.getElementById('iphoneHelloText');
  const iphoneHint = document.getElementById('iphoneHint');

  // Dashboard & Astor Pod Elements
  const dashboardSection = document.getElementById('dashboardSection');
  const dashWelcomeTitle = document.getElementById('dashWelcomeTitle');
  const dashWelcomeSubtitle = document.getElementById('dashWelcomeSubtitle');
  const astroStatusLabel = document.getElementById('astroStatusLabel');
  const astroNameTag = document.getElementById('astroNameTag');
  const astroImg = document.getElementById('astroImg');
  const astorVisualStage = document.getElementById('astorVisualStage');
  const astorDialogueBox = document.getElementById('astorDialogueBox');
  const speakAstorBtn = document.getElementById('speakAstorBtn');
  const voiceStatusText = document.getElementById('voiceStatusText');
  const astroTypewriterText = document.getElementById('astroTypewriterText');
  const typingIndicator = document.getElementById('typingIndicator');

  // Gateway & Exploration Hub Elements
  const gatewayCard = document.getElementById('gatewayCard');
  const gatewayStartView = document.getElementById('gatewayStartView');
  const missionVideoStage = document.getElementById('missionVideoStage');
  const missionLaunchVideo = document.getElementById('missionLaunchVideo');
  const videoOverlayBlocker = document.getElementById('videoOverlayBlocker');
  const explorationHub = document.getElementById('explorationHub');
  const missionStatusText = document.getElementById('missionStatusText');
  const gatewayTitle = document.getElementById('gatewayTitle');
  const gatewaySubtitle = document.getElementById('gatewaySubtitle');
  const startBtnLabel = document.getElementById('startBtnLabel');
  const missionAwaitingText = document.getElementById('missionAwaitingText');
  const startNowBtn = document.getElementById('startNowBtn');
  const returnGatewayBtn = document.getElementById('returnGatewayBtn');
  const returnBtnLabel = document.getElementById('returnBtnLabel');

  // NASA Live API & Modal Elements
  const nasaSearchInput = document.getElementById('nasaSearchInput');
  const nasaSearchBtn = document.getElementById('nasaSearchBtn');
  const nasaSearchResults = document.getElementById('nasaSearchResults');
  const nasaModal = document.getElementById('nasaModal');
  const closeNasaModalBtn = document.getElementById('closeNasaModalBtn');
  const nasaModalTitle = document.getElementById('nasaModalTitle');
  const nasaModalId = document.getElementById('nasaModalId');
  const nasaModalImg = document.getElementById('nasaModalImg');
  const nasaModalLoader = document.getElementById('nasaModalLoader');
  const nasaModalCenter = document.getElementById('nasaModalCenter');
  const nasaModalDate = document.getElementById('nasaModalDate');
  const nasaModalDesc = document.getElementById('nasaModalDesc');

  // Hub Tabs & Grids
  const hubTabButtons = document.querySelectorAll('.hub-tab-btn');
  const tabLabelGalaxies = document.getElementById('tabLabelGalaxies');
  const tabLabelPlanets = document.getElementById('tabLabelPlanets');
  const tabLabelEquipment = document.getElementById('tabLabelEquipment');
  const tabLabelAcademy = document.getElementById('tabLabelAcademy');
  const sectorGalaxies = document.getElementById('sectorGalaxies');
  const sectorPlanets = document.getElementById('sectorPlanets');
  const sectorEquipment = document.getElementById('sectorEquipment');
  const sectorAcademy = document.getElementById('sectorAcademy');
  const galaxiesGrid = document.getElementById('galaxiesGrid');
  const planetsGrid = document.getElementById('planetsGrid');
  const equipmentGrid = document.getElementById('equipmentGrid');
  const academySteps = document.getElementById('academySteps');

  // Academy Quiz & Badge
  const quizOptions = document.getElementById('quizOptions');
  const astronautBadgeEarned = document.getElementById('astronautBadgeEarned');
  const badgeCadetName = document.getElementById('badgeCadetName');

  // Controls
  const langButtons = document.querySelectorAll('.lang-btn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Supabase Modal
  const supabaseConfigBtn = document.getElementById('supabaseConfigBtn');
  const supabaseModal = document.getElementById('supabaseModal');
  const closeSupabaseModal = document.getElementById('closeSupabaseModal');
  const supabaseConfigForm = document.getElementById('supabaseConfigForm');
  const sbUrlInput = document.getElementById('sbUrlInput');
  const sbKeyInput = document.getElementById('sbKeyInput');
  const testSbBtn = document.getElementById('testSbBtn');
  const supabaseDot = document.getElementById('supabaseDot');
  const supabaseStatusText = document.getElementById('supabaseStatusText');

  // Toast Helper
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
    toast.innerHTML = `<i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // Typewriter Engine for Astor
  function startAstroTypewriter(text, onComplete) {
    if (state.typewriterTimer) clearInterval(state.typewriterTimer);
    astroTypewriterText.textContent = '';
    typingIndicator.style.display = 'flex';
    state.isTyping = true;
    if (window.astro3DController) window.astro3DController.setSpeaking(true);

    let index = 0;
    state.typewriterTimer = setInterval(() => {
      if (index < text.length) {
        astroTypewriterText.textContent += text.charAt(index);
        index++;
        if (index % 4 === 0) playSynthSound('type');
      } else {
        clearInterval(state.typewriterTimer);
        state.isTyping = false;
        typingIndicator.style.display = 'none';
        if (!isSpeakingSequence && (!('speechSynthesis' in window) || !window.speechSynthesis.speaking)) {
          if (window.astro3DController) window.astro3DController.setSpeaking(false);
        }
        if (onComplete) onComplete();
      }
    }, 24);
  }

  // Trigger speech and typewriter together on user interaction with Astor
  function triggerAstorInteraction(customText) {
    playSynthSound('click');
    if (window.astro3DController) {
      window.astro3DController.triggerWave();
    }
    const textToSpeak = customText || (state.currentUser ? i18n[state.currentLang].astroWelcomeMsg(state.currentUser.full_name) : 'Astro World Online');
    startAstroTypewriter(textToSpeak);
    if (!state.astroMuted) {
      speakAstorVoice(textToSpeak);
    }
  }

  // Friendly wave on clicking Astor stage without repeating audio
  if (astorVisualStage) {
    astorVisualStage.addEventListener('click', () => {
      playSynthSound('click');
      if (window.astro3DController) window.astro3DController.triggerWave();
    });
  }

  // Astro Mute / Voice Toggle Controller
  const muteAstorBtn = document.getElementById('muteAstorBtn') || document.getElementById('speakAstorBtn');

  function updateMuteButtonUI() {
    if (!muteAstorBtn) return;
    const isMuted = !!state.astroMuted;
    muteAstorBtn.classList.toggle('muted', isMuted);
    const icon = muteAstorBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
    }
    const textSpan = muteAstorBtn.querySelector('span');
    if (textSpan) {
      const lang = state.currentLang;
      if (isMuted) {
        textSpan.textContent = lang === 'ar' ? 'صامت 🔇' : (lang === 'fr' ? 'Muet 🔇' : 'Muted 🔇');
      } else {
        textSpan.textContent = lang === 'ar' ? 'صوت أسترو' : (lang === 'fr' ? 'Voix Astro' : 'Astro Voice');
      }
    }
    if (window.lucide) window.lucide.createIcons();
  }

  if (muteAstorBtn) {
    muteAstorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSynthSound('click');
      state.astroMuted = !state.astroMuted;
      localStorage.setItem('ASTRO_MUTED', state.astroMuted ? 'true' : 'false');
      if (state.astroMuted) {
        stopAllSpeech();
        showToast(state.currentLang === 'ar' ? 'تم كتم صوت أسترو 🔇' : 'Astro voice muted 🔇', 'info');
      } else {
        showToast(state.currentLang === 'ar' ? 'تم تفعيل صوت أسترو 🔊' : 'Astro voice unmuted 🔊', 'success');
      }
      updateMuteButtonUI();
    });
  }

  // Render Cosmic Catalog into DOM
  function renderCosmicSectors() {
    const lang = state.currentLang;

    // 1. Galaxies Grid (Unlocked: Discovery button | Locked: Lock badge)
    if (galaxiesGrid) {
      galaxiesGrid.innerHTML = cosmicCatalog.galaxies.map(g => {
        const isLocked = g.locked;
        const overlayBtn = isLocked
          ? `<div class="galaxy-lock-badge">
               <i data-lucide="lock" style="width: 18px; height: 18px;"></i>
               <span>${lang === 'ar' ? 'مغلق • استكشف درب التبانة أولاً' : lang === 'fr' ? 'Verrouillé' : 'Locked'}</span>
             </div>`
          : `<button type="button" class="galaxy-discovery-btn" aria-label="${lang === 'ar' ? 'ديسكفري' : 'Discovery'}">
               <i data-lucide="compass" class="discovery-btn-icon" style="width: 20px; height: 20px;"></i>
               <span>${lang === 'ar' ? 'ديسكفري' : lang === 'fr' ? 'Découverte' : 'Discovery'}</span>
             </button>`;
        return `<div class="galaxy-cinematic-card ${isLocked ? 'galaxy-locked' : 'galaxy-unlocked'}" data-galaxy="${g.id}">
          <div class="galaxy-card-name">
            <span class="galaxy-card-name-text">${g.name[lang]}</span>
            <span class="galaxy-card-name-badge">${g.type[lang]}</span>
          </div>
          <img src="${g.defaultImg}" alt="${g.name[lang]}" class="galaxy-card-photo" id="nasaImg_${g.id}" loading="lazy">
          <div class="galaxy-card-veil"></div>
          ${overlayBtn}
        </div>`;
      }).join('');

      loadNasaGalaxyImages();
    }

    // 2. Planets Grid (if present)
    if (planetsGrid) {
      planetsGrid.innerHTML = cosmicCatalog.planets.map(p => `
        <div class="cosmic-item-card" data-planet="${p.id}">
          <span class="card-badge"><i data-lucide="orbit" style="width: 13px; height: 13px;"></i> ${p.badge[lang]}</span>
          <h5>${p.name[lang]}</h5>
          <p>${p.desc[lang]}</p>
          <div class="card-metrics">
            <span>${p.metric1[lang]}</span>
            <span>${p.metric2[lang]}</span>
          </div>
        </div>
      `).join('');
    }

    // 3. Space Equipment Grid (if present)
    if (equipmentGrid) {
      equipmentGrid.innerHTML = cosmicCatalog.equipment.map(e => `
        <div class="cosmic-item-card" data-equipment="${e.id}">
          <span class="card-badge"><i data-lucide="cpu" style="width: 13px; height: 13px;"></i> ${e.badge[lang]}</span>
          <h5>${e.name[lang]}</h5>
          <p>${e.desc[lang]}</p>
          <div class="card-metrics">
            <span>${e.metric1[lang]}</span>
            <span>${e.metric2[lang]}</span>
          </div>
        </div>
      `).join('');
    }

    // 4. Academy Pathway Steps (if present)
    if (academySteps) {
      academySteps.innerHTML = cosmicCatalog.academy.map(s => `
        <div class="academy-step-card">
          <div class="step-num-pill">${s.step}</div>
          <h5 style="font-weight: 800; font-size: 1.05rem;">${s.title[lang]}</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">${s.desc[lang]}</p>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();

    // Attach card click handlers on .galaxy-cinematic-card
    document.querySelectorAll('.galaxy-cinematic-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const galaxyId = card.dataset.galaxy;
        const galaxyData = cosmicCatalog.galaxies.find(g => g.id === galaxyId);
        if (!galaxyData) return;

        // ── LOCKED GALAXY ──
        if (galaxyData.locked) {
          playSynthSound('error');
          if (window.astro3DController) window.astro3DController.pointAtCard();
          const lockMsg = state.currentLang === 'ar'
            ? 'هذه المجرة مقفلة حالياً... استكشف درب التبانة أولاً يا رائد الفضاء! 🔒'
            : state.currentLang === 'fr'
              ? 'Cette galaxie est verrouillée ! Explorez d\'abord la Voie Lactée ! 🔒'
              : 'This galaxy is locked! Explore the Milky Way first! 🔒';
          triggerAstorInteraction(lockMsg);
          showToast(state.currentLang === 'ar' ? '🔒 المجرة مقفلة! استكشف درب التبانة أولاً' : '🔒 Galaxy Locked! Explore Milky Way first', 'warning');
          return;
        }

        // ── UNLOCKED MILKY WAY → Launch Solar System ──
        if (galaxyId === 'milkyway') {
          // Launch Solar System experience whether clicking card or discovery button
          launchSolarSystemExperience();
          return;
        }
      });
    });

    // Attach card click handlers so Astor explains any other clicked item
    document.querySelectorAll('.cosmic-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h5')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        const msg = `${title} — ${desc}`;
        if (window.astro3DController) {
          window.astro3DController.pointAtCard();
        }
        triggerAstorInteraction(msg);
      });
    });
  }

  // ========================================================
  // SOLAR SYSTEM 3D EXPERIENCE ENGINE
  // ========================================================

  const dashboardLayout = document.getElementById('dashboardLayout');
  const solarSystemStage = document.getElementById('solarSystemStage');
  const planetHUD = document.getElementById('planetHUD');

  // Populate HUD with data for a given celestial body id
  function showPlanetHUD(bodyId) {
    const data = cosmicCatalog.solarSystem[bodyId];
    if (!data || !planetHUD) return;

    const lang = state.currentLang;

    document.getElementById('hudBodyName').textContent = data.name[lang] || data.name['en'] || data.name['ar'];
    document.getElementById('hudBodyType').textContent = data.type[lang] || data.type['en'] || data.type['ar'];
    document.getElementById('hudBodyDiscovery').textContent = data.discovery[lang] || data.discovery['en'] || data.discovery['ar'];
    document.getElementById('hudBodyGravity').textContent = (typeof data.gravity === 'object' ? data.gravity[lang] || data.gravity['en'] || data.gravity['ar'] : data.gravity);
    document.getElementById('hudBodyTemp').textContent = (typeof data.temp === 'object' ? data.temp[lang] || data.temp['en'] || data.temp['ar'] : data.temp);
    document.getElementById('hudBodyMoons').textContent = (typeof data.moons === 'object' ? data.moons[lang] || data.moons['en'] || data.moons['ar'] : data.moons);
    document.getElementById('hudBodyOrbit').textContent = (typeof data.orbit === 'object' ? data.orbit[lang] || data.orbit['en'] || data.orbit['ar'] : data.orbit);

    // Contextual label adaptation for Sun / ISS / Planets
    const labelMoons = document.getElementById('hudLabelMoons');
    if (labelMoons) {
      if (bodyId === 'sun') {
        labelMoons.textContent = lang === 'ar' ? 'الأجرام التابعة' : (lang === 'fr' ? 'Corps en orbite' : 'Orbiting Bodies');
      } else if (bodyId === 'iss') {
        labelMoons.textContent = lang === 'ar' ? 'الطاقم البشري' : (lang === 'fr' ? 'Équipage' : 'Crew');
      } else {
        labelMoons.textContent = lang === 'ar' ? 'الأقمار' : (lang === 'fr' ? 'Lunes' : 'Moons');
      }
    }
    const labelOrbit = document.getElementById('hudLabelOrbit');
    if (labelOrbit) {
      if (bodyId === 'sun') {
        labelOrbit.textContent = lang === 'ar' ? 'الدورة المجرية' : (lang === 'fr' ? 'Année galactique' : 'Galactic Orbit');
      } else {
        labelOrbit.textContent = lang === 'ar' ? 'الدورة المدارية' : (lang === 'fr' ? 'Orbite' : 'Orbital Period');
      }
    }

    planetHUD.style.display = 'flex';
    planetHUD.classList.add('hud-appear');
    setTimeout(() => planetHUD.classList.remove('hud-appear'), 600);

    // Update active pill
    document.querySelectorAll('.celestial-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.body === bodyId);
    });

    // Astro speaks for this planet on first click
    const speech = data.speech && (data.speech[lang] || data.speech['ar']);
    if (speech) {
      triggerAstorInteraction(speech);
    }
  }

  // Launch the full 3D Solar System experience
  function launchSolarSystemExperience() {
    playSynthSound('whoosh');

    // Cinematic transition
    if (dashboardLayout) dashboardLayout.classList.add('solar-mode');
    if (explorationHub) explorationHub.style.display = 'none';
    if (gatewayCard) gatewayCard.style.display = 'none';
    if (solarSystemStage) {
      solarSystemStage.style.display = 'flex';
      solarSystemStage.style.opacity = '0';
      requestAnimationFrame(() => {
        solarSystemStage.style.transition = 'opacity 0.6s ease';
        solarSystemStage.style.opacity = '1';
      });
    }

    // Astro docks to the left
    if (window.astro3DController) window.astro3DController.pointAtCard();

    // Boot or resume the Three.js solar system in overview mode
    if (window.solarSystemController) {
      const canvas = document.getElementById('solarCanvas');
      const container = document.getElementById('solarCanvasWrapper');
      if (canvas && container && !window.solarSystemController.initialized) {
        window.solarSystemController.init(canvas, container, (bodyId) => {
          showPlanetHUD(bodyId);
        });
      } else if (window.solarSystemController.initialized) {
        window.solarSystemController.onBodySelectedCallback = (bodyId) => showPlanetHUD(bodyId);
        if (!window.solarSystemController.motionPlaying) window.solarSystemController.toggleMotion();
      }

      window.solarSystemController.resetOverview();
    }

    // Hide any previous HUD so user starts in full panoramic view
    if (planetHUD) planetHUD.style.display = 'none';
    document.querySelectorAll('.celestial-pill').forEach(p => p.classList.remove('active'));

    // Astro single welcome announcement for solar tour
    const msg = state.currentLang === 'ar'
      ? 'مرحباً بكم في جولتنا ثلاثية الأبعاد عبر المجموعة الشمسية! انقر على أي كوكب للاقتراب منه واستكشاف أسراره!'
      : state.currentLang === 'fr'
        ? 'Bienvenue dans notre visite 3D du Système Solaire ! Cliquez sur une planète pour zoomer et explorer ses secrets !'
        : 'Welcome to our 3D tour of the Solar System! Click any planet to zoom in and explore its secrets!';
    triggerAstorInteraction(msg);
  }

  // Return to Galaxies Hub
  const returnToGalaxiesBtn = document.getElementById('returnToGalaxiesBtn');
  if (returnToGalaxiesBtn) {
    returnToGalaxiesBtn.addEventListener('click', () => {
      playSynthSound('click');
      if (dashboardLayout) dashboardLayout.classList.remove('solar-mode');
      if (solarSystemStage) {
        solarSystemStage.style.opacity = '0';
        setTimeout(() => { solarSystemStage.style.display = 'none'; }, 500);
      }
      if (explorationHub) explorationHub.style.display = 'flex';
      if (planetHUD) planetHUD.style.display = 'none';
      // Pause solar system to save resources
      if (window.solarSystemController && window.solarSystemController.pause) {
        window.solarSystemController.pause();
      }
    });
  }

  // ========================================================
  // OUTPOST SURVIVAL GAMES EXPERIENCE LAUNCHER & RETURN
  // ========================================================
  const outpostGamesStage = document.getElementById('outpostGamesStage');
  const outpostGamesMount = document.getElementById('outpostGamesMount');
  const navOutpostGamesBtn = document.getElementById('navOutpostGamesBtn');
  const launchOutpostBannerBtn = document.getElementById('launchOutpostBannerBtn');
  const returnFromOutpostBtn = document.getElementById('returnFromOutpostBtn');

  async function launchOutpostGamesExperience() {
    playSynthSound('whoosh');

    // Ensure dashboard container is visible even if accessed before registering
    if (registerSection) registerSection.style.display = 'none';
    if (dashboardSection) {
      dashboardSection.style.display = 'block';
      dashboardSection.classList.add('active');
    }

    if (dashboardLayout) dashboardLayout.classList.remove('solar-mode');
    if (explorationHub) explorationHub.style.display = 'none';
    if (gatewayCard) gatewayCard.style.display = 'none';
    if (planetHUD) planetHUD.style.display = 'none';
    if (solarSystemStage) {
      solarSystemStage.style.display = 'none';
      if (window.solarSystemController && window.solarSystemController.pause) {
        window.solarSystemController.pause();
      }
    }

    if (outpostGamesStage) {
      outpostGamesStage.style.display = 'flex';
      outpostGamesStage.style.opacity = '0';
      requestAnimationFrame(() => {
        outpostGamesStage.style.transition = 'opacity 0.5s ease';
        outpostGamesStage.style.opacity = '1';
      });
    }

    if (window.astro3DController && window.astro3DController.pointAtCard) {
      window.astro3DController.pointAtCard();
    }

    // Mount Outpost UI
    try {
      let mountFn = window.mountOutpostGames;
      if (!mountFn) {
        for (let i = 0; i < 20; i++) {
          if (window.mountOutpostGames) { mountFn = window.mountOutpostGames; break; }
          await new Promise(r => setTimeout(r, 80));
        }
      }
      if (!mountFn) {
        const mod = await import('./js/outpost-ui.js');
        mountFn = mod.mountOutpostGames;
      }
      if (mountFn && outpostGamesMount) {
        mountFn(outpostGamesMount, state.currentLang, (speechText) => {
          triggerAstorInteraction(speechText);
        });
      }
    } catch (err) {
      console.warn('Outpost UI mount error:', err);
    }

    // Astro single welcome announcement
    setTimeout(() => {
      const welcomeMsg = state.currentLang === 'ar'
        ? 'مرحباً بك على متن محطة الفضاء الدولية في مدار الأرض! تجوّل بين وحدات المحطة بحرية وكن مستعداً للمهام الطارئة!'
        : state.currentLang === 'fr'
          ? 'Bienvenue à bord de la Station Spatiale Internationale ! Explorez librement les modules et préparez-vous aux missions !'
          : 'Welcome aboard the International Space Station orbiting Earth! Explore the station modules freely and stay ready for alerts!';
      triggerAstorInteraction(welcomeMsg);
    }, 350);
  }

  function returnFromOutpostExperience() {
    playSynthSound('click');
    if (window.unmountOutpostGames) {
      try { window.unmountOutpostGames(); } catch (e) { }
    }
    if (outpostGamesStage) {
      outpostGamesStage.style.opacity = '0';
      setTimeout(() => { outpostGamesStage.style.display = 'none'; }, 400);
    }
    if (state.currentUser) {
      if (explorationHub) explorationHub.style.display = 'flex';
    } else {
      // If entered as guest from navbar, return smoothly to exploration hub
      if (explorationHub) {
        explorationHub.style.display = 'flex';
      } else if (gatewayCard) {
        gatewayCard.style.display = 'flex';
      }
    }
  }

  if (navOutpostGamesBtn) {
    navOutpostGamesBtn.addEventListener('click', launchOutpostGamesExperience);
  }
  if (launchOutpostBannerBtn) {
    launchOutpostBannerBtn.addEventListener('click', launchOutpostGamesExperience);
  }
  if (returnFromOutpostBtn) {
    returnFromOutpostBtn.addEventListener('click', returnFromOutpostExperience);
  }

  // Solar System toolbar buttons
  const solarFullscreenBtn = document.getElementById('solarFullscreenBtn');
  const solarFullscreenIcon = document.getElementById('solarFullscreenIcon');
  const solarResetCamBtn = document.getElementById('solarResetCamBtn');
  const solarPauseMotionBtn = document.getElementById('solarPauseMotionBtn');
  const solarMotionIcon = document.getElementById('solarMotionIcon');
  const closePlanetHUDBtn = document.getElementById('closePlanetHUDBtn');
  const hudResetOrbitBtn = document.getElementById('hudResetOrbitBtn');
  const speakPlanetBtn = document.getElementById('speakPlanetBtn');

  // True Browser Native Fullscreen & CSS Stage Toggle
  if (solarFullscreenBtn && solarSystemStage) {
    solarFullscreenBtn.addEventListener('click', async () => {
      playSynthSound('click');

      const isCurrentlyFullscreen = document.fullscreenElement != null || solarSystemStage.classList.contains('fullscreen-mode');

      if (!isCurrentlyFullscreen) {
        // 1. Enter True Native OS Fullscreen (fills entire laptop monitor)
        try {
          if (solarSystemStage.requestFullscreen) {
            await solarSystemStage.requestFullscreen();
          } else if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (err) {
          console.warn('Native fullscreen request note:', err);
        }

        // 2. Add CSS class for stage layout
        solarSystemStage.classList.add('fullscreen-mode');

        if (solarFullscreenIcon) {
          solarFullscreenIcon.setAttribute('data-lucide', 'minimize');
          if (window.lucide) window.lucide.createIcons();
        }

        showToast(state.currentLang === 'ar' ? 'تم تفعيل ملء الشاشة الكامل للكمبيوتر 🚀' : 'True Fullscreen Enabled 🚀', 'info');
      } else {
        // Exit True Fullscreen
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
          }
        } catch (err) {
          console.warn('Exit fullscreen note:', err);
        }

        solarSystemStage.classList.remove('fullscreen-mode');

        if (solarFullscreenIcon) {
          solarFullscreenIcon.setAttribute('data-lucide', 'maximize');
          if (window.lucide) window.lucide.createIcons();
        }

        showToast(state.currentLang === 'ar' ? 'تم الخروج من ملء الشاشة' : 'Exited Fullscreen', 'info');
      }

      // Resize 3D renderer smoothly to fill new monitor resolution
      setTimeout(() => {
        if (window.solarSystemController && window.solarSystemController.resize) {
          window.solarSystemController.resize();
        }
      }, 120);
    });
  }

  // Sync state if user exits via browser ESC or F11
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && solarSystemStage) {
      solarSystemStage.classList.remove('fullscreen-mode');
      if (solarFullscreenIcon) {
        solarFullscreenIcon.setAttribute('data-lucide', 'maximize');
        if (window.lucide) window.lucide.createIcons();
      }
      setTimeout(() => {
        if (window.solarSystemController && window.solarSystemController.resize) {
          window.solarSystemController.resize();
        }
      }, 100);
    }
  });

  // Also support Esc key fallback
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && solarSystemStage && solarSystemStage.classList.contains('fullscreen-mode')) {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
      solarSystemStage.classList.remove('fullscreen-mode');
      if (solarFullscreenIcon) {
        solarFullscreenIcon.setAttribute('data-lucide', 'maximize');
        if (window.lucide) window.lucide.createIcons();
      }
      setTimeout(() => {
        if (window.solarSystemController && window.solarSystemController.resize) {
          window.solarSystemController.resize();
        }
      }, 80);
    }
  });

  if (solarResetCamBtn) {
    solarResetCamBtn.addEventListener('click', () => {
      playSynthSound('click');
      if (window.solarSystemController && window.solarSystemController.resetOverview) {
        window.solarSystemController.resetOverview();
      }
      if (planetHUD) planetHUD.style.display = 'none';
      document.querySelectorAll('.celestial-pill').forEach(p => p.classList.remove('active'));
    });
  }

  if (solarPauseMotionBtn) {
    let _motionPaused = false;
    solarPauseMotionBtn.addEventListener('click', () => {
      playSynthSound('click');
      _motionPaused = !_motionPaused;
      if (window.solarSystemController && window.solarSystemController.toggleMotion) {
        window.solarSystemController.toggleMotion();
      }
      if (solarMotionIcon) {
        solarMotionIcon.setAttribute('data-lucide', _motionPaused ? 'play' : 'pause');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  if (hudResetOrbitBtn) {
    hudResetOrbitBtn.addEventListener('click', () => {
      playSynthSound('click');
      stopAllSpeech();
      if (planetHUD) planetHUD.style.display = 'none';
      if (window.solarSystemController && window.solarSystemController.resetOverview) {
        window.solarSystemController.resetOverview();
      }
      document.querySelectorAll('.celestial-pill').forEach(p => p.classList.remove('active'));
    });
  }

  if (closePlanetHUDBtn) {
    closePlanetHUDBtn.addEventListener('click', () => {
      stopAllSpeech();
      if (planetHUD) planetHUD.style.display = 'none';
      if (window.solarSystemController && window.solarSystemController.resetOverview) {
        window.solarSystemController.resetOverview();
      }
      document.querySelectorAll('.celestial-pill').forEach(p => p.classList.remove('active'));
    });
  }

  if (speakPlanetBtn) {
    speakPlanetBtn.addEventListener('click', () => {
      const activePill = document.querySelector('.celestial-pill.active');
      if (activePill) {
        const bodyId = activePill.dataset.body;
        const data = cosmicCatalog.solarSystem[bodyId];
        if (data) {
          const speech = data.speech[state.currentLang] || data.speech['ar'];
          triggerAstorInteraction(speech);
        }
      }
    });
  }

  // Render dynamic Solar Selector Strip Pills
  function renderSolarPills() {
    const selectorStrip = document.getElementById('solarSelectorStrip');
    if (!selectorStrip) return;
    const lang = state.currentLang;
    const bodies = [
      { id: 'sun', icon: '☀️' },
      { id: 'mercury', icon: '🟤' },
      { id: 'venus', icon: '🟡' },
      { id: 'earth', icon: '🌍' },
      { id: 'mars', icon: '🔴' },
      { id: 'jupiter', icon: '🟠' },
      { id: 'saturn', icon: '🪐' },
      { id: 'uranus', icon: '🌐' },
      { id: 'neptune', icon: '🔵' },
      { id: 'moon', icon: '🌕' },
      { id: 'iss', icon: '🛰️' }
    ];

    selectorStrip.innerHTML = bodies.map(b => {
      const bData = cosmicCatalog.solarSystem[b.id];
      const name = bData ? (bData.name[lang] || bData.name['ar']) : b.id;
      return `<button type="button" class="celestial-pill" data-body="${b.id}">${b.icon} ${name}</button>`;
    }).join('');

    selectorStrip.querySelectorAll('.celestial-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const bodyId = pill.dataset.body;
        if (!bodyId) return;
        playSynthSound('click');
        if (window.solarSystemController && window.solarSystemController.focusBody) {
          window.solarSystemController.focusBody(bodyId, false);
        }
        showPlanetHUD(bodyId);
      });
    });
  }

  // Language-Specific Cinematic Launch Videos
  const LAUNCH_VIDEOS = {
    ar: 'https://videotourl.com/videos/1794735018749-df64713f-d0b9-400f-a77b-91301272c85f.mp4',
    en: 'https://videotourl.com/videos/1794734605967-887a56fb-f185-4fd0-bafd-7d9fe5c6f661.mp4',
    fr: 'https://videotourl.com/videos/1794734605967-887a56fb-f185-4fd0-bafd-7d9fe5c6f661.mp4'
  };

  function updateLaunchVideoSource(lang) {
    if (!missionLaunchVideo) return;
    const targetSrc = LAUNCH_VIDEOS[lang] || LAUNCH_VIDEOS.en;
    const currentSrc = missionLaunchVideo.getAttribute('src');
    if (currentSrc !== targetSrc) {
      missionLaunchVideo.setAttribute('src', targetSrc);
      missionLaunchVideo.src = targetSrc;
      missionLaunchVideo.load();
    }
  }

  // Language Setter
  function setLanguage(lang) {
    if (!i18n[lang]) return;
    state.currentLang = lang;
    const t = i18n[lang];

    htmlDoc.setAttribute('lang', lang);
    htmlDoc.setAttribute('dir', t.dir);

    localStorage.setItem('ASTRO_LANG', lang);

    langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

    const labelMissionLang = document.getElementById('labelMissionLang');
    if (labelMissionLang && t.labelMissionLang) {
      labelMissionLang.textContent = t.labelMissionLang;
    }

    brandTitle.innerHTML = `${t.brandTitle} <span style="font-size: 0.9rem; color: var(--accent-cyan); font-weight: 600;">NASA</span>`;
    brandSubtitle.textContent = t.brandSubtitle;
    authHeading.textContent = t.authHeading;
    authSubheading.textContent = t.authSubheading;
    labelFullName.textContent = t.labelFullName;
    labelAge.textContent = t.labelAge;
    labelEmail.textContent = t.labelEmail;
    labelPassword.textContent = t.labelPassword;
    fullNameInput.placeholder = t.placeholderName;
    ageInput.placeholder = t.placeholderAge;
    emailInput.placeholder = t.placeholderEmail;
    submitBtnText.textContent = t.submitBtnText;

    if (supabaseStatusText) {
      if (window.AstroDB && window.AstroDB.isSupabaseConfigured()) {
        supabaseStatusText.textContent = lang === 'ar' ? 'سوبابيز سحابي متصل ⚡' : lang === 'fr' ? 'Supabase En Ligne ⚡' : 'Supabase Live ⚡';
      } else {
        supabaseStatusText.textContent = t.supabaseReady;
      }
    }

    dashWelcomeTitle.textContent = state.currentUser ? (lang === 'ar' ? `${t.dashWelcomeTitle} يا ${state.currentUser.full_name}` : `${t.dashWelcomeTitle}, ${state.currentUser.full_name}!`) : t.dashWelcomeTitle;
    dashWelcomeSubtitle.textContent = t.dashWelcomeSubtitle;
    astroStatusLabel.textContent = t.astroStatus;
    astroNameTag.textContent = t.astroNameTag;
    missionStatusText.textContent = t.missionStatus;
    gatewayTitle.textContent = t.gatewayTitle;
    gatewaySubtitle.textContent = t.gatewaySubtitle;
    startBtnLabel.textContent = t.startBtnLabel;
    missionAwaitingText.textContent = t.missionAwaiting;
    voiceStatusText.textContent = t.astroVoiceBadge;

    if (tabLabelGalaxies) tabLabelGalaxies.textContent = t.tabGalaxies;
    if (tabLabelPlanets) tabLabelPlanets.textContent = t.tabPlanets;
    if (tabLabelEquipment) tabLabelEquipment.textContent = t.tabEquipment;
    if (tabLabelAcademy) tabLabelAcademy.textContent = t.tabAcademy;
    if (returnBtnLabel) returnBtnLabel.textContent = t.returnLabel;

    // Solar System localized texts
    const solarTitleText = document.getElementById('solarTitleText');
    if (solarTitleText && t.solarTitle) solarTitleText.textContent = t.solarTitle;
    const returnGalaxiesText = document.getElementById('returnGalaxiesText');
    if (returnGalaxiesText && t.returnGalaxies) returnGalaxiesText.textContent = t.returnGalaxies;
    const solarHintText = document.getElementById('solarHintText');
    if (solarHintText && t.solarHint) solarHintText.textContent = t.solarHint;
    const hudDiscoveryTitle = document.getElementById('hudDiscoveryTitle');
    if (hudDiscoveryTitle && t.discoveryTitle) hudDiscoveryTitle.textContent = t.discoveryTitle;
    const hudLabelGravity = document.getElementById('hudLabelGravity');
    if (hudLabelGravity && t.labelGravity) hudLabelGravity.textContent = t.labelGravity;
    const hudLabelTemp = document.getElementById('hudLabelTemp');
    if (hudLabelTemp && t.labelTemp) hudLabelTemp.textContent = t.labelTemp;
    const hudLabelMoons = document.getElementById('hudLabelMoons');
    if (hudLabelMoons && t.labelMoons) hudLabelMoons.textContent = t.labelMoons;
    const hudLabelOrbit = document.getElementById('hudLabelOrbit');
    if (hudLabelOrbit && t.labelOrbit) hudLabelOrbit.textContent = t.labelOrbit;
    const hudSpeakBtnText = document.getElementById('hudSpeakBtnText');
    if (hudSpeakBtnText && t.speakBtnText) hudSpeakBtnText.textContent = t.speakBtnText;
    const hudResetOrbitText = document.getElementById('hudResetOrbitText');
    if (hudResetOrbitText && t.resetOrbitText) hudResetOrbitText.textContent = t.resetOrbitText;

    // Outpost localized texts
    const navOutpostGamesText = document.getElementById('navOutpostGamesText');
    if (navOutpostGamesText && t.navOutpost) navOutpostGamesText.textContent = t.navOutpost;
    const returnOutpostText = document.getElementById('returnOutpostText');
    if (returnOutpostText && t.returnOutpost) returnOutpostText.textContent = t.returnOutpost;
    const outpostTitleText = document.getElementById('outpostTitleText');
    if (outpostTitleText && t.outpostTitle) outpostTitleText.textContent = t.outpostTitle;
    const outpostScienceDocText = document.getElementById('outpostScienceDocText');
    if (outpostScienceDocText && t.outpostScienceDoc) outpostScienceDocText.textContent = t.outpostScienceDoc;
    const launcherBannerBadge = document.getElementById('launcherBannerBadge');
    if (launcherBannerBadge && t.launcherBannerBadge) launcherBannerBadge.textContent = t.launcherBannerBadge;
    const launcherBannerTitle = document.getElementById('launcherBannerTitle');
    if (launcherBannerTitle && t.launcherBannerTitle) launcherBannerTitle.textContent = t.launcherBannerTitle;
    const launcherBannerDesc = document.getElementById('launcherBannerDesc');
    if (launcherBannerDesc && t.launcherBannerDesc) launcherBannerDesc.textContent = t.launcherBannerDesc;
    const launchOutpostBtnText = document.getElementById('launchOutpostBtnText');
    if (launchOutpostBtnText && t.launchOutpostBtn) launchOutpostBtnText.textContent = t.launchOutpostBtn;

    renderSolarPills();
    renderCosmicSectors();
    updateMuteButtonUI();
    updateLaunchVideoSource(lang);
  }

  // ========================================================
  // SESSION PERSISTENCE & RESTORATION (No Forced Redirects on Reload)
  // ========================================================
  function checkExistingSession() {
    const existingUser = window.AstroDB.getCurrentUser();
    if (existingUser && existingUser.full_name) {
      console.log('🔄 Preserving valid active session for:', existingUser.full_name, existingUser.composite_key);
      state.currentUser = existingUser;
      showUserDashboard(existingUser, true);
    }
  }

  function showUserDashboard(user, isInstantReload = false) {
    state.currentUser = user;
    const t = i18n[state.currentLang];

    // Update Session Chip in Top Navbar
    if (userSessionChip && sessionUserName) {
      sessionUserName.textContent = user.full_name;
      userSessionChip.style.display = 'flex';
    }

    // Hide Login Screen, Show Dashboard
    registerSection.style.display = 'none';
    dashboardSection.classList.add('active');

    // Video Persistence: If already watched, go straight to Galaxies Hub!
    const hasWatchedVideo = localStorage.getItem('ASTRO_VIDEO_WATCHED') === 'true';
    if (hasWatchedVideo) {
      if (gatewayCard) gatewayCard.style.display = 'none';
      if (explorationHub) explorationHub.style.display = 'flex';
    } else {
      if (gatewayCard) gatewayCard.style.display = 'flex';
      if (explorationHub) explorationHub.style.display = 'none';
    }

    // Trigger 3D Viewport Calibration & Welcome Wave
    setTimeout(() => {
      if (window.resizeAstro3D) window.resizeAstro3D();
      if (window.astro3DController) window.astro3DController.triggerWave();
    }, 60);

    dashWelcomeTitle.textContent = state.currentLang === 'ar'
      ? `${t.dashWelcomeTitle} يا ${user.full_name}`
      : `${t.dashWelcomeTitle}, ${user.full_name}!`;

    if (badgeCadetName) {
      badgeCadetName.textContent = user.full_name;
    }

    // Start Astor Greeting
    const welcomeSpeech = t.astroWelcomeMsg(user.full_name);
    startAstroTypewriter(welcomeSpeech);

    if (!isInstantReload) {
      speakAstorVoice(welcomeSpeech);
    }
  }

  // Sign Out Handler
  signOutBtn.addEventListener('click', () => {
    playSynthSound('click');
    window.AstroDB.clearSession();
    localStorage.removeItem('ASTRO_VIDEO_WATCHED');
    state.currentUser = null;
    userSessionChip.style.display = 'none';
    dashboardSection.classList.remove('active');
    explorationHub.style.display = 'none';
    gatewayCard.style.display = 'flex';
    registerSection.style.display = 'flex';
    showToast('تم تسجيل الخروج بنجاح 👋', 'info');
  });

  // Apple iPhone Setup Hello Animation
  async function launchIphoneSetupSequence(user) {
    const t = i18n[state.currentLang];
    playSynthSound('whoosh');

    registerSection.style.display = 'none';
    iphoneSetupOverlay.classList.add('active');

    const greetings = [
      { text: 'Hello', isArabic: false },
      { text: 'Bonjour', isArabic: false },
      { text: 'مرحباً', isArabic: true },
      { text: state.currentLang === 'ar' ? 'مرحباً' : state.currentLang === 'fr' ? 'Bonjour' : 'Hello', isArabic: state.currentLang === 'ar' }
    ];

    for (let i = 0; i < greetings.length; i++) {
      const g = greetings[i];
      iphoneHelloText.classList.remove('visible');
      await new Promise(r => setTimeout(r, 220));

      iphoneHelloText.textContent = g.text;
      if (g.isArabic) {
        iphoneHelloText.classList.add('arabic');
      } else {
        iphoneHelloText.classList.remove('arabic');
      }

      iphoneHelloText.classList.add('visible');
      playSynthSound('click');
      await new Promise(r => setTimeout(r, 950));
    }

    iphoneHint.classList.add('visible');
    await new Promise(r => setTimeout(r, 800));

    playSynthSound('whoosh');
    iphoneHelloContainer.classList.add('glide-up');
    await new Promise(r => setTimeout(r, 1100));

    iphoneSetupOverlay.style.opacity = '0';
    setTimeout(() => {
      iphoneSetupOverlay.classList.remove('active');
      iphoneHelloContainer.classList.remove('glide-up');
      showUserDashboard(user, false);
    }, 600);
  }

  // Registration / Login Form Submission (Email + Display Name Composite Recognition)
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    playSynthSound('click');

    const fullName = fullNameInput.value.trim();
    const age = parseInt(ageInput.value, 10);
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const t = i18n[state.currentLang];

    if (!fullName || !age || !email || !password) {
      showToast(t.fillAllFields, 'error');
      return;
    }

    if (isNaN(age) || age < 5 || age > 12) {
      showToast(t.invalidAge, 'error');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast(t.invalidEmail, 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      // Disambiguate user profile by composite key (email + fullName)
      const result = await window.AstroDB.registerAstroUser({
        fullName,
        age,
        email,
        password,
        language: state.currentLang
      });

      state.currentUser = result.user;

      if (result.isReturning) {
        showToast('مرحباً بعودتك! تم استرجاع جلستك الفضائية 🚀', 'success');
      } else if (result.savedToSupabase) {
        showToast('تم حفظ الحساب المستقل بنجاح في سوبابيز 🛰️', 'success');
      } else {
        showToast('تم تأكيد ملف الرائد المستقل محلياً بنجاح 🚀', 'success');
      }

      launchIphoneSetupSequence(result.user);
    } catch (err) {
      console.error(err);
      showToast('خطأ أثناء التسجيل: ' + err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });

  // Toggle Password
  togglePasswordBtn.addEventListener('click', () => {
    playSynthSound('click');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    const icon = togglePasswordBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
      if (window.lucide) window.lucide.createIcons();
    }
  });

  // ========================================================
  // CINEMATIC MANDATORY LAUNCH VIDEO (UNSKIPPABLE, NO CONTROLS)
  // ========================================================
  if (missionLaunchVideo) {
    // Disable right click context menu on video & blocker
    missionLaunchVideo.addEventListener('contextmenu', (e) => e.preventDefault());
    if (videoOverlayBlocker) {
      videoOverlayBlocker.addEventListener('contextmenu', (e) => e.preventDefault());
      videoOverlayBlocker.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      videoOverlayBlocker.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }

    // Disable keyboard shortcuts (Space, Arrow keys, K, J, L) during video playback
    window.addEventListener('keydown', (e) => {
      if (missionVideoStage && missionVideoStage.style.display !== 'none') {
        if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyK', 'KeyJ', 'KeyL'].includes(e.code)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, true);

    // Prevent any seeking / dragging / scrubbing
    let lastValidTime = 0;
    missionLaunchVideo.addEventListener('timeupdate', () => {
      if (missionLaunchVideo.currentTime > lastValidTime + 0.6) {
        missionLaunchVideo.currentTime = lastValidTime;
      } else {
        lastValidTime = missionLaunchVideo.currentTime;
      }
    });

    // Smooth transition from video to exploration hub
    const transitionToGalaxies = () => {
      playSynthSound('success');
      localStorage.setItem('ASTRO_VIDEO_WATCHED', 'true');
      if (missionLaunchVideo) {
        missionLaunchVideo.pause();
      }

      if (missionVideoStage) {
        missionVideoStage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        missionVideoStage.style.opacity = '0';
        missionVideoStage.style.transform = 'scale(1.04)';
      }

      setTimeout(() => {
        if (gatewayCard) gatewayCard.style.display = 'none';
        if (explorationHub) explorationHub.style.display = 'flex';

        const welcomeMsg = state.currentLang === 'ar'
          ? 'انطلاق ناجح في أعماق الكون! مرحباً بك في بوابة استكشاف المجرات الكونية العميقة مع بيانات ناسا الحية!'
          : 'Launch sequence completed! Welcome to deep cosmic galaxies with live NASA archives!';
        triggerAstorInteraction(welcomeMsg);
        if (window.astro3DController) {
          window.astro3DController.triggerWave();
        }
      }, 500);
    };

    // When the launch video finishes: smooth cosmic warp into Galaxies
    missionLaunchVideo.addEventListener('ended', transitionToGalaxies);
    missionLaunchVideo.addEventListener('error', (err) => {
      console.warn('Video playback note, proceeding to exploration hub:', err);
      transitionToGalaxies();
    });

    const skipVideoBtn = document.getElementById('skipVideoBtn');
    if (skipVideoBtn) {
      skipVideoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionToGalaxies();
      });
    }
  }

  // Grand "ابدأ الآن" Start Button Execution
  startNowBtn.addEventListener('click', () => {
    playSynthSound('success');
    if (window.astro3DController) {
      window.astro3DController.pointAtCard();
    }
    const launchIntro = state.currentLang === 'ar'
      ? 'استعد لبدء رحلة الانطلاق الكونية! تم تشغيل محركات الصاروخ الفضائي!'
      : 'Initiating cosmic launch sequence! Thrusters engaged!';
    triggerAstorInteraction(launchIntro);

    // Smooth transition into Cinematic Launch Video
    if (gatewayStartView && missionVideoStage && missionLaunchVideo) {
      gatewayStartView.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      gatewayStartView.style.opacity = '0';
      gatewayStartView.style.transform = 'scale(0.93)';

      setTimeout(() => {
        gatewayStartView.style.display = 'none';
        missionVideoStage.style.display = 'flex';
        missionVideoStage.style.opacity = '1';
        missionVideoStage.style.transform = 'scale(1)';
        updateLaunchVideoSource(state.currentLang);
        missionLaunchVideo.currentTime = 0;

        const playPromise = missionLaunchVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser policy blocks unmuted audio on auto-play, start cleanly
            missionLaunchVideo.muted = true;
            missionLaunchVideo.play().then(() => {
              // Unmute gently
              setTimeout(() => { missionLaunchVideo.muted = false; }, 300);
            }).catch(e => {
              console.warn('Video playback error, auto-progressing:', e);
              setTimeout(() => {
                if (missionVideoStage.style.display !== 'none') {
                  gatewayCard.style.display = 'none';
                  explorationHub.style.display = 'flex';
                }
              }, 1200);
            });
          });
        }
      }, 400);
    } else {
      // Fallback
      gatewayCard.style.display = 'none';
      explorationHub.style.display = 'flex';
    }
  });

  // Return to Gateway Button
  if (returnGatewayBtn) {
    returnGatewayBtn.addEventListener('click', () => {
      playSynthSound('click');
      if (missionLaunchVideo) {
        missionLaunchVideo.pause();
        updateLaunchVideoSource(state.currentLang);
        missionLaunchVideo.currentTime = 0;
      }
      explorationHub.style.display = 'none';
      gatewayCard.style.display = 'flex';
      if (missionVideoStage) {
        missionVideoStage.style.display = 'none';
        missionVideoStage.style.opacity = '1';
        missionVideoStage.style.transform = 'scale(1)';
      }
      if (gatewayStartView) {
        gatewayStartView.style.display = 'flex';
        gatewayStartView.style.opacity = '1';
        gatewayStartView.style.transform = 'scale(1)';
      }
    });
  }

  // ========================================================
  // NASA IMAGES & VIDEO LIBRARY API INTEGRATION
  // Official Docs: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
  // Live Endpoint: https://images-api.nasa.gov/search?q={query}&media_type=image
  // ========================================================
  const nasaApiCache = new Map();

  async function fetchNasaGalaxyData(query) {
    if (nasaApiCache.has(query)) return nasaApiCache.get(query);
    try {
      const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`);
      if (!res.ok) throw new Error('NASA API error: ' + res.status);
      const json = await res.json();
      const items = json?.collection?.items || [];
      if (items.length > 0) {
        for (const item of items) {
          const link = item.links?.find(l => l.render === 'image') || item.links?.[0];
          const data = item.data?.[0];
          if (link && data && link.href) {
            const result = {
              title: data.title || query,
              nasaId: data.nasa_id || 'NASA-ARCHIVE',
              desc: data.description || '',
              date: data.date_created ? data.date_created.split('T')[0] : 'NASA Archives',
              center: data.center || 'NASA JPL / STScI',
              imgUrl: link.href
            };
            nasaApiCache.set(query, result);
            return result;
          }
        }
      }
    } catch (e) {
      console.warn('NASA API fetch note for:', query, e);
    }
    return null;
  }

  // Load NASA Images for the 4 Galaxy Cards (with custom high-res priority for Milky Way)
  async function loadNasaGalaxyImages() {
    const queries = {
      andromeda: 'andromeda galaxy',
      whirlpool: 'whirlpool galaxy',
      sombrero: 'sombrero galaxy'
    };

    for (const [id, q] of Object.entries(queries)) {
      fetchNasaGalaxyData(q).then(data => {
        if (!data || !data.imgUrl) return;
        const imgEl = document.getElementById(`nasaImg_${id}`);
        if (imgEl) {
          imgEl.src = data.imgUrl;
        }
      });
    }
  }

  function openNasaModal(item) {
    if (!nasaModal) return;
    playSynthSound('whoosh');
    nasaModalTitle.textContent = item.title;
    nasaModalId.textContent = `NASA ID: ${item.nasaId}`;
    nasaModalCenter.textContent = item.center;
    nasaModalDate.textContent = `📅 ${item.date}`;
    nasaModalDesc.textContent = item.desc || 'سجل رصد رسمي موثق في قاعدة بيانات وكالة ناسا للفضاء.';

    nasaModalImg.style.display = 'none';
    nasaModalLoader.style.display = 'flex';
    nasaModal.style.display = 'flex';

    const highRes = new Image();
    highRes.src = item.imgUrl;
    highRes.onload = () => {
      nasaModalImg.src = item.imgUrl;
      nasaModalLoader.style.display = 'none';
      nasaModalImg.style.display = 'block';
    };
    highRes.onerror = () => {
      nasaModalLoader.innerHTML = '<span style="color:#ef4444;">تعذر تحميل الصورة عالية الدقة من خوادم ناسا</span>';
    };

    // Astro explains the inspected item
    const summary = `${item.title} — رصد تلسكوب ناسا الرسمي!`;
    triggerAstorInteraction(summary);
  }

  if (closeNasaModalBtn) {
    closeNasaModalBtn.addEventListener('click', () => {
      playSynthSound('click');
      nasaModal.style.display = 'none';
    });
  }
  if (nasaModal) {
    nasaModal.addEventListener('click', (e) => {
      if (e.target === nasaModal) {
        nasaModal.style.display = 'none';
      }
    });
  }

  // NASA Live Search Execution
  async function executeNasaSearch() {
    const q = (nasaSearchInput?.value || '').trim();
    if (!q) {
      showToast('يرجى كتابة كلمة للبحث في تلسكوبات ناسا 🔭', 'info');
      return;
    }
    playSynthSound('click');
    if (nasaSearchResults) {
      nasaSearchResults.style.display = 'grid';
      nasaSearchResults.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 1.5rem; color: var(--accent-cyan);">
          <span class="cosmic-spinner" style="margin: 0 auto 0.5rem auto; display: block;"></span>
          جاري الاتصال بقاعدة بيانات ناسا المفتوحة للبحث عن "${q}"...
        </div>
      `;
    }

    // Auto-map common Arabic astronomy terms to NASA's English catalog
    const arabicToNasa = {
      'المريخ': 'Mars', 'مريخ': 'Mars',
      'القمر': 'Moon', 'قمر': 'Moon',
      'الارض': 'Earth', 'الأرض': 'Earth', 'ارض': 'Earth',
      'الشمس': 'Sun', 'شمس': 'Sun',
      'المشتري': 'Jupiter', 'مشتري': 'Jupiter',
      'زحل': 'Saturn', 'عطارد': 'Mercury',
      'الزهرة': 'Venus', 'زهره': 'Venus',
      'اورانوس': 'Uranus', 'أورانوس': 'Uranus',
      'نبتون': 'Neptune', 'بلوتو': 'Pluto',
      'ثقب اسود': 'black hole', 'ثقب أسود': 'black hole',
      'مجرة': 'galaxy', 'المجرة': 'galaxy', 'مجرات': 'galaxies', 'درب التبانة': 'Milky Way',
      'سديم': 'nebula', 'السديم': 'nebula',
      'هابل': 'Hubble', 'تلسكوب هابل': 'Hubble',
      'جيمس ويب': 'James Webb', 'ويب': 'James Webb',
      'محطة الفضاء': 'ISS', 'محطة الفضاء الدولية': 'International Space Station',
      'رواد فضاء': 'astronaut', 'رائد فضاء': 'astronaut',
      'صاروخ': 'rocket', 'صواريخ': 'rocket',
      'نيزك': 'meteor', 'كويكب': 'asteroid'
    };
    let queryNasa = q;
    const lowerQ = q.toLowerCase();
    for (const [ar, en] of Object.entries(arabicToNasa)) {
      if (lowerQ.includes(ar.toLowerCase())) {
        queryNasa = en;
        break;
      }
    }

    try {
      const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(queryNasa)}&media_type=image`);
      const data = await res.json();
      const items = (data?.collection?.items || []).slice(0, 8);

      if (!items || items.length === 0) {
        nasaSearchResults.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 1.5rem; color: var(--text-muted);">
            لم يتم العثور على نتائج في أرشيف ناسا لكلمة "${q}". جرب البحث بكلمات مثل Hubble أو Mars أو Webb.
          </div>
        `;
        return;
      }

      nasaSearchResults.innerHTML = items.map((item, idx) => {
        const link = item.links?.find(l => l.render === 'image') || item.links?.[0];
        const meta = item.data?.[0];
        if (!link || !meta) return '';
        return `
          <div class="nasa-result-card" data-idx="${idx}">
            <img src="${link.href}" alt="${meta.title}" loading="lazy">
            <div class="nasa-card-info">
              <h6>${meta.title}</h6>
              <p>${meta.description || 'NASA Space Imagery'}</p>
            </div>
          </div>
        `;
      }).join('');

      // Add click listener to search results
      nasaSearchResults.querySelectorAll('.nasa-result-card').forEach((card, idx) => {
        card.addEventListener('click', () => {
          const item = items[idx];
          const link = item.links?.find(l => l.render === 'image') || item.links?.[0];
          const meta = item.data?.[0];
          openNasaModal({
            title: meta.title,
            nasaId: meta.nasa_id || 'NASA-SEARCH',
            desc: meta.description || '',
            date: meta.date_created ? meta.date_created.split('T')[0] : 'NASA Archives',
            center: meta.center || 'NASA',
            imgUrl: link.href
          });
        });
      });

      triggerAstorInteraction(`عثرنا على ${items.length} نتائج حية من تلسكوبات ناسا الفضائية!`);
    } catch (err) {
      console.error('NASA Search Error:', err);
      nasaSearchResults.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 1rem; color: #ef4444;">
          تعذر الاتصال بـ NASA API حالياً. تحقق من اتصال الإنترنت.
        </div>
      `;
    }
  }

  if (nasaSearchBtn) {
    nasaSearchBtn.addEventListener('click', executeNasaSearch);
  }
  if (nasaSearchInput) {
    nasaSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeNasaSearch();
      }
    });
  }

  // Hub Sector Navigation Tabs (if present)
  if (hubTabButtons && hubTabButtons.length > 0) {
    hubTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        playSynthSound('click');
        const sector = btn.dataset.sector;

        hubTabButtons.forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.sector-content').forEach(sc => sc.classList.remove('active'));

        if (sector === 'galaxies' && sectorGalaxies) sectorGalaxies.classList.add('active');
        else if (sector === 'planets' && sectorPlanets) sectorPlanets.classList.add('active');
        else if (sector === 'equipment' && sectorEquipment) sectorEquipment.classList.add('active');
        else if (sector === 'academy' && sectorAcademy) sectorAcademy.classList.add('active');

        const sectorName = btn.querySelector('span')?.textContent || '';
        const commentary = state.currentLang === 'ar'
          ? `أنت الآن في قسم: ${sectorName}! انقر على أي عنصر لمعرفة أسراره.`
          : `You are now in: ${sectorName}! Click any item to explore.`;
        triggerAstorInteraction(commentary);
      });
    });
  }

  // Cadet Quiz Challenge Execution
  if (quizOptions) {
    quizOptions.addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz-opt-btn');
      if (!btn) return;
      playSynthSound('click');

      const isCorrect = btn.dataset.correct === 'true';
      if (isCorrect) {
        playSynthSound('success');
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        astronautBadgeEarned.style.display = 'block';

        if (window.confetti) {
          window.confetti({
            particleCount: 140,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#00e5ff', '#ffffff']
          });
        }

        const successSpeech = i18n[state.currentLang].quizCorrect;
        triggerAstorInteraction(successSpeech);
        showToast('🎖️ تهانينا! أصبحت رائد فضاء معتمد رسمياً في ناسا!', 'success');
      } else {
        btn.style.borderColor = '#ef4444';
        btn.style.color = '#ef4444';
        const tryAgain = i18n[state.currentLang].quizWrong;
        triggerAstorInteraction(tryAgain);
        showToast('حاول مجدداً!', 'error');
      }
    });
  }

  // Language & Theme Toggle Controls
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playSynthSound('click');
      setLanguage(btn.dataset.lang);
    });
  });

  soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (!state.soundEnabled) {
      stopAllSpeech();
    }
    const icon = soundToggleBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', state.soundEnabled ? 'volume-2' : 'volume-x');
      if (window.lucide) window.lucide.createIcons();
    }
    showToast(state.soundEnabled ? 'المؤثرات الصوتية مفعّلة 🔊' : 'المؤثرات الصوتية مكتومة 🔇');
  });

  // Supabase Modal Listeners (Safely guarded against removed UI buttons)
  if (supabaseConfigBtn && supabaseModal) {
    supabaseConfigBtn.addEventListener('click', () => {
      playSynthSound('click');
      const cfg = window.AstroDB.getSupabaseConfig() || {};
      if (sbUrlInput) sbUrlInput.value = cfg.url || '';
      if (sbKeyInput) sbKeyInput.value = cfg.key || '';
      supabaseModal.classList.add('active');
    });
  }

  if (closeSupabaseModal && supabaseModal) {
    closeSupabaseModal.addEventListener('click', () => {
      playSynthSound('click');
      supabaseModal.classList.remove('active');
    });
  }

  if (testSbBtn) {
    testSbBtn.addEventListener('click', async () => {
      playSynthSound('click');
      const url = sbUrlInput ? sbUrlInput.value.trim() : '';
      const key = sbKeyInput ? sbKeyInput.value.trim() : '';
      if (!url || !key) {
        showToast('يرجى إدخال الرابط والمفتاح للاختبار!', 'error');
        return;
      }
      testSbBtn.disabled = true;
      testSbBtn.innerHTML = 'جاري الفحص...';
      const result = await window.AstroDB.testSupabaseConnection(url, key);
      testSbBtn.disabled = false;
      testSbBtn.innerHTML = 'اختبار الاتصال';
      if (result.success) {
        showToast('✅ الاتصال بسوبابيز ناجح 100%!', 'success');
        if (supabaseDot) supabaseDot.className = 'status-dot';
      } else {
        showToast('⚠️ تعذر الاتصال: ' + result.message, 'error');
      }
    });
  }

  if (supabaseConfigForm) {
    supabaseConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSynthSound('click');
      const url = sbUrlInput ? sbUrlInput.value.trim() : '';
      const key = sbKeyInput ? sbKeyInput.value.trim() : '';
      if (url && key) {
        window.AstroDB.saveSupabaseConfig(url, key);
        if (supabaseDot) supabaseDot.className = 'status-dot';
        if (supabaseStatusText) supabaseStatusText.textContent = state.currentLang === 'ar' ? 'سوبابيز سحابي متصل ⚡' : 'Supabase Live ⚡';
        showToast('تم حفظ إعدادات سوبابيز بنجاح 🛰️', 'success');
      }
      if (supabaseModal) supabaseModal.classList.remove('active');
    });
  }

  // ========================================================
  // ULTRA-IMMERSIVE DEEP SPACE UNIVERSE SIMULATION ENGINE
  // Realistic Nebulas, Spiral Galaxies, Saturn with Rings,
  // Azure Planet, Orbiting Satellite (ISS), Shooting Stars & Parallax
  // ========================================================
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;

  // Parallax Coordinates (Smooth Inertia)
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let curParallaxX = 0;
  let curParallaxY = 0;

  window.addEventListener('mousemove', (e) => {
    targetParallaxX = (e.clientX / window.innerWidth - 0.5) * 45;
    targetParallaxY = (e.clientY / window.innerHeight - 0.5) * 35;
  }, { passive: true });

  // 1. Starfield Layers (3 Depths)
  let stars = [];
  function createStarfield() {
    stars = [];
    const count = Math.min(380, Math.floor((w * h) / 3800));
    const starColors = [
      '#ffffff', '#ffffff', '#e0f2fe', '#bae6fd',
      '#7dd3fc', '#00e5ff', '#fed7aa', '#fde047'
    ];
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: depth > 0.85 ? Math.random() * 1.6 + 1.2 : (depth > 0.4 ? Math.random() * 1.0 + 0.6 : Math.random() * 0.6 + 0.3),
        alpha: Math.random() * 0.75 + 0.25,
        baseAlpha: Math.random() * 0.75 + 0.25,
        speedX: (Math.random() - 0.5) * 0.04 * (depth + 0.2),
        speedY: (Math.random() - 0.5) * 0.04 * (depth + 0.2),
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        depth: depth, // 0 = far, 1 = near
        hasSpikes: depth > 0.94 // bright landmark star with 4-point cross diffraction
      });
    }
  }

  // 2. Cosmic Nebulas (Deep Gas Clouds)
  const nebulas = [
    { xRatio: 0.22, yRatio: 0.28, rRatio: 0.38, color1: 'rgba(99, 102, 241, 0.12)', color2: 'rgba(147, 51, 234, 0.06)', phase: 0 },
    { xRatio: 0.78, yRatio: 0.65, rRatio: 0.44, color1: 'rgba(0, 229, 255, 0.10)', color2: 'rgba(6, 182, 212, 0.04)', phase: 2.1 },
    { xRatio: 0.50, yRatio: 0.85, rRatio: 0.40, color1: 'rgba(236, 72, 153, 0.07)', color2: 'rgba(168, 85, 247, 0.03)', phase: 4.3 }
  ];

  // 3. Distant Rotating Spiral Galaxy
  const spiralGalaxy = {
    xRatio: 0.18,
    yRatio: 0.22,
    radius: 95,
    angle: 0.3,
    rotSpeed: 0.00035,
    coreColor: 'rgba(255, 248, 220, 0.85)',
    arms: 2,
    armParticles: []
  };

  function initSpiralGalaxy() {
    spiralGalaxy.armParticles = [];
    const pCount = 180;
    for (let i = 0; i < pCount; i++) {
      const armIdx = i % 2;
      const t = Math.random();
      const dist = Math.pow(t, 0.65) * spiralGalaxy.radius;
      const spiralOffset = armIdx * Math.PI + Math.log(dist * 0.15 + 1) * 2.8;
      const scatter = (Math.random() - 0.5) * (dist * 0.28 + 4);
      spiralGalaxy.armParticles.push({
        dist: dist,
        angleOffset: spiralOffset + (Math.random() - 0.5) * 0.25,
        scatter: scatter,
        size: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.25,
        color: armIdx === 0 ? 'rgba(0, 229, 255,' : 'rgba(192, 132, 252,'
      });
    }
  }

  // 4. Photorealistic Ringed Saturn
  const saturn = {
    xRatio: 0.85,
    yRatio: 0.24,
    radius: 36,
    ringTilt: -0.38,
    ringInnerR: 44,
    ringOuterR: 78,
    driftPhase: 0
  };

  // 5. Azure Terrestrial / Ice Giant Planet
  const azurePlanet = {
    xRatio: 0.10,
    yRatio: 0.78,
    radius: 26,
    driftPhase: 1.5
  };

  // 6. Realistic Orbital Satellite (ISS / NASA Space Craft)
  const satellite = {
    x: -80,
    y: 120,
    speedX: 0.42,
    speedY: 0.16,
    angle: 0.35,
    beaconTimer: 0
  };

  // 7. Dynamic Shooting Stars (Meteors)
  let meteors = [];
  let nextMeteorTime = Date.now() + 2500;

  function spawnMeteor() {
    const startX = Math.random() * (w * 0.75);
    const startY = Math.random() * (h * 0.4);
    const length = Math.random() * 120 + 80;
    const speed = Math.random() * 10 + 12;
    const angle = 0.62 + (Math.random() - 0.5) * 0.18; // ~35 deg downward
    meteors.push({
      x: startX,
      y: startY,
      len: length,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1.0,
      decay: Math.random() * 0.02 + 0.015
    });
    nextMeteorTime = Date.now() + Math.random() * 5500 + 3500;
  }

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createStarfield();
    initSpiralGalaxy();
    if (satellite.x === -80) {
      satellite.x = w * 0.05;
      satellite.y = h * 0.18;
    }
  }

  // Render Lens Flare 4-Point Star Spike
  function drawLensStar(cx, cy, r, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // Center Core
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 4-Point Diffraction Spikes
    const spikeLen = r * 5.5;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - spikeLen, cy);
    ctx.lineTo(cx + spikeLen, cy);
    ctx.moveTo(cx, cy - spikeLen);
    ctx.lineTo(cx, cy + spikeLen);
    ctx.stroke();

    // Soft Halo
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4.5);
    halo.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Render Photorealistic Ringed Saturn with 3D Sphere & 2-Pass Rings
  function renderSaturn(cx, cy, time) {
    ctx.save();
    const bob = Math.sin(time * 0.0008 + saturn.driftPhase) * 6;
    const px = cx;
    const py = cy + bob;
    const r = saturn.radius;

    ctx.translate(px, py);
    ctx.rotate(saturn.ringTilt);

    // ── Pass 1: Back Half of Rings (behind planet) ──
    ctx.save();
    ctx.beginPath();
    ctx.rect(-saturn.ringOuterR * 1.5, -saturn.ringOuterR * 1.5, saturn.ringOuterR * 3, saturn.ringOuterR * 1.5);
    ctx.clip(); // Only top/back half

    // Outer Ring
    ctx.beginPath();
    ctx.ellipse(0, 0, saturn.ringOuterR, saturn.ringOuterR * 0.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(226, 198, 153, 0.55)';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Cassini Division
    ctx.beginPath();
    ctx.ellipse(0, 0, saturn.ringOuterR - 10, (saturn.ringOuterR - 10) * 0.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(10, 14, 25, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner Ring
    ctx.beginPath();
    ctx.ellipse(0, 0, saturn.ringInnerR + 6, (saturn.ringInnerR + 6) * 0.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 222, 179, 0.70)';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();

    ctx.rotate(-saturn.ringTilt); // un-rotate for planet sphere shading

    // ── Planet Body (3D Spherical Sunlight & Cloud Stripes) ──
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    // Base Planet Color
    ctx.fillStyle = '#d4af37';
    ctx.fill();

    // Atmospheric Band Stripes
    const bands = [
      { y: -22, h: 6, c: '#c89d58' },
      { y: -12, h: 8, c: '#e8c99b' },
      { y: -2, h: 5, c: '#b58b4c' },
      { y: 6, h: 9, c: '#dfbf88' },
      { y: 18, h: 7, c: '#c29752' }
    ];
    bands.forEach(b => {
      ctx.fillStyle = b.c;
      ctx.fillRect(-r, b.y, r * 2, b.h);
    });

    // 3D Spherical Light Gradient (Sun from upper-left)
    const planetLight = ctx.createRadialGradient(-r * 0.45, -r * 0.45, 4, 0, 0, r * 1.15);
    planetLight.addColorStop(0, 'rgba(255, 250, 230, 0.40)');
    planetLight.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    planetLight.addColorStop(1, 'rgba(5, 7, 15, 0.88)');
    ctx.fillStyle = planetLight;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Ring Shadow cast onto planet
    ctx.rotate(saturn.ringTilt);
    ctx.fillStyle = 'rgba(5, 8, 16, 0.65)';
    ctx.fillRect(-r, -3, r * 2, 7);
    ctx.rotate(-saturn.ringTilt);

    ctx.restore(); // clip restored

    // ── Pass 2: Front Half of Rings (in front of planet) ──
    ctx.rotate(saturn.ringTilt);
    ctx.save();
    ctx.beginPath();
    ctx.rect(-saturn.ringOuterR * 1.5, 0, saturn.ringOuterR * 3, saturn.ringOuterR * 1.5);
    ctx.clip(); // Only bottom/front half

    // Outer Ring
    ctx.beginPath();
    ctx.ellipse(0, 0, saturn.ringOuterR, saturn.ringOuterR * 0.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(226, 198, 153, 0.55)';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Cassini Division
    ctx.beginPath();
    ctx.ellipse(0, 0, saturn.ringOuterR - 10, (saturn.ringOuterR - 10) * 0.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(10, 14, 25, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner Ring
    ctx.beginPath();
    ctx.ellipse(0, 0, saturn.ringInnerR + 6, (saturn.ringInnerR + 6) * 0.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 222, 179, 0.70)';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // Render Azure Terrestrial / Ice Planet with Glowing Atmospheric Halo
  function renderAzurePlanet(cx, cy, time) {
    ctx.save();
    const bob = Math.cos(time * 0.0006 + azurePlanet.driftPhase) * 5;
    const px = cx;
    const py = cy + bob;
    const r = azurePlanet.radius;

    // Atmospheric Glowing Limb Halo
    const halo = ctx.createRadialGradient(px, py, r * 0.85, px, py, r * 1.45);
    halo.addColorStop(0, 'rgba(0, 229, 255, 0.38)');
    halo.addColorStop(0.6, 'rgba(56, 189, 248, 0.12)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(px, py, r * 1.45, 0, Math.PI * 2);
    ctx.fill();

    // Planet Body
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Continents / Cloud swirls
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(px - 5, py - 6, r * 0.6, r * 0.35, 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.ellipse(px + 8, py + 8, r * 0.5, r * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 3D Shadow Crescent
    const shadowGrad = ctx.createRadialGradient(px - r * 0.4, py - r * 0.4, 2, px, py, r * 1.15);
    shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    shadowGrad.addColorStop(1, 'rgba(5, 10, 25, 0.92)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  // Render Rotating Spiral Galaxy
  function renderSpiralGalaxy(cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(spiralGalaxy.angle);

    // Core Radiant Glow
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, spiralGalaxy.radius * 0.55);
    coreGrad.addColorStop(0, 'rgba(255, 250, 235, 0.95)');
    coreGrad.addColorStop(0.2, 'rgba(254, 215, 170, 0.65)');
    coreGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.25)');
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, spiralGalaxy.radius * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Stardust Spiral Arms
    for (let i = 0; i < spiralGalaxy.armParticles.length; i++) {
      const p = spiralGalaxy.armParticles[i];
      const a = p.angleOffset;
      const x = Math.cos(a) * p.dist + (Math.sin(a) * p.scatter * 0.3);
      const y = (Math.sin(a) * p.dist + (Math.cos(a) * p.scatter * 0.3)) * 0.48; // tilted perspective

      ctx.fillStyle = `${p.color} ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Render Orbiting Vector Satellite (ISS style spacecraft)
  function renderSatellite(now) {
    ctx.save();
    ctx.translate(satellite.x, satellite.y);
    ctx.rotate(satellite.angle);

    // Left Solar Panel Array
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillRect(-38, -8, 22, 16);
    ctx.strokeRect(-38, -8, 22, 16);

    // Solar Panel Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-27, -8); ctx.lineTo(-27, 8);
    ctx.moveTo(-38, 0); ctx.lineTo(-16, 0);
    ctx.stroke();

    // Right Solar Panel Array
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillRect(16, -8, 22, 16);
    ctx.strokeRect(16, -8, 22, 16);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(27, -8); ctx.lineTo(27, 8);
    ctx.moveTo(16, 0); ctx.lineTo(38, 0);
    ctx.stroke();

    // Connecting Trusses
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, 0); ctx.lineTo(-8, 0);
    ctx.moveTo(8, 0); ctx.lineTo(16, 0);
    ctx.stroke();

    // Central Satellite Bus Capsule
    const busGrad = ctx.createLinearGradient(-8, -6, 8, 6);
    busGrad.addColorStop(0, '#f8fafc');
    busGrad.addColorStop(0.5, '#cbd5e1');
    busGrad.addColorStop(1, '#475569');
    ctx.fillStyle = busGrad;
    ctx.fillRect(-8, -6, 16, 12);

    // Dish Antenna
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -9, 5, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Flashing Strobe Beacon Light
    const isStrobeOn = Math.sin(now * 0.005) > 0.6;
    if (isStrobeOn) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(6, -6, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.arc(-6, 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Render Shooting Stars (Meteors)
  function renderMeteors() {
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= m.decay;

      if (m.alpha <= 0 || m.x > w + 100 || m.y > h + 100) {
        meteors.splice(i, 1);
        continue;
      }

      ctx.save();
      const tailX = m.x - (m.vx * 0.45);
      const tailY = m.y - (m.vy * 0.45);
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
      grad.addColorStop(0.3, `rgba(0, 229, 255, ${m.alpha * 0.7})`);
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Glowing Head
      ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Master Cosmic Universe Render Loop
  function renderUniverse(now) {
    // Parallax Interpolation
    curParallaxX += (targetParallaxX - curParallaxX) * 0.045;
    curParallaxY += (targetParallaxY - curParallaxY) * 0.045;

    ctx.clearRect(0, 0, w, h);

    // ── A. Cosmic Nebulas ──
    for (let i = 0; i < nebulas.length; i++) {
      const neb = nebulas[i];
      const nebX = (w * neb.xRatio) + (curParallaxX * 0.2);
      const nebY = (h * neb.yRatio) + (curParallaxY * 0.2);
      const nebR = Math.min(w, h) * neb.rRatio;
      const breathe = Math.sin(now * 0.0005 + neb.phase) * (nebR * 0.08);

      const grad = ctx.createRadialGradient(nebX, nebY, 10, nebX, nebY, nebR + breathe);
      grad.addColorStop(0, neb.color1);
      grad.addColorStop(0.5, neb.color2);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nebX, nebY, nebR + breathe, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── B. Rotating Spiral Galaxy ──
    spiralGalaxy.angle += spiralGalaxy.rotSpeed;
    const galX = (w * spiralGalaxy.xRatio) + (curParallaxX * 0.35);
    const galY = (h * spiralGalaxy.yRatio) + (curParallaxY * 0.35);
    renderSpiralGalaxy(galX, galY);

    // ── C. Ringed Saturn ──
    const saturnX = (w * saturn.xRatio) + (curParallaxX * 0.55);
    const saturnY = (h * saturn.yRatio) + (curParallaxY * 0.55);
    renderSaturn(saturnX, saturnY, now);

    // ── D. Azure Terrestrial Planet ──
    const azPlanetX = (w * azurePlanet.xRatio) + (curParallaxX * 0.45);
    const azPlanetY = (h * azurePlanet.yRatio) + (curParallaxY * 0.45);
    renderAzurePlanet(azPlanetX, azPlanetY, now);

    // ── E. Starfield with Twinkle & Diffraction Spikes ──
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.speedX;
      s.y += s.speedY;
      if (s.x < 0) s.x = w;
      if (s.x > w) s.x = 0;
      if (s.y < 0) s.y = h;
      if (s.y > h) s.y = 0;

      const twinkle = Math.sin(now * s.twinkleSpeed + s.twinklePhase) * 0.28;
      const alpha = Math.max(0.12, Math.min(1.0, s.baseAlpha + twinkle));

      const drawX = s.x + (curParallaxX * (s.depth * 0.7 + 0.15));
      const drawY = s.y + (curParallaxY * (s.depth * 0.7 + 0.15));

      if (s.hasSpikes) {
        drawLensStar(drawX, drawY, s.radius, alpha, s.color);
      } else {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // ── F. Orbiting Satellite ──
    satellite.x += satellite.speedX;
    satellite.y += satellite.speedY;
    if (satellite.x > w + 120 || satellite.y > h + 120) {
      satellite.x = -80;
      satellite.y = Math.random() * (h * 0.5) + 60;
    }
    renderSatellite(now);

    // ── G. Shooting Stars Manager ──
    if (Date.now() > nextMeteorTime) {
      spawnMeteor();
    }
    renderMeteors();

    requestAnimationFrame(renderUniverse);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(renderUniverse);

  // Initialize System
  window.AstroDB.initSupabaseClient();
  const initLang = state.currentUser ? (state.currentUser.preferred_language || 'ar') : (localStorage.getItem('ASTRO_LANG') || 'ar');
  setLanguage(initLang);
  updateMuteButtonUI();

  initAstor3DScene();
  checkExistingSession();

  console.log('🚀 Astro World Deep Space Simulation & Smart Stations Online!');
});




