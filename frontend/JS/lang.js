(() => {
  const STORAGE_KEY = "bsk_lang";
  const FALLBACK_LANG = "hi";

  const DICT = {
    hi: {
      navHome: "होम",
      navAbout: "हमारे बारे में",
      navMedia: "मीडिया संसाधन",
      navGallery: "फोटो गैलरी",
      navEvents: "इवेंट",
      navTeam: "हमारी टीम",
      navStateTeam: "राज्य टीम",
      navNationalTeam: "राष्ट्रीय टीम",
      navNews: "समाचार",
      navJoin: "जुड़ें",
      navContact: "संपर्क",
      navDonate: "दान",
      footerJoin: "BSKKMRJ से जुड़ें",
      footerBlurb: "साथ मिलकर हम वह हासिल करते हैं जो अकेला कोई नहीं कर सकता।",
      footerPhoneLabel: "फोन:",
      footerAddressLabel: "पता:",
      footerLinks: "लिंक",
      footerHeadlines: "शीर्ष खबरें",
      footerHeadline1: "यूपी के लोहिया हॉस्पिटल में खाली पड़े हैं बेड, जानें",
      footerHeadline2: "देश के किसी भी श्रमिक के साथ नहीं होगा शोषण",
      footerHeadline3: "सभी मजदूरों का होगा पंजीकरण: सर्वेश पाठक",
      footerTagline: "भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान",
      footerContactLink: "संपर्क करें",
      heroTagline: "भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान",
      heroHeading: "BSKKMRJ",
      heroQuote: "भारतीय श्रमिक संघ: विकास की गाड़ी की एक महत्वपूर्ण धारा!",
      ctaAbout: "About Us",
      ctaJoin: "Join BSKKMRJ",
      ctaDonate: "Make Donation",
      messageHeading: "message",
      messageTitle: "भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान",
      messageBody:
        "भारतीय श्रमिक कामगार कर्मचारी महासंघ की स्थापना से पहले मजदूर संगठन राजनीतिक पार्टियों से सम्बन्धित थे तथा पार्टी के मजदूर संगठन के रूप में कार्य करते थे। प्रारम्भ में अन्य मजदूर संगठनों का विरोध तथा व्यंग्य भारतीय श्रमिक कामगार कर्मचारी महासंघ के कार्यकर्ताओं को सहना पड़ता था, लेकिन भारतीय मजदूर संघ ने केवल राष्ट्रवादी विचारधारा के राजनीतिक श्रमिक संगठन के रूप में अपना कार्य प्रारंभ किया तथा आज भी उसी सिद्धान्त पर कायम है। कोई भी राजनीतिक व्यक्ति जिसकी विचारधारा राष्ट्रवादी हो वह इसका नेता बन सकता यदि इसका पदाधिकारी वह पार्टी जिसकी विचारधारा राष्ट्रवादी हो उस पार्टी से चुनाव लड़ सकता है तथा इसका कोई भी सदस्य राजनीतिक चुनाव जीतकर भी पदाधिकारी रह सकता है भारतीय श्रमिक कामगार कर्मचारी महासंघ ने अन्य श्रमिक संगठनों से हटकर कई नये नारे तथा विचार श्रमिकों के सामने रखे। “भारत माता की जय” के साथ श्रमिक हमारी जान है एकता हमारी शान है का उद्घोष पहली बार कर्मचारियों व श्रमिक आन्दोलन में हुआ। भारतीय मजदूर संघ के कुछ सूत्र इस प्रकार हैं-​",
      messagePoint1: "देश हित में करेंगे काम, काम के लेंगे पूरे दाम।",
      messagePoint2: "हमारे संगठन . की क्या पहचान, त्याग-तपस्या और बलिदान।",
      messagePoint3: "नया जमाना आयेगा, कमाने वाला खिलायेगा।",
      messagePoint4: "राष्ट्र का औद्योगिकीकरण, उद्योगों का श्रमिकीकरण, श्रमिकों का राष्ट्रीयकरण",
      messageFoot: "17 सितम्बर विश्वकर्मा जयन्ती को राष्ट्रीय श्रम दिवस के रूप में मनाना तय किया गया।",
      pill1Name: "सर्वेश पाठक",
      pill1Role: "-राष्ट्रीय महा सचिव",
      pill2Name: "त्रिभुवन धुरिया जी",
      pill2Role: "-POLICY ADVISER",
      goalsHeading: "हमारा लक्ष्य",
      goal1: "संगठन श्रमिकों की सुरक्षा सुनिश्चित करेगा",
      goal2: "संगठन के पदाधिकारी सरकारी योजनाओं से लाभान्वित करेंगे।",
      goal3: "संगठन द्वारा श्रमिकों के सम्बन्धित विभाग द्वारा कम्पनी को निर्देशित कर श्रमिकों को हर सम्भव भदद करने का प्रयत्न करेंगे",
      goal4: "बीमार वृद्ध एवं असहाय श्रमिकों को हर सम्भव मदद के लिए संगठन सहयोग करेगा",
      goal5: "विदेशी श्रमिकों के साथ किसी भी प्रकार का दुर्व्यवहार होने पर संगठन सहयोग करेगा",
      goal6: "असंगठित क्षेत्रों के श्रमिकों के बच्चों की शिक्षा एवं स्वास्थ्य हेतु संगठन कार्य करेगा।",
      goal7: "श्रमिकों के लिए विशेष मेडिकल कैम्प का आयोजन श्रमिकों के लिए किया जायगा",
      goal8: "श्रमिकों के स्वरोजगार के लिए संगठन प्रयत्न करेगा।",
      goal9: "असहाय श्रमिकों की बेटियों के विवाह हेतु संगठन द्वारा अनुदान की कोशिश करी जायगी।",
      goal10: "संगठनद्वारा श्रमिकों के मेधावी छात्र छात्राओं को प्रोतसाहन देना",
      manifestoTitle: "चुनाव संकल्प",
      manifestoSubtitle: "चुनाव घोषणापत्र 2024",
      manifestoCta: "डाउनलोड करें",
      donateTitle: "दान",
      donateSubtitle: "आज ही सहयोग करें",
      donateBlurb: "नए भारत के निर्माण में अपना योगदान दें।",
      donateCta: "दान करें",
      newsHeading: "Latest News & Press",
      news1Title: "पर्यावरण और जलवायु संरक्षण को नया नेतृत्व – सर्वेश पाठक बने वाइस चेयरमैन",
      news2Title: "श्रीलंका के पूर्व राष्ट्रपति & प्रधानमंत्री के सपुत्र नमल राजपक्षे राष्ट्रीय महासचिव से मिलने पहुंचे लखनऊ",
      news2Body: "भारतीय जनता पार्टी अनुषंगिक संगठन के राष्ट्रीय महासचिव सर्वेश पाठक के निजी आवास लखनऊ स्थित गोमती नगर आवास पर…",
      news3Title: "कार्यकर्ता का सम्मान सर्वोपरि: सर्वेश पाठक",
      news3Body: "भारतीय जनता पार्टी की आनुषंगिक संगठन के केन्द्रीय कार्यालय पर राष्ट्रीय कार्य समिति की बैठक की शुरुआत करते हुए…",
      newsAll: "View all news",
      pageAboutTitle: "हमारे बारे में",
      pageAboutHeading: "परिचय",
      pageAboutSub: "और जानें",
      crumbAbout: "About / Home / About",
      pageNewsTitle: "समाचार",
      crumbContact: "Contact / Home / Contact",
      pageContactTitle: "संपर्क करें",
      pageContactHeading: "हमसे संपर्क करें",
      pageContactSub: "और जानकारी लें",
      crumbEvents: "Event / Home / Contact",
      pageEventsTitle: "हमारे आयोजन",
      pageEventsHeading: "आयोजन",
      crumbGallery: "Gallery / Home / Contact",
      pageGalleryTitle: "हमारी गैलरी",
      crumbJoin: "Join Us / Home / Contact",
      pageJoinTitle: "हमसे जुड़ें",
      pageJoinHeading: "सदस्य पंजीकरण",
      crumbDonate: "Donate / Home / Contact",
      pageDonateTitle: "दान",
      pageDonateHeading: "अब दान करें",
      pageDonateThanks: "सहयोग के लिए धन्यवाद!",
      pageDonateBlurb: "साथ मिलकर हम वह हासिल करते हैं जो अकेला कोई नहीं कर सकता।",
      crumbNationalTeam: "National Team / Home / Contact",
      pageNationalTeamTitle: "राष्ट्रीय टीम",
      crumbStateTeam: "State Team / Home / Contact",
      pageStateTeamTitle: "राज्य टीम",
    },
    en: {
      navHome: "Home",
      navAbout: "About Us",
      navMedia: "Media Resources",
      navGallery: "Photo Gallery",
      navEvents: "Events",
      navTeam: "Our Team",
      navStateTeam: "State Team",
      navNationalTeam: "National Team",
      navNews: "News",
      navJoin: "Join Us",
      navContact: "Contact",
      navDonate: "Donate",
      footerJoin: "Join BSKKMRJ",
      footerBlurb: "Together we achieve more than any single person could alone.",
      footerPhoneLabel: "Phone:",
      footerAddressLabel: "Address:",
      footerLinks: "Links",
      footerHeadlines: "Headlines",
      footerHeadline1: "Empty beds available in Lohia Hospital, UP",
      footerHeadline2: "No worker will face exploitation in the country",
      footerHeadline3: "All workers to be registered: Sarvesh Pathak",
      footerTagline: "Bharatiya Shramik Kamgar Karamchari Mahasangh Rajasthan",
      footerContactLink: "Get in touch",
      heroTagline: "Bharatiya Shramik Kamgar Karmachari Mahasangh Rajasthan",
      heroHeading: "BSKKMRJ",
      heroQuote: "\"Indian Workers Union: a vital engine for progress\"",
      ctaAbout: "About Us",
      ctaJoin: "Join BSKKMRJ",
      ctaDonate: "Make a Donation",
      messageHeading: "Message",
      messageTitle: "About the Union",
      messageBody:
        "Before BSKKMRJ existed, most labour unions were tied to political parties. We began as a nationalist, worker-first movement and remain on that path today. Any nationalist-minded leader can serve. We introduced slogans that centred dignity and unity of workers. Highlights:",
      messagePoint1: "Work for the nation, earn fair wages.",
      messagePoint2: "Identity of our union: sacrifice, discipline, contribution.",
      messagePoint3: "A new era will feed its earners.",
      messagePoint4: "Industrialisation of the nation, worker-first industries, national focus on labour.",
      messageFoot: "17 September (Vishwakarma Jayanti) is observed as National Labour Day.",
      pill1Name: "Sarvesh Pathak",
      pill1Role: "- National General Secretary",
      pill2Name: "Tribhuvan Dhuriya",
      pill2Role: "- Policy Adviser",
      goalsHeading: "Our Goals",
      goal1: "Ensure safety and protection for workers.",
      goal2: "Help members benefit from government schemes.",
      goal3: "Press companies through departments to support workers.",
      goal4: "Assist elderly and vulnerable workers.",
      goal5: "Support migrant workers facing mistreatment.",
      goal6: "Work on education and health for children of unorganised workers.",
      goal7: "Organise special medical camps for workers.",
      goal8: "Promote self-employment for workers.",
      goal9: "Provide aid for daughters' weddings of needy workers.",
      goal10: "Reward meritorious students from worker families.",
      manifestoTitle: "Election Commitments",
      manifestoSubtitle: "Election Manifesto 2024",
      manifestoCta: "Download Now",
      donateTitle: "Donate",
      donateSubtitle: "Support today!",
      donateBlurb: "Contribute toward building a new India.",
      donateCta: "Donate Now",
      newsHeading: "Latest News & Press",
      news1Title: "New leadership for environment and climate protection – Sarvesh Pathak becomes Vice Chairman",
      news2Title: "Sri Lanka ex-President & PM’s son Namal Rajapaksa meets National General Secretary in Lucknow",
      news2Body: "At the Lucknow residence of National General Secretary Sarvesh Pathak…",
      news3Title: "Respecting karyakartas is paramount: Sarvesh Pathak",
      news3Body: "Opening remarks at the national working committee meeting of the allied organisation…",
      newsAll: "View all news",
      pageAboutTitle: "About Us",
      pageAboutHeading: "About",
      pageAboutSub: "Know more",
      crumbAbout: "About / Home / About",
      pageNewsTitle: "News",
      crumbContact: "Contact / Home / Contact",
      pageContactTitle: "Contact Us",
      pageContactHeading: "Get In Touch With Us",
      pageContactSub: "Learn more",
      crumbEvents: "Event / Home / Contact",
      pageEventsTitle: "Our Event",
      pageEventsHeading: "Events",
      crumbGallery: "Gallery / Home / Contact",
      pageGalleryTitle: "Our Gallery",
      crumbJoin: "Join Us / Home / Contact",
      pageJoinTitle: "Join Us",
      pageJoinHeading: "Member Registration",
      crumbDonate: "Donate / Home / Contact",
      pageDonateTitle: "Donate",
      pageDonateHeading: "Donate now",
      pageDonateThanks: "Thank you for supporting!",
      pageDonateBlurb: "Together we achieve more than any single person could alone.",
      crumbNationalTeam: "National Team / Home / Contact",
      pageNationalTeamTitle: "National Team",
      crumbStateTeam: "State Team / Home / Contact",
      pageStateTeamTitle: "State Team",
    },
  };

  let currentLang = FALLBACK_LANG;

  function setHtmlLang(lang) {
    document.documentElement.setAttribute("lang", lang);
  }

  function applyLanguage(lang) {
    const dict = DICT[lang] || DICT[FALLBACK_LANG];
    currentLang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
    setHtmlLang(lang);
    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.textContent = lang === "hi" ? "English" : "हिन्दी";
      toggle.setAttribute("aria-label", lang === "hi" ? "Switch to English" : "Switch to Hindi");
    }
  }

  function init() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = saved || FALLBACK_LANG;
    applyLanguage(initial);

    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("lang") || initial;
        const next = current === "hi" ? "en" : "hi";
        window.localStorage.setItem(STORAGE_KEY, next);
        applyLanguage(next);
      });
    }

    // Expose helpers for late-loaded fragments (navbar/footer)
    window.BSK_LANG = {
      applyCurrent: () => applyLanguage(currentLang),
      getCurrent: () => currentLang,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
