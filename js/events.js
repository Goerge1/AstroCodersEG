/**
 * Astro World - Game 1 Event Cards Data
 * 16 fully articulated events meeting all pedagogical and realism criteria:
 * - Every choice has a real cost (No free lunch rule)
 * - Delayed consequence mechanisms
 * - Authentic NASA educational fact & verified sourceUrl
 */

export const EVENT_CARDS = [
  {
    id: "oxygen-leak",
    site: "both",
    title_en: "Oxygen Pressure Drop",
    title_ar: "هبوط مفاجئ في ضغط الأكسجين",
    story_en: "A micrometeoroid breach in Module B has triggered an emergency siren! Oxygen is hissing out into the void.",
    story_ar: "اصطدام نيزكي دقيق في الوحدة (B) أطلق صفارات الإنذار! الأكسجين يتسرب بسرعة نحو فراغ الفضاء.",
    icon: "💨",
    choices: [
      {
        id: "spacewalk-patch",
        label_en: "Conduct Spacewalk Patch (Costs Power & Oxygen)",
        label_ar: "خروج للسير في الفضاء وإصلاح الثقب (يستهلك طاقة وأكسجين)",
        effects: { oxygen: -8, power: -15, shield: 0, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Spacewalks (EVAs) use significant battery power and suit oxygen, but preserve habitat space.",
        lesson_ar: "السير في الفضاء يستهلك طاقة بطارية البدلة وأكسجينها، لكنه ينقذ مساحة المعيشة في القاعدة."
      },
      {
        id: "seal-room",
        label_en: "Seal Off Module B (Saves Air, Loses Lab Science)",
        label_ar: "عزل الوحدة (B) بالكامل (يوفر الهواء ويغلق مختبر الأبحاث)",
        effects: { oxygen: -4, power: 0, shield: -5, health: 0, science: -15 },
        delayedEffects: [
          { inTurns: 2, effects: { science: -5 }, reason: "Laboratory closure continues to slow down research output." }
        ],
        lesson_en: "Airlock bulkheads isolate hazards, but sacrificing research modules permanently limits science goals.",
        lesson_ar: "أبواب غرف الضغط تعزل الخطر، لكن التضحية بمختبر الأبحاث تقلص النتائج العلمية."
      },
      {
        id: "boost-generator",
        label_en: "Overdrive Oxygen Generators (Drains Battery Heavily)",
        label_ar: "زيادة طاقة مولدات الأكسجين لتعويض الفاقد (استنزاف حاد للبطارية)",
        effects: { oxygen: 0, power: -28, shield: 0, health: 0, science: 0 },
        delayedEffects: [
          { inTurns: 1, effects: { power: -8 }, reason: "Overheated electrolysis cells require maintenance power." }
        ],
        lesson_en: "Pumping extra oxygen through electrolysis requires massive electrical currents.",
        lesson_ar: "توليد أكسجين إضافي بالتحليل الكهربائي يتطلب تيارات كهربائية هائلة."
      }
    ],
    realFact_en: "On the ISS, oxygen generators split water (H2O) into hydrogen and oxygen through electrolysis.",
    realFact_ar: "في محطة الفضاء الدولية، يُفصل الأكسجين عن الهيدروجين من الماء المعاد تدويره عبر التحليل الكهربائي.",
    sourceUrl: "https://www.nasa.gov/international-space-station/space-station-research-and-technology/"
  },

  {
    id: "visor-crack",
    site: "both",
    title_en: "Visor Crack on Spacewalk",
    title_ar: "شرخ في زجاج الخوذة أثناء السير",
    story_en: "While collecting mineral samples outside, a sharp tool slips and fractures the astronaut's outer visor layer!",
    story_ar: "أثناء جمع عينات التربة، انزلقت أداة حادة وأحدثت شرخاً في الطبقة الخارجية لزجاج خوذة الرائد!",
    icon: "🪖",
    choices: [
      {
        id: "abort-eva",
        label_en: "Abort Spacewalk Immediately (Safe, Drop Samples)",
        label_ar: "إلغاء الخروج فوراً (آمن، لكن تفقد العينات الصخرية)",
        effects: { oxygen: -5, power: -5, shield: 0, health: 0, science: -10 },
        delayedEffects: [],
        lesson_en: "Flight rules mandate immediate abort for pressure garment damage, regardless of science lost.",
        lesson_ar: "تفرض لوائح ناسا إلغاء المهمة فوراً عند أي ضرر في خوذة الضغط لحماية حياة الرائد."
      },
      {
        id: "emergency-tape",
        label_en: "Apply Kapton Tape (30% Risk of Pressure Leak)",
        label_ar: "إصلاح سريع بشريط كابتون (مخاطرة 30% بتسرب الضغط)",
        riskChance: 0.3,
        riskEffects: { health: -1, oxygen: -15 },
        effects: { oxygen: -5, power: -8, shield: 0, health: 0, science: 15 },
        delayedEffects: [],
        lesson_en: "Field improvisations carry life-threatening risks in vacuum environments.",
        lesson_ar: "الحلول الارتجالية في الفراغ تنطوي على مخاطر تهدد الحياة."
      },
      {
        id: "robot-deploy",
        label_en: "Send Remote Rover Later (Costs Power, Slow)",
        label_ar: "إرسال روبوت متحكم به عن بعد لاحقاً (يستهلك طاقة إضافية)",
        effects: { oxygen: 0, power: -18, shield: 0, health: 0, science: 5 },
        delayedEffects: [
          { inTurns: 1, effects: { science: 10 }, reason: "Rover finishes sample retrieval safely." }
        ],
        lesson_en: "Robots keep astronauts safe, but operate slower and require dedicated control power.",
        lesson_ar: "الروبوتات تبعد الرواد عن الخطر، لكنها أبطأ وتستهلك طاقة لاسلكية كبيرة."
      }
    ],
    realFact_en: "NASA EMU space suit visors have multiple polycarbonate layers coated with a thin gold film to reflect sunlight.",
    realFact_ar: "تتكون خوذات رواد فضاء ناسا من طبقات بولي كربونات متعددة مغلفة بذهب عاكس لضوء الشمس وحرارتها.",
    sourceUrl: "https://www.nasa.gov/suitup/"
  },

  {
    id: "solar-storm",
    site: "both",
    title_en: "Solar Storm Radiation Alert",
    title_ar: "إنذار عاصفة شمسية إشعاعية (DONKI)",
    story_en: "Deep-space observatories detected a massive coronal mass ejection headed directly toward the base!",
    story_ar: "رصدت تلسكوبات الفضاء انبعاثاً كتلیاً إكليلياً هائلاً يتجه مباشرة نحو موقع محطتنا!",
    icon: "☀️",
    choices: [
      {
        id: "shelter-in-place",
        label_en: "All Crew to Storm Shelter (Halt Science, Save Health)",
        label_ar: "احتماء الطاقم في المأوى المحصن (وقف الأبحاث، حماية الصحة)",
        effects: { oxygen: -5, power: -10, shield: -15, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "Thick water and food storage bunkers shield crew bodies from high-energy solar protons.",
        lesson_ar: "تستخدم موائل الفضاء خزانات المياه وأكياس الطعام كجدران واقية لصد بروتونات الشمس."
      },
      {
        id: "boost-magnetic-shield",
        label_en: "Overpower Active Deflector (Extreme Power Drain)",
        label_ar: "شحن الدرع الكهرومغناطيسي بأقصى طاقة (استنزاف كهربائي هائل)",
        effects: { oxygen: 0, power: -30, shield: 10, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Active magnetic shielding demands enormous electrical power from habitat reserves.",
        lesson_ar: "تشغيل دروع الحقول المغناطيسية يتطلب طاقة كهربائية ضخمة من بطاريات المحطة."
      },
      {
        id: "continue-operations",
        label_en: "Keep Working (High Science, Crew Radiation Risk)",
        label_ar: "مواصلة العمل الخارجي (نقاط علمية عالية، وخطر صحي)",
        effects: { oxygen: -8, power: -5, shield: -25, health: -1, science: 25 },
        delayedEffects: [
          { inTurns: 1, effects: { health: -1 }, reason: "Acute solar radiation sickness weakens crew stamina." }
        ],
        lesson_en: "Space radiation can damage cellular DNA and cause acute radiation sickness without shielding.",
        lesson_ar: "الإشعاع الشمسي يتلف الحمض النووي للخلايا ويسبب الغثيان ووهن الطاقم إن لم يحتموا."
      }
    ],
    realFact_en: "NASA's Space Radiation Analysis Group (SRAG) uses DONKI data to warn astronauts to retreat to shielded modules.",
    realFact_ar: "تعتمد مجموعة تحليل الإشعاع في ناسا (SRAG) على بيانات DONKI لتحذير الرواد بالاحتماء قبل وصول الجسيمات.",
    sourceUrl: "https://www.nasa.gov/hrp/radiation/"
  },

  {
    id: "co2-scrubber",
    site: "both",
    title_en: "CO2 Scrubber Canister Clogged",
    title_ar: "انسداد مرشح ثاني أكسيد الكربون",
    story_en: "Air recycling monitors beep: cabin carbon dioxide levels are creeping up toward toxic thresholds!",
    story_ar: "أجهزة استشعار الهواء تدق ناقوس الخطر: مستويات ثاني أكسيد الكربون في المقصورة ترتفع نحو مستويات خانقة!",
    icon: "🫁",
    choices: [
      {
        id: "manual-clean",
        label_en: "Manual Cleaning Cycle (Consumes Entire Crew Shift)",
        label_ar: "تنظيف يدوي شاق (يستهلك وقت ونشاط الطاقم بالكامل)",
        effects: { oxygen: -5, power: -8, shield: 0, health: 0, science: -5 },
        delayedEffects: [],
        lesson_en: "Scrubbing amine beds manually keeps air breathable but takes hours of precious crew time.",
        lesson_ar: "تنظيف المرشحات يدوياً يعيد نقاء الهواء لكنه يستنزف ساعات طويلة من وقت الطاقم."
      },
      {
        id: "use-spare-filter",
        label_en: "Install Emergency Spare (Quick, Uses Only Spare)",
        label_ar: "تركيب الفلتر الاحتياطي الوحيد (سريع، لكن تنفد قطع الغيار)",
        effects: { oxygen: 5, power: -4, shield: 0, health: 0, science: 0 },
        delayedEffects: [
          { inTurns: 3, effects: { oxygen: -8 }, reason: "No spare filters remain; system wear increases." }
        ],
        lesson_en: "Spare parts are strictly limited in deep space; once expended, backups no longer exist.",
        lesson_ar: "قطع الغيار محدودة جداً في الفضاء؛ فإذا استهلكت البديل الاحتياطي لن تجد بديلاً آخر."
      },
      {
        id: "delay-cleaning",
        label_en: "Postpone to Tomorrow (Save Power Today, Severe Delay)",
        label_ar: "تأجيل الصيانة للغد (توفير الطاقة اليوم، وعواقب مضاعفة لاحقاً)",
        effects: { oxygen: -2, power: 5, shield: 0, health: 0, science: 0 },
        delayedEffects: [
          { inTurns: 1, effects: { oxygen: -15, health: -1 }, reason: "Accumulated CO2 causes headaches and lethargy." }
        ],
        lesson_en: "Elevated CO2 impairs decision-making and leads to severe cognitive and physical fatigue.",
        lesson_ar: "تراكم ثاني أكسيد الكربون يضعف تركيز رواد الفضاء ويصيبهم بصداع وإرهاق شديدين."
      }
    ],
    realFact_en: "Apollo 13 famously engineered a square cartridge into a round hole using duct tape and plastic to scrub CO2.",
    realFact_ar: "في رحلة أبولو 13 الشهيرة، ابتكر الرواد موائماً لتشغيل خراطيش مربعة في منافذ دائرية لإنقاذ أنفسهم من الاختناق.",
    sourceUrl: "https://www.nasa.gov/history/apollo-13/"
  },

  {
    id: "water-recycler",
    site: "both",
    title_en: "Water Filtration Pump Jam",
    title_ar: "عطل مضخة تنقية المياه",
    story_en: "The water processor has suffered a valve jam. Gray water cannot be purified until resolved.",
    story_ar: "تعرضت وحدة معالجة المياه لانسداد في الصمامات. تعذر تنقية المياه الرمادية للشرب!",
    icon: "💧",
    choices: [
      {
        id: "repair-pump",
        label_en: "Perform Precision Disassembly (Costs Power & Tools)",
        label_ar: "فك المضخة وإصلاحها بدقة (يستهلك طاقة وأدوات)",
        effects: { oxygen: -3, power: -14, shield: 0, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Water recovery systems recycle nearly 98% of crew moisture aboard exploration bases.",
        lesson_ar: "تستعيد أنظمة المياه في الفضاء قرابة 98% من الرطوبة لتأمين مياه الشرب النقية."
      },
      {
        id: "ration-water",
        label_en: "Ration Water Supply (Saves Power, Mild Fatigue)",
        label_ar: "ترشيد استهلاك المياه (يوفر الطاقة، لكن يجهد الطاقم)",
        effects: { oxygen: 0, power: 0, shield: 0, health: 0, science: -10 },
        delayedEffects: [
          { inTurns: 1, effects: { health: -1 }, reason: "Dehydration lowers physical endurance." }
        ],
        lesson_en: "Astronauts require at least 2.5 liters of water daily to maintain metabolic balance.",
        lesson_ar: "يحتاج رائد الفضاء إلى 2.5 لتر ماء يومياً على الأقل للحفاظ على توازن وظائف الجسم الحيوية."
      },
      {
        id: "melt-lunar-ice",
        label_en: "Melt Frozen Core Ice (High Power, Huge Water Gain)",
        label_ar: "صهر كتل الجليد القمري/المريخي (طاقة هائلة، مع وفرة مائية)",
        effects: { oxygen: 5, power: -24, shield: 5, health: 0, science: 10 },
        delayedEffects: [],
        lesson_en: "In-situ resource utilization (ISRU) uses local ice to manufacture oxygen and water.",
        lesson_ar: "استغلال الموارد المحلية (ISRU) يعتمد على صهر الجليد لإنتاج الأكسجين وماء الشرب."
      }
    ],
    realFact_en: "The ISS Water Recovery System recycles astronaut sweat, breath condensation, and urine into ultrapure drinking water.",
    realFact_ar: "يعيد نظام استرجاع المياه في محطة الفضاء تدوير عرق الرواد وزفيرهم ليتحول إلى ماء أنقى من مياه الصنبور على الأرض.",
    sourceUrl: "https://www.nasa.gov/mission/water-recovery-system/"
  },

  {
    id: "greenhouse-blight",
    site: "both",
    title_en: "Hydroponic Crop Mold Outbreak",
    title_ar: "ظهور عفن في نباتات المزرعة المائية",
    story_en: "Microscopic fungi have appeared on the outpost's dwarf wheat and lettuce leaves inside the growth chamber.",
    story_ar: "رُصدت فطريات مجهرية على أوراق الخس والقمح القزمي داخل حجرة النمو المائي في المحطة.",
    icon: "🌱",
    choices: [
      {
        id: "cull-infected",
        label_en: "Cull Infected Crop (Drop Oxygen Output, Stop Spread)",
        label_ar: "إتلاف النباتات المصابة (يقلل إنتاج الأكسجين ويمنع العدوى)",
        effects: { oxygen: -12, power: 0, shield: 0, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Plants provide fresh psychological boosts and oxygen, but isolated biospheres are fragile.",
        lesson_ar: "النباتات ترفع الروح المعنوية وتنتج الأكسجين، لكن البيئات المغلقة سريعة التأثر بالفطريات."
      },
      {
        id: "uv-sterilize",
        label_en: "Intense UV Sterilization (Heavy Power Cost)",
        label_ar: "تعقيم مكثف بالأشعة فوق البنفسجية (يستهلك طاقة عالية)",
        effects: { oxygen: 0, power: -20, shield: 0, health: 0, science: 10 },
        delayedEffects: [],
        lesson_en: "Germicidal ultraviolet light kills airborne spores without toxic chemicals.",
        lesson_ar: "الأشعة فوق البنفسجية تقضي على الجراثيم والفطريات دون الحاجة لمواد كيميائية سامة."
      },
      {
        id: "ask-earth-botanist",
        label_en: "Transmit Data to Earth Botanists (Comms Delay)",
        label_ar: "إرسال البيانات لعلماء النبات في الأرض (تأخر الرد)",
        effects: { oxygen: -5, power: -5, shield: 0, health: 0, science: 5 },
        delayedEffects: [
          { inTurns: 1, effects: { oxygen: 8 }, reason: "Earth science advice yields effective cure formula." }
        ],
        lesson_en: "Mission support botanists can formulate solutions, but radio travel time delays execution.",
        lesson_ar: "علماء الأرض يقدمون حلولاً دقيقة، لكن تأخر إشارات الراديو يؤخر تطبيق العلاج."
      }
    ],
    realFact_en: "NASA's Veggie facility on the ISS has successfully grown red romaine lettuce, zinnia flowers, and chili peppers.",
    realFact_ar: "نجحت تجربة 'فيجي' (Veggie) في ناسا في زراعة الخس الروماني وزهور الزينيا والفلفل الحار في الفضاء.",
    sourceUrl: "https://www.nasa.gov/mission/station/research-web/growing-plants-in-space/"
  },

  {
    id: "micrometeorite",
    site: "both",
    title_en: "Micrometeorite Hull Impact",
    title_ar: "اصطدام نيزك دقيق بالهيكل الخارجي",
    story_en: "A pebble-sized space rock traveling at 25 km/s slammed into the habitat's outer Whipple bumper!",
    story_ar: "صخرة فضائية بحجم حبة الحمص تسير بسرعة 25 كم/ث اصطدمت بالدرع الخارجي لحماية المحطة!",
    icon: "☄️",
    choices: [
      {
        id: "inspect-repair",
        label_en: "Perform EVA Hull Inspection (Costs Oxygen & Power)",
        label_ar: "خروج لفحص الدرع وإصلاحه (يستهلك أكسجيناً وطاقة)",
        effects: { oxygen: -7, power: -12, shield: 15, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Whipple shields absorb impact energy by vaporizing projectiles before they pierce inner walls.",
        lesson_ar: "دروع 'ويبل' تفتت المقذوفات النيزكية السريعة قبل أن تخترق جدران المحطة الداخلية."
      },
      {
        id: "re-route-power",
        label_en: "Electrically Re-route Damaged Sensors (Quick)",
        label_ar: "إعادة توجيه الدوائر الكهربائية حول منطقة الضرر (سريع)",
        effects: { oxygen: 0, power: -8, shield: -5, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "Redundant wiring prevents isolated punctures from shutting down entire habitat zones.",
        lesson_ar: "الدوائر الاحتياطية تمنع انقطاع الكهرباء عن بقية المحطة عند تضرر جزء معين."
      },
      {
        id: "ignore-damage",
        label_en: "Defer Inspection to Save Power (Risky)",
        label_ar: "تجاهل الفحص لتوفير الطاقة (مخاطرة بوجود تصدع خفي)",
        effects: { oxygen: 0, power: 5, shield: -15, health: 0, science: 0 },
        delayedEffects: [
          { inTurns: 2, effects: { shield: -15, oxygen: -8 }, reason: "Undetected micro-fracture widens under thermal stress." }
        ],
        lesson_en: "Extreme temperature shifts between day and night expand unpatched fractures over time.",
        lesson_ar: "فروق درجات الحرارة بين النهار والليل تؤدي لتمدد الشروخ غير المعالجة وتفاقم التسرب."
      }
    ],
    realFact_en: "Fred Whipple invented the multi-layer bumper shield in 1947, which is still used on space stations today.",
    realFact_ar: "ابتكر العالم فريد ويبل درع الصدمات متعدد الطبقات عام 1947، وهو المستخدم حتى اليوم في المحطات الفضائية.",
    sourceUrl: "https://www.nasa.gov/mission/orbital-debris-program/"
  },

  {
    id: "dust-storm",
    site: "mars",
    title_en: "Regional Martian Dust Storm",
    title_ar: "عاصفة غبار مريخية إقليمية",
    story_en: "Thick reddish dust blankets Jezero Crater. The sky has turned dull butterscotch and sunlight drops by 70%!",
    story_ar: "غبار أحمر كثيف يغطي فوهة جيزيرو. تحولت السماء للون المغرة المعتم وتراجع ضوء الشمس بنسبة 70%!",
    icon: "🌪️",
    choices: [
      {
        id: "battery-conservation",
        label_en: "Switch to Low-Power Safe Mode (Cut Science)",
        label_ar: "التحول لنمط توفير الطاقة الآمن (إيقاف الأبحاث العلمية)",
        effects: { oxygen: -4, power: -6, shield: -5, health: 0, science: -10 },
        delayedEffects: [
          { inTurns: 1, effects: { power: -5 }, reason: "Lingering dust storm continues to dim solar panels." }
        ],
        lesson_en: "Dust storms on Mars can last weeks or months, starving solar arrays of vital sunlight.",
        lesson_ar: "عواصف الغبار على المريخ قد تدوم لأسابيع وتحرم الألواح الشمسية من الضوء الحيوي."
      },
      {
        id: "wiper-spacewalk",
        label_en: "Spacewalk to Brush Solar Arrays (High Oxygen Cost)",
        label_ar: "خروج لتنظيف الألواح يدوياً بالفرشاة (يستهلك أكسجيناً)",
        effects: { oxygen: -12, power: 12, shield: 0, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Fine electrostatic Martian dust clings stubbornly to glass panels and spacesuit fabrics.",
        lesson_ar: "غبار المريخ المشحون بالكهرباء الساكنة يلتصق بالألواح الشمسية وأقمشة البدلات بإحكام."
      },
      {
        id: "nuclear-backup",
        label_en: "Fire Auxiliary Thermal Generator (Burns Emergency Fuel)",
        label_ar: "تشغيل المولد الحراري الاحتياطي (يستهلك وقود الطوارئ)",
        effects: { oxygen: 0, power: 15, shield: -10, health: 0, science: 5 },
        delayedEffects: [
          { inTurns: 2, effects: { power: -10 }, reason: "Emergency fuel depletion leaves fewer reserves." }
        ],
        lesson_en: "Radioisotope Thermoelectric Generators (RTGs) provide reliable power even in zero sunlight.",
        lesson_ar: "توفر المولدات الإشعاعية (RTG) طاقة مستمرة حتى أثناء انعدام ضوء الشمس تماماً."
      }
    ],
    realFact_en: "NASA's Opportunity rover operated for 15 years until a massive 2018 global dust storm covered its solar panels.",
    realFact_ar: "عمل المسبار 'أبورتيونيتي' لمدة 15 عاماً على المريخ حتى غطت عاصفة غبار كوكبية عام 2018 ألواحه الشمسية.",
    sourceUrl: "https://mars.nasa.gov/mer/mission/overview/"
  },

  {
    id: "lunar-night",
    site: "moon",
    title_en: "Onset of the Two-Week Lunar Night",
    title_ar: "حلول ليل القمر القارس (14 يوماً)",
    story_en: "The Sun has dipped below Shackleton's rim. Fourteen Earth days of absolute pitch darkness and -130°C begin now!",
    story_ar: "غابت الشمس خلف حافة فوهة شاكلتون. بدأت 14 يوماً أرضياً من الظلام الدامس والبرد القارس (-130 مئوية)!",
    icon: "🌑",
    choices: [
      {
        id: "draw-battery",
        label_en: "Rely on Stored Battery Power (Pre-charged)",
        label_ar: "الاعتماد على شحن البطاريات المدخرة (المحفوظة مسبقاً)",
        effects: { oxygen: -5, power: -22, shield: 0, health: 0, science: 5 },
        delayedEffects: [
          { inTurns: 1, effects: { power: -15 }, reason: "Freezing night continues to sap electrochemical cells." }
        ],
        lesson_en: "Surviving the lunar night requires storing massive energy reserves while the sun shines.",
        lesson_ar: "النجاة من ليل القمر تتطلب تخزين كميات طاقة ضخمة مسبقاً أثناء النهار الشمسي الطويل."
      },
      {
        id: "hibernate-modules",
        label_en: "Hibernate Non-Essential Modules (Saves Battery)",
        label_ar: "تجميد وتدفئة الوحدات الأساسية فقط (يوفر الطاقة)",
        effects: { oxygen: -8, power: -10, shield: -10, health: 0, science: -12 },
        delayedEffects: [],
        lesson_en: "Heating keeps electronics above minimum operating temperatures so solder doesn't crack.",
        lesson_ar: "التدفئة الكهربائية تحمي الدوائر الإلكترونية من التجمد والكسر بفعل الانكماش الحراري."
      },
      {
        id: "fuel-cell-react",
        label_en: "Activate Regenerative Fuel Cells (Consumes Hydrogen)",
        label_ar: "تشغيل خلايا وقود الهيدروجين المجددة (يستهلك مخزون الغاز)",
        effects: { oxygen: -10, power: 8, shield: 0, health: 0, science: 10 },
        delayedEffects: [],
        lesson_en: "Fuel cells combine hydrogen and oxygen to produce power and clean warm water at night.",
        lesson_ar: "تجمع خلايا الوقود بين الهيدروجين والأكسجين لإنتاج الكهرباء والماء الدافئ الصالح للشرب ليلاً."
      }
    ],
    realFact_en: "Temperatures inside permanently shadowed lunar craters can drop to -246°C (-410°F), among the coldest in the solar system.",
    realFact_ar: "تنخفض درجات الحرارة في الفوهات المظلمة دائماً على القمر إلى -246 درجة مئوية، وهي من أبرد البقاع في الكون.",
    sourceUrl: "https://www.nasa.gov/moon/"
  },

  {
    id: "comms-delay",
    site: "mars",
    title_en: "Critical Radio Transmission Lag",
    title_ar: "أزمة تأخر إشارات الراديو (المريخ والأرض)",
    story_en: "An unexpected telemetry warning popped up on life support. Earth is 18 light-minutes away!",
    story_ar: "ظهر تحذير مفاجئ في أجهزة القياس الحيوية. تبعد الأرض 18 دقيقة ضوئية عن موقعنا!",
    icon: "📡",
    choices: [
      {
        id: "decide-locally",
        label_en: "Crew Decides Autonomously Now (Immediate Action)",
        label_ar: "اتخاذ القرار محلياً وفوراً (تدخل مباشر وسريع)",
        effects: { oxygen: -4, power: -10, shield: 0, health: 0, science: 10 },
        delayedEffects: [],
        lesson_en: "Because radio takes up to 22 minutes to reach Earth, astronauts must train to make emergency decisions alone.",
        lesson_ar: "لأن وصول إشارة الراديو للأرض يستغرق حتى 22 دقيقة، يتدرب رواد المريخ على حسم القرارات بمفردهم."
      },
      {
        id: "wait-for-houston",
        label_en: "Transmit to Houston and Wait for Reply (Takes 1 Turn)",
        label_ar: "إرسال البيانات لمركز القيادة في هيوستن وانتظار الرد (دور كامل)",
        effects: { oxygen: -10, power: -2, shield: 0, health: 0, science: 0 },
        delayedEffects: [
          { inTurns: 1, effects: { oxygen: 6, science: 8 }, reason: "Houston flight engineers beam optimal fix protocol." }
        ],
        lesson_en: "Waiting for Mission Control is safer for complex analysis, but loses critical response time.",
        lesson_ar: "انتظار توجيهات الأرض يضمن خبرة هندسية دقيقة، لكنه يكلف زمناً ثميناً أثناء الطوارئ."
      },
      {
        id: "safe-standby",
        label_en: "Isolate Subsystem on Battery Backup (Moderate Cost)",
        label_ar: "عزل النظام الفرعي وتشغيله على البطارية المعزولة",
        effects: { oxygen: -2, power: -14, shield: -5, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "Fail-safe designs disconnect problematic circuits before catastrophic damage occurs.",
        lesson_ar: "التصميمات الآمنة تعزل الدوائر المشكوك فيها تلقائياً لتفادي حدوث ماس كهربائي عام."
      }
    ],
    realFact_en: "Radio signals travel at 300,000 km/s (speed of light), yet the round-trip talk delay to Mars can exceed 40 minutes.",
    realFact_ar: "تسافر إشارات الراديو بسرعة الضوء (300 ألف كم/ث)، ورغم ذلك يستغرق السؤال وجوابه من المريخ أكثر من 40 دقيقة.",
    sourceUrl: "https://mars.nasa.gov/mars2020/mission/communications/"
  },

  {
    id: "microgravity-loss",
    site: "both",
    title_en: "Crew Muscle & Bone Loss",
    title_ar: "فقدان كثافة العضلات والعظام (OSD-452)",
    story_en: "Routine medical scans show crew calcium excretion is rising due to reduced gravity.",
    story_ar: "أظهرت الفحوصات الطبية الدورية تراجعاً طفيفاً في كتلة عظام الطاقم نتيجة قلة الجاذبية.",
    icon: "🦴",
    choices: [
      {
        id: "heavy-exercise",
        label_en: "Mandate Extra 2-Hour Daily Resistance Training",
        label_ar: "فرض ساعتين إضافيتين من تمارين المقاومة الثقيلة يومياً",
        effects: { oxygen: -10, power: -8, shield: 0, health: 1, science: -5 },
        delayedEffects: [],
        lesson_en: "Intense daily exercise loads the skeleton, triggering bones to maintain mineral density.",
        lesson_ar: "التمارين الرياضية المكثفة تضغط على الهيكل العظمي وتحث الخلايا على الحفاظ على الكالسيوم."
      },
      {
        id: "pharmaceutical-diet",
        label_en: "Increase Calcium & Bisphosphonate Rations (Costs Supplies)",
        label_ar: "زيادة مكملات الكالسيوم والأغذية الطبية المخصصة",
        effects: { oxygen: -3, power: -4, shield: 0, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Nutrition combined with targeted vitamins counteracts metabolic shifts in space.",
        lesson_ar: "التغذية العلاجية الغنية بالفيتامينات تساعد على مقاومة التغيرات الحيوية في الفضاء."
      },
      {
        id: "postpone-workouts",
        label_en: "Reduce Workout Schedule to Focus on Science (Risky)",
        label_ar: "تقليص جدول الرياضة للتركيز على التجارب العلمية (مخاطرة)",
        effects: { oxygen: 0, power: 0, shield: 0, health: -1, science: 20 },
        delayedEffects: [
          { inTurns: 2, effects: { health: -1 }, reason: "Weakened back and leg muscles increase physical fatigue." }
        ],
        lesson_en: "Skipping workouts leads to rapid muscle atrophy and spine elongation discomfort.",
        lesson_ar: "إهمال التمارين الرياضية يسبب ضموراً عضلياً سريعاً وآلاماً حادة في الظهر."
      }
    ],
    realFact_en: "Without countermeasures, astronauts can lose up to 1% to 1.5% of their bone mineral density per month in space.",
    realFact_ar: "دون تمارين وقائية، يمكن أن يفقد رائد الفضاء ما بين 1% إلى 1.5% من كثافة عظامه شهرياً في الفضاء.",
    sourceUrl: "https://osdr.nasa.gov/bio/repo/data/study/OSD-452"
  },

  {
    id: "moonquake",
    site: "moon",
    title_en: "Shallow Lunar Quake Tremor",
    title_ar: "هزة زلزالية قمرية سطحية",
    story_en: "Seismometers spike! A magnitude 4 shallow moonquake shakes the bedrock beneath the habitat.",
    story_ar: "مجسات الزلازل تسجل هزة! زلزال قمري بقوة 4 درجات يهز الصخور أسفل أساسات المحطة.",
    icon: "🌋",
    choices: [
      {
        id: "structural-diagnostic",
        label_en: "Full Structural Sonar Scan (Costs Battery Power)",
        label_ar: "فحص صوتي شامل لأساسات الموئل (يستهلك طاقة البطارية)",
        effects: { oxygen: -3, power: -16, shield: 5, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Moonquakes lack water to dampen vibrations, so the lunar crust rings like a tuning fork for hours.",
        lesson_ar: "تفتقر صخور القمر للماء الذي يمتص الاهتزازات، لذلك يستمر القمر في التذبذب والاهتزاز لساعات كالجرس."
      },
      {
        id: "check-airlocks",
        label_en: "Rapid Airlock Seal Verification (Saves Air)",
        label_ar: "فحص سريع وموضعي لأقفال غرف الضغط فقط",
        effects: { oxygen: -2, power: -6, shield: 0, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "Flexible bellows joints absorb ground shifts without tearing airtight seals.",
        lesson_ar: "الفواصل المرنة بين وحدات المحطة تمتص الحركات الأرضية لمنع تمزق أختام الهواء."
      },
      {
        id: "skip-checks",
        label_en: "Assume Structurally Sound (Save Power, Hidden Risk)",
        label_ar: "افتراض سلامة الهيكل لتوفير الطاقة (مخاطرة بضرر خفي)",
        effects: { oxygen: 0, power: 5, shield: -10, health: 0, science: 0 },
        delayedEffects: [
          { inTurns: 2, effects: { shield: -15, power: -10 }, reason: "Loosened power cable shorts out against foundation." }
        ],
        lesson_en: "Undetected micro-cracks in rigid foundations can lead to subsequent electrical shorts.",
        lesson_ar: "التشققات الدقيقة غير المكتشفة في الأساسات قد تقطع الكابلات وتحدث ماساً كهربائياً لاحقاً."
      }
    ],
    realFact_en: "Apollo seismometers detected shallow moonquakes that lasted over 10 minutes, caused by tidal forces and thermal cooling.",
    realFact_ar: "سجلت أجهزة قياس الزلازل التي تركها رواد أبولو هزات قمرية دامت أكثر من 10 دقائق بسبب قوى المد والجزر والتبريد.",
    sourceUrl: "https://www.nasa.gov/moon/"
  },

  {
    id: "battery-overheat",
    site: "both",
    title_en: "Battery Thermal Runaway Warning",
    title_ar: "تحذير ارتفاع حرارة بنك البطاريات",
    story_en: "Main storage bank temperature sensor reads 62°C! Heat rejection radiators are struggling.",
    story_ar: "مجسات حرارة بنك البطاريات الرئيسي تسجل 62 درجة مئوية! مشعات التبريد تعاني لتشتيت الحرارة.",
    icon: "🔋",
    choices: [
      {
        id: "vent-heat-radiate",
        label_en: "Vent Cooling Fluid & Dump Stored Charge (Safe, Loses Power)",
        label_ar: "تفريغ سائل التبريد وشحن البطارية الفائض (آمن، لكن تفقد طاقة)",
        effects: { oxygen: 0, power: -20, shield: 0, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "In a vacuum, heat cannot transfer by air; it can only escape through thermal radiation into space.",
        lesson_ar: "في فراغ الفضاء، لا ينتقل الدفء بالهواء، بل يجب تشتيت الحرارة عبر المشعات الإشعاعية نحو الفضاء المظلم."
      },
      {
        id: "throttle-cabin",
        label_en: "Power Down Cabin Lighting & Life Support Heat (Chilly)",
        label_ar: "إطفاء أجهزة التدفئة والإنارة غير الضرورية (برد مؤقت)",
        effects: { oxygen: -5, power: -5, shield: -5, health: 0, science: -5 },
        delayedEffects: [],
        lesson_en: "Shedding electrical loads allows overheated lithium-ion cells to cool down gradually.",
        lesson_ar: "تقليل الحمل الكهربائي يتيح لخلايا الليثيوم-أيون الساخنة أن تبرد تدريجياً وبأمان."
      },
      {
        id: "push-through",
        label_en: "Keep Maximum Load (40% Risk of Permanent Cell Damage)",
        label_ar: "الاستمرار بالحمل الكامل (مخاطرة 40% بتلف البطارية نهائياً)",
        riskChance: 0.4,
        riskEffects: { power: -25, shield: -10 },
        effects: { oxygen: 0, power: 0, shield: 0, health: 0, science: 15 },
        delayedEffects: [],
        lesson_en: "Pushing lithium batteries beyond thermal limits causes irreversible capacity loss.",
        lesson_ar: "تشغيل بطاريات الليثيوم فوق حدود حرارتها القصوى يفقدها سعتها التخزينية بشكل دائم."
      }
    ],
    realFact_en: "Spacecraft use ammonia-filled radiator loops to pump waste heat from inside computers out into space.",
    realFact_ar: "تستخدم المحطات الفضائية أنابيب أمونيا مضغوطة لنقل حرارة الأجهزة الإلكترونية نحو ألواح التبريد الخارجية.",
    sourceUrl: "https://www.nasa.gov/international-space-station/"
  },

  {
    id: "science-anomaly",
    site: "both",
    title_en: "Subsurface Volatile Discovery!",
    title_ar: "اكتشاف غازات نادرة تحت السطح!",
    story_en: "A drilling probe struck an unexpected geological fissure emitting rare trapped helium-3 or ancient methane!",
    story_ar: "اصطدم مسبار الحفر بشق جيولوجي ينبعث منه غاز الهيليوم-3 النادر أو غاز الميثان القديم!",
    icon: "🔬",
    choices: [
      {
        id: "full-analysis",
        label_en: "Deploy Spectrometer Array (Drains Heavy Battery & Oxygen)",
        label_ar: "تشغيل مطياف التحليل بكل طاقته (يستهلك طاقة وأكسجيناً بكثرة)",
        effects: { oxygen: -10, power: -20, shield: 0, health: 0, science: 35 },
        delayedEffects: [],
        lesson_en: "Major scientific discoveries require dedicated spectrometer cycles and sample preservation.",
        lesson_ar: "تحليل الاكتشافات العلمية الكبرى يتطلب تشغيل أجهزة المطياف وسحب طاقة كهربائية معتبرة."
      },
      {
        id: "quick-sample",
        label_en: "Take Quick Canister Sample (Balanced Cost & Reward)",
        label_ar: "جمع عينة سريعة في أسطوانة محكمة (تكلفة متوازنة)",
        effects: { oxygen: -5, power: -8, shield: 0, health: 0, science: 15 },
        delayedEffects: [],
        lesson_en: "Standard field sampling secures evidence while reserving power for routine survival.",
        lesson_ar: "أخذ عينات قياسية سريعة يحفظ الاكتشاف ويوفر الطاقة اللازمة للبقاء."
      },
      {
        id: "mark-and-bypass",
        label_en: "Mark GPS Waypoint and Return to Safety (Save Oxygen)",
        label_ar: "تسجيل الإحداثيات والعودة للأمان فوراً (توفير الأكسجين)",
        effects: { oxygen: -2, power: -5, shield: 0, health: 0, science: 5 },
        delayedEffects: [],
        lesson_en: "Prudent mission commanders prioritize outpost safety over opportunism.",
        lesson_ar: "قائد المهمة الحكيم يقدم أمان المحطة وطاقتها على المغامرات غير المخطط لها."
      }
    ],
    realFact_en: "NASA's Curiosity and Perseverance rovers use the SAM and SHERLOC instrument suites to identify organic molecules on Mars.",
    realFact_ar: "يستخدم مسبارا كوريوسيتي وبيرسيفيرنس مطياف الليزر (SHERLOC) لتحليل المركبات العضوية في صخور المريخ.",
    sourceUrl: "https://mars.nasa.gov/msl/mission/instruments/sam/"
  },

  {
    id: "resupply-drop",
    site: "both",
    title_en: "Autonomous Cargo Lander Touchdown",
    title_ar: "هبوط كبسولة الإمداد التلقائية",
    story_en: "An uncrewed supply rocket safely touched down nearby, but storage volume in the airlock is strictly limited!",
    story_ar: "هبطت كبسولة شحن غير مأهولة بسلام على مقربة، لكن سعة غرفة الضغط تتسع لحمولة واحدة فقط!",
    icon: "📦",
    choices: [
      {
        id: "cargo-oxygen",
        label_en: "Unload Pressurized Oxygen Pods (+30 Oxygen, -10 Power)",
        label_ar: "تفريغ خزانات الأكسجين المضغوط (+30 أكسجين، -10 طاقة نقل)",
        effects: { oxygen: 30, power: -10, shield: 0, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "Prioritizing breathing gas secures crew survival margins for many sols ahead.",
        lesson_ar: "تأمين مخزون الأكسجين يمنح الطاقم أماناً مريحاً للتنفس لعدة أدوار قادمة."
      },
      {
        id: "cargo-shield",
        label_en: "Unload Polyethylene Shield Tiles (+30 Shield, -10 Power)",
        label_ar: "تفريغ ألواح دروع البولي إيثيلين (+30 درع، -10 طاقة نقل)",
        effects: { oxygen: 0, power: -10, shield: 30, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "Hydrogen-rich polymers provide exceptional protection against deep-space cosmic rays.",
        lesson_ar: "توفر البوليمرات الغنية بالهيدروجين حماية ممتازة لصد الأشعة الكونية في الفضاء."
      },
      {
        id: "cargo-science",
        label_en: "Unload Laboratory Centrifuge (+35 Science, -12 Power)",
        label_ar: "تفريغ جهاز الطرد المركزي للمختبر (+35 نقاط علمية، -12 طاقة)",
        effects: { oxygen: 0, power: -12, shield: 0, health: 0, science: 35 },
        delayedEffects: [],
        lesson_en: "Advanced laboratory instruments maximize mission science return, but consume electrical power.",
        lesson_ar: "أجهزة المختبر المتقدمة تعزز النتائج العلمية للمهمة لكنها تستهلك طاقة مستمرة."
      }
    ],
    realFact_en: "Commercial resupply flights to the ISS like Cygnus and Cargo Dragon strictly balance fuel, oxygen, and experiment payload mass.",
    realFact_ar: "توازن مركبات الشحن الفضائي (مثل دراجون وسيجنوس) بدقة بين كتل الأكسجين والماء وأجهزة التجارب المحمولة.",
    sourceUrl: "https://www.nasa.gov/mission/commercial-resupply-services/"
  },

  {
    id: "hydroponics-clog",
    site: "both",
    title_en: "Nutrient Injection Line Blockage",
    title_ar: "انسداد أنابيب المحلول المغذي للنباتات",
    story_en: "Salt crystals have formed inside the capillary tubes feeding minerals to the greenhouse root zones.",
    story_ar: "ترسبت بلورات الأملاح داخل الأنابيب الشعرية الدقيقة المغذية لجذور نباتات الصوبة الزراعية.",
    icon: "🌾",
    choices: [
      {
        id: "hot-flush",
        label_en: "High-Pressure Thermal Water Flush (Drains Power Heavily)",
        label_ar: "غسيل حراري بضغط مائي عالٍ (يستهلك طاقة تدفئة كبيرة)",
        effects: { oxygen: 0, power: -18, shield: 0, health: 0, science: 5 },
        delayedEffects: [
          { inTurns: 1, effects: { oxygen: 10 }, reason: "Flushed nutrient lines restore thriving crop growth." }
        ],
        lesson_en: "Thermal flushing clears mineral scale but drains heating power usually reserved for night cycles.",
        lesson_ar: "التنظيف بالماء الساخن يذيب الأملاح لكنه يسحب طاقة التدفئة المخصصة لليل."
      },
      {
        id: "manual-pruning",
        label_en: "Manually Prune Damaged Root Mats (Saves Power, Hard Labor)",
        label_ar: "تقليم جذور النباتات المتضررة يدوياً (يوفر الطاقة، لكنه شاق)",
        effects: { oxygen: -5, power: -4, shield: 0, health: 0, science: 0 },
        delayedEffects: [],
        lesson_en: "Root pruning prevents anaerobic root rot in confined hydroponic chambers.",
        lesson_ar: "تقليم الجذور يحمي النباتات من التعفن في بيئات الزراعة المائية المغلقة."
      },
      {
        id: "dilute-feed",
        label_en: "Dilute Mineral Concentration by 50% (Quick, Low Growth)",
        label_ar: "تخفيف تركيز الأملاح بنسبة 50% (سريع، لكن يبطئ نمو النبات)",
        effects: { oxygen: -6, power: 0, shield: 0, health: 0, science: -5 },
        delayedEffects: [],
        lesson_en: "Nutrient deficiencies slow plant photosynthesis, reducing both food yield and oxygen recycling.",
        lesson_ar: "نقص المعادن يبطئ عملية البناء الضوئي فيقل إنتاج الأكسجين والغذاء الطازج."
      }
    ],
    realFact_en: "NASA's Advanced Plant Habitat (APH) on the space station utilizes over 180 sensors to maintain nutrient flow to roots in zero gravity.",
    realFact_ar: "تحتوي غرفة أبحاث النباتات المتقدمة (APH) في ناسا على أكثر من 180 مستشعراً لضبط تدفق الغذاء نحو الجذور في انعدام الوزن.",
    sourceUrl: "https://www.nasa.gov/mission/station/research-web/advanced-plant-habitat/"
  }
];
