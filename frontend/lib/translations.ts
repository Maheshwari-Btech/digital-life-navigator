export type LanguageCode = "en" | "hi" | "mr";

export interface Translations {
  appName: string;
  tagline: string;
  homeTitle: string;
  homeSubtitle: string;
  choiceDo: string;
  choiceDoSub: string;
  choiceExplain: string;
  choiceExplainSub: string;
  choiceStuck: string;
  choiceStuckSub: string;
  activeTaskBanner: string;
  continueFrom: string;
  continueBtn: string;
  startOverBtn: string;
  catalogTitle: string;
  catalogSubtitle: string;
  stepOf: string;
  whyThisMatters: string;
  doneBtn: string;
  imStuckBtn: string;
  backBtn: string;
  explainBtn: string;
  continueLaterBtn: string;
  stuckModalTitle: string;
  stuckModalSub: string;
  closeBtn: string;
  recoveryTitle: string;
  actionChecklist: string;
  iDidItBtn: string;
  understandMsgTitle: string;
  understandMsgSub: string;
  pastePlaceholder: string;
  analyzeBtn: string;
  analyzingBtn: string;
  whatItMeans: string;
  whatToDoNext: string;
  whatNotToDo: string;
  startTaskForThis: string;
  sampleMessages: string;
  alexaModeBtn: string;
  alexaOrbText: string;
  alexaPlaceholder: string;
  sendBtn: string;
  micListening: string;
  completedTitle: string;
  completedSub: string;
  returnHomeBtn: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: "Digital Life Navigator",
    tagline: "Show me what you're trying to do. I'll help you do it.",
    homeTitle: "How can we help you today?",
    homeSubtitle: "You don't need to be an expert. We will take everything one simple step at a time.",
    choiceDo: "I want to do something",
    choiceDoSub: "Step-by-step guidance to complete an online form or task safely.",
    choiceExplain: "I don't understand this message",
    choiceExplainSub: "Paste an unfamiliar SMS, alert, or notice to get a simple explanation.",
    choiceStuck: "I'm stuck on a task",
    choiceStuckSub: "Get friendly recovery help if you clicked something wrong or feel lost.",
    activeTaskBanner: "Welcome back! You have a saved task in progress.",
    continueFrom: "Continue from Step",
    continueBtn: "Continue",
    startOverBtn: "Start Over",
    catalogTitle: "Choose a digital task to practice",
    catalogSubtitle: "All tasks use 100% safe demo data. No real passwords or money involved.",
    stepOf: "Step",
    whyThisMatters: "Why this matters",
    doneBtn: "Done, Next Step",
    imStuckBtn: "I'm Stuck",
    backBtn: "Back",
    explainBtn: "Explain Again",
    continueLaterBtn: "Continue Later",
    stuckModalTitle: "Where are you stuck?",
    stuckModalSub: "Select what best describes your situation. It's completely okay!",
    closeBtn: "Close",
    recoveryTitle: "Here is your recovery plan",
    actionChecklist: "Things to try right now:",
    iDidItBtn: "I did it, let's continue",
    understandMsgTitle: "Understand an unfamiliar digital message",
    understandMsgSub: "Paste any confusing text you received. We'll explain it in plain language.",
    pastePlaceholder: "Paste your message or notification here (e.g. 'You are requested to verify your document before continuing your application')...",
    analyzeBtn: "Explain this message",
    analyzingBtn: "Analyzing simply...",
    whatItMeans: "What this means",
    whatToDoNext: "What you should do next",
    whatNotToDo: "Important: What NOT to do",
    startTaskForThis: "Help me do this task now",
    sampleMessages: "Or try a sample message:",
    alexaModeBtn: "Simulated Alexa+ Guide",
    alexaOrbText: "Alexa+ Ready. Tap the mic or type to speak.",
    alexaPlaceholder: "Say or type: 'Help me start an application' or 'I'm stuck'...",
    sendBtn: "Send",
    micListening: "Listening...",
    completedTitle: "Congratulations! You did it!",
    completedSub: "You completed every step yourself without any mistakes.",
    returnHomeBtn: "Return to Home",
  },
  hi: {
    appName: "डिजिटल लाइफ नेविगेटर",
    tagline: "मुझे बताएं कि आप क्या करना चाहते हैं। मैं आपकी मदद करूंगा।",
    homeTitle: "आज हम आपकी कैसे मदद कर सकते हैं?",
    homeSubtitle: "तकनीकी विशेषज्ञ होने की आवश्यकता नहीं है। हम हर काम एक-एक आसान कदम में करेंगे।",
    choiceDo: "मैं कुछ ऑनलाइन करना चाहता हूँ",
    choiceDoSub: "ऑनलाइन फॉर्म या प्रक्रिया को सुरक्षित रूप से पूरा करने के लिए कदम-दर-कदम मार्गदर्शन।",
    choiceExplain: "मुझे यह संदेश समझ नहीं आया",
    choiceExplainSub: "कोई भी संदेश या सूचना यहां पेस्ट करें और आसान भाषा में इसका अर्थ जानें।",
    choiceStuck: "मैं कहीं अटक गया हूँ",
    choiceStuckSub: "अगर आपने कुछ गलत क्लिक कर दिया है या समझ नहीं आ रहा, तो तुरंत सहायता प्राप्त करें।",
    activeTaskBanner: "वापसी पर स्वागत है! आपका अधूरा कार्य सुरक्षित रखा गया है।",
    continueFrom: "कदम से जारी रखें",
    continueBtn: "जारी रखें",
    startOverBtn: "शुरू से करें",
    catalogTitle: "अभ्यास के लिए एक कार्य चुनें",
    catalogSubtitle: "सभी कार्य 100% सुरक्षित डेमो डेटा का उपयोग करते हैं। कोई असली पासवर्ड या पैसे शामिल नहीं हैं।",
    stepOf: "कदम",
    whyThisMatters: "यह क्यों महत्वपूर्ण है",
    doneBtn: "हो गया, अगला कदम",
    imStuckBtn: "मैं अटक गया हूँ",
    backBtn: "पीछे जाएं",
    explainBtn: "फिर से समझाएं",
    continueLaterBtn: "बाद में पूरा करें",
    stuckModalTitle: "आप कहाँ अटक गए हैं?",
    stuckModalSub: "अपनी स्थिति चुनें। चिंता की कोई बात नहीं है, हम इसे ठीक कर लेंगे!",
    closeBtn: "बंद करें",
    recoveryTitle: "समाधान और सहायता",
    actionChecklist: "अब यह करके देखें:",
    iDidItBtn: "मैंने कर लिया, आगे बढ़ें",
    understandMsgTitle: "किसी भी डिजिटल संदेश को समझें",
    understandMsgSub: "संदेश पेस्ट करें। हम इसे सरल और स्पष्ट भाषा में समझाएंगे।",
    pastePlaceholder: "संदेश यहाँ पेस्ट करें (जैसे: 'कृपया आगे बढ़ने से पहले अपने दस्तावेज़ की पुष्टि करें')...",
    analyzeBtn: "यह संदेश समझाएं",
    analyzingBtn: "सरल भाषा में विश्लेषण हो रहा है...",
    whatItMeans: "इसका क्या अर्थ है",
    whatToDoNext: "आपको आगे क्या करना चाहिए",
    whatNotToDo: "महत्वपूर्ण: क्या न करें",
    startTaskForThis: "यह कार्य करने में मेरी मदद करें",
    sampleMessages: "या एक नमूना संदेश चुनें:",
    alexaModeBtn: "एलेक्सा+ गाइड",
    alexaOrbText: "एलेक्सा+ तैयार है। बोलें या टाइप करें।",
    alexaPlaceholder: "बोलें या लिखें: 'मेरी मदद करें' या 'मैं अटक गया हूँ'...",
    sendBtn: "भेजें",
    micListening: "सुन रहा हूँ...",
    completedTitle: "बधाई हो! आपने इसे सफलतापूर्वक पूरा कर लिया!",
    completedSub: "आपने हर कदम बिना किसी डर के खुद पूरा किया।",
    returnHomeBtn: "होम पेज पर जाएं",
  },
  mr: {
    appName: "डिजिटल लाइफ नेव्हिगेटर",
    tagline: "तुम्हाला काय करायचे आहे ते मला सांगा. मी तुम्हाला मदत करेन.",
    homeTitle: "आज आम्ही तुम्हाला कशी मदत करू शकतो?",
    homeSubtitle: "तुम्हाला तांत्रिक ज्ञानाची गरज नाही. आपण सर्वकाही सोप्या टप्प्यांत करू.",
    choiceDo: "मला काहीतरी करायचे आहे",
    choiceDoSub: "ऑनलाईन अर्ज किंवा कार्य पूर्ण करण्यासाठी टप्प्याटप्प्याने मार्गदर्शन.",
    choiceExplain: "मला हा संदेश समजला नाही",
    choiceExplainSub: "अनोळखी संदेश येथे पेस्ट करा आणि सोप्या भाषेत अर्थ समजून घ्या.",
    choiceStuck: "मी अडकलो आहे",
    choiceStuckSub: "काही चूक झाली असल्यास घाबरू नका, आम्ही लगेच मदत करू.",
    activeTaskBanner: "पुन्हा स्वागत आहे! आपले कार्य जतन केलेले आहे.",
    continueFrom: "टप्प्यापासून पुढे सुरू करा",
    continueBtn: "पुढे चला",
    startOverBtn: "पुन्हा सुरू करा",
    catalogTitle: "सराव करण्यासाठी एक कार्य निवडा",
    catalogSubtitle: "सर्व कार्ये 100% सुरक्षित डेमो डेटा वापरतात. कोणताही खरा पासवर्ड किंवा पैसे लागत नाहीत.",
    stepOf: "टप्पा",
    whyThisMatters: "हे का महत्त्वाचे आहे",
    doneBtn: "पूर्ण झाले, पुढचा टप्पा",
    imStuckBtn: "मी अडकलो आहे",
    backBtn: "मागे जा",
    explainBtn: "पुन्हा समजावून सांगा",
    continueLaterBtn: "नंतर पूर्ण करा",
    stuckModalTitle: "तुम्ही कुठे अडकला आहात?",
    stuckModalSub: "योग्य पर्याय निवडा. काळजी करू नका, आपण मिळून मार्ग काढू!",
    closeBtn: "बंद करा",
    recoveryTitle: "मदत आणि उपाय",
    actionChecklist: "हे करून पहा:",
    iDidItBtn: "मी केले, पुढे चला",
    understandMsgTitle: "डिजिटल संदेश समजून घ्या",
    understandMsgSub: "कोणताही संदेश येथे पेस्ट करा. आम्ही साध्या भाषेत समजावू.",
    pastePlaceholder: "संदेश येथे पेस्ट करा...",
    analyzeBtn: "हा संदेश समजावून सांगा",
    analyzingBtn: "विश्लेषण करत आहे...",
    whatItMeans: "याचा नेमका अर्थ काय",
    whatToDoNext: "पुढे काय करावे",
    whatNotToDo: "महत्त्वाचे: काय करू नये",
    startTaskForThis: "हे कार्य करण्यासाठी मदत करा",
    sampleMessages: "किंवा नमुना संदेश निवडा:",
    alexaModeBtn: "अलेक्सा+ मार्गदर्शक",
    alexaOrbText: "अलेक्सा+ सज्ज आहे. बोला किंवा टाइप करा.",
    alexaPlaceholder: "बोला किंवा लिहा...",
    sendBtn: "पाठवा",
    micListening: "ऐकत आहे...",
    completedTitle: "अभिनंदन! तुम्ही हे यशस्वीरित्या पूर्ण केले!",
    completedSub: "प्रत्येक टप्पा तुम्ही स्वतः पूर्ण केला आहे.",
    returnHomeBtn: "मुख्य पृष्ठावर जा",
  }
};
