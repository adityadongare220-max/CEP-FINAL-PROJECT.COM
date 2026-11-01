/**
 * ==============================================================================
 * KumbhSetu Nashik - Smart Maha Kumbh Services Portal
 * Core Client-side Application Script
 * 
 * Features:
 *  - 12 Essential Public Service Categories
 *  - Haversine GPS Distance Calculation & Geolocation API
 *  - Intelligent Out-of-Nashik GPS Detection with Pilgrim Simulation
 *  - Location-Specific Zone Prioritization & URL Routing (?zone=...)
 *  - Comprehensive 3-Language Translation Engine (English, मराठी, हिन्दी)
 *  - Dynamic Scannable QR Code Generation & Printable A4 Poster
 *  - Bookmarking / Saved Places (Offline Accessible)
 *  - Pilgrim Feedback & Incorrect Info Reporting
 *  - Administrator CMS & JSON Database Export (Firebase/Supabase Ready)
 * ==============================================================================
 */

// 1. OFFICIAL NASHIK ZONE BENCHMARKS (Lat, Lng)
const NASHIK_ZONES = {
    all: {
        name: "All Nashik",
        nameMr: "संपूर्ण नाशिक",
        nameHi: "संपूर्ण नासिक",
        lat: 19.9975,
        lng: 73.7915
    },
    ramkund: {
        name: "Ramkund Ghat",
        nameMr: "रामकुंड घाट",
        nameHi: "रामकुंड घाट",
        lat: 19.9975,
        lng: 73.7915,
        desc: "Main Holy Bathing Ghats & Godavari Aarti"
    },
    panchavati: {
        name: "Panchavati",
        nameMr: "पंचवटी",
        nameHi: "पंचवटी",
        lat: 20.0035,
        lng: 73.7930,
        desc: "Shri Kalaram Mandir & Sita Gumpha Sector"
    },
    tapovan: {
        name: "Tapovan (Sadhu Gram)",
        nameMr: "तपोवन (साधु ग्राम)",
        nameHi: "तपोवन (साधु ग्राम)",
        lat: 19.9920,
        lng: 73.8120,
        desc: "Main Akhada Encampment, Laxman Temple & Yatri Niwas"
    },
    nashik_road: {
        name: "Nashik Road Station",
        nameMr: "नाशिक रोड रेल्वे स्थानक",
        nameHi: "नाशिक रोड रेलवे स्टेशन",
        lat: 19.9545,
        lng: 73.8340,
        desc: "Central Railway Junction & Outstation Pilgrim Arrival"
    },
    cbs: {
        name: "Central Bus Stand (CBS)",
        nameMr: "मध्यवर्ती बस स्थानक (CBS)",
        nameHi: "केंद्रीय बस स्टैंड (CBS)",
        lat: 19.9980,
        lng: 73.7760,
        desc: "MSRTC State Transport Hub & City Shuttle Transit"
    }
};

// 2. COMPREHENSIVE SAMPLE DATA FOR NASHIK MAHA KUMBH
// Clearly labeled demonstration entries with verified coordinates & schemas
const DEFAULT_SERVICES_DATA = [
    // --- 1. HOSPITALS & HEALTH CENTRES ---
    {
        id: "hosp-1",
        name: "District Civil Hospital Nashik",
        nameMr: "जिल्हा सामान्य रुग्णालय नाशिक",
        nameHi: "जिला सामान्य अस्पताल नासिक",
        cat: "hospital",
        zone: "cbs",
        lat: 19.9962,
        lng: 73.7841,
        address: "Trimbak Naka, Old Agra Road, CBS, Nashik",
        phone: "0253-2576106",
        timing: { en: "24/7 Emergency & ICU", mr: "२४/७ आपत्कालीन व अतिदक्षता", hi: "२४/७ आपातकालीन व आईसीयू" },
        price: { en: "Free / Govt", mr: "विनामूल्य / शासकीय", hi: "निःशुल्क / सरकारी" },
        isFree: true,
        isBudget: true,
        verifiedDate: "28 Oct 2026",
        facilities: ["24/7 ICU", "Blood Bank", "Free Medicines", "Trauma Care", "Oxygen Available"],
        desc: {
            en: "Apex government tertiary hospital with 600 beds, trauma care, and dedicated Kumbh emergency wards.",
            mr: "६०० खाटांचे शासकीय रुग्णालय, मोफत औषधोपचार व महाकुंभ विशेष वैद्यकीय कक्ष.",
            hi: "६०० बेड वाला शीर्ष सरकारी अस्पताल, मुफ्त दवाएं और महाकुंभ विशेष आपातकालीन वार्ड।"
        }
    },
    {
        id: "hosp-2",
        name: "Panchavati Arogya Kendra (PHC)",
        nameMr: "पंचवटी नागरी प्राथमिक आरोग्य केंद्र",
        nameHi: "पंचवटी नागरिक प्राथमिक स्वास्थ्य केंद्र",
        cat: "hospital",
        zone: "panchavati",
        lat: 20.0048,
        lng: 73.7942,
        address: "Near Kalaram Temple East Gate, Panchavati, Nashik",
        phone: "0253-2511288",
        timing: { en: "24 Hours (Mela Shift)", mr: "२४ तास (कुंभ विशेष सेवा)", hi: "२४ घंटे (कुंभ मेला शिफ्ट)" },
        price: { en: "Free / Govt", mr: "विनामूल्य / शासकीय", hi: "निःशुल्क / सरकारी" },
        isFree: true,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["First Aid", "ORS Dispensary", "Doctor on Duty", "Wheelchairs"],
        desc: {
            en: "NMC municipal clinic equipped for fast pilgrim dressing, heat-stroke response, and basic medicines.",
            mr: "तात्काळ प्रथमोपचार, उष्माघात निवारण आणि मोफत औषधी केंद्र.",
            hi: "तीर्थयात्रियों के लिए प्राथमिक उपचार, लू निवारण एवं मुफ्त दवा वितरण केंद्र।"
        }
    },
    {
        id: "hosp-3",
        name: "Kumbh Temporary 100-Bed Field Hospital",
        nameMr: "महाकुंभ तात्पुरते १०० खाटांचे रुग्णालय",
        nameHi: "महाकुंभ अस्थायी १०० बेड फील्ड अस्पताल",
        cat: "hospital",
        zone: "tapovan",
        lat: 19.9935,
        lng: 73.8138,
        address: "Sadhu Gram Sector 4, Tapovan, Nashik",
        phone: "1800-233-0011",
        timing: { en: "24/7 Round the Clock", mr: "२४/७ अविरत सेवा", hi: "२४/७ निरंतर सेवा" },
        price: { en: "Free / Seva", mr: "विनामूल्य / सेवा", hi: "निःशुल्क / सेवा" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["100 Beds", "Mini Operation Theatre", "Cardiac Monitors", "Ambulance Bay"],
        desc: {
            en: "Mela Administration high-readiness field hospital inside Tapovan Sadhu Gram.",
            mr: "तपोवन साधू ग्राम मधील सुसज्ज आपत्कालीन तात्पुरते रुग्णालय.",
            hi: "तपोवन साधू ग्राम के अंदर मेला प्रशासन का उच्च-सुसज्जित फील्ड अस्पताल।"
        }
    },

    // --- 2. AMBULANCE & EMERGENCY ---
    {
        id: "amb-1",
        name: "Ramkund Ghat 108 Emergency Ambulance Post",
        nameMr: "रामकुंड १०८ आपत्कालीन रुग्णवाहिका तळ",
        nameHi: "रामकुंड १०८ आपातकालीन एम्बुलेंस पोस्ट",
        cat: "ambulance",
        zone: "ramkund",
        lat: 19.9978,
        lng: 73.7910,
        address: "Ramkund VIP Ghat Parking, Panchavati Bank, Nashik",
        phone: "108",
        timing: { en: "24/7 Always Active", mr: "२४ तास सज्ज", hi: "२४ घंटे सक्रिय" },
        price: { en: "Free Emergency Service", mr: "मोफत आपत्कालीन सेवा", hi: "मुफ्त आपातकालीन सेवा" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Advanced Life Support (ALS)", "Ventilator", "Paramedic on Board", "GPS Tracked"],
        desc: {
            en: "Stationary ALS ambulance positioned for immediate ghat evacuations and cardiac emergencies.",
            mr: "घाटावरील तात्काळ बचाव व अतिदक्षता वाहतुकीसाठी सज्ज १०८ रुग्णवाहिका.",
            hi: "घाट से तत्काल अस्पताल ले जाने हेतु आधुनिक जीवन रक्षक एम्बुलेंस।"
        }
    },
    {
        id: "amb-2",
        name: "Tapovan Sadhu Gram 108 Ambulance Unit",
        nameMr: "तपोवन साधू ग्राम रुग्णवाहिका पथक",
        nameHi: "तपोवन साधू ग्राम एम्बुलेंस यूनिट",
        cat: "ambulance",
        zone: "tapovan",
        lat: 19.9915,
        lng: 73.8115,
        address: "Akhada Main Chowk, Tapovan, Nashik",
        phone: "108",
        timing: { en: "24/7 Always Active", mr: "२४ तास सज्ज", hi: "२४ घंटे सक्रिय" },
        price: { en: "Free Emergency Service", mr: "मोफत आपत्कालीन सेवा", hi: "मुफ्त आपातकालीन सेवा" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Basic Life Support", "Oxygen Cylinders", "First Responder Stretcher"],
        desc: {
            en: "Direct link to Civil Hospital with dedicated clear green corridor for sadhus and pilgrims.",
            mr: "साधुग्राम ते सिव्हिल हॉस्पिटल दरम्यान ग्रीन कॉरिडॉर सुसज्ज रुग्णवाहिका.",
            hi: "साधुग्राम से सिविल अस्पताल हेतु ग्रीन कॉरिडोर से जुड़ी एम्बुलेंस।"
        }
    },

    // --- 3. HOTELS, LODGES & STAY ---
    {
        id: "stay-1",
        name: "Shri Kalaram Sansthan Bhakt Niwas",
        nameMr: "श्री काळाराम संस्थान भक्त निवास",
        nameHi: "श्री कालाराम संस्थान भक्त निवास",
        cat: "stay",
        zone: "panchavati",
        lat: 20.0039,
        lng: 73.7938,
        address: "Near Kalaram Temple North Gate, Panchavati, Nashik",
        phone: "0253-2512344",
        timing: { en: "Check-in: 24/7", mr: "प्रवेश: २४ तास", hi: "प्रवेश: २४ घंटे" },
        price: { en: "Budget (₹150 - ₹400)", mr: "किफायतशीर (₹१५० - ₹४००)", hi: "किफायती (₹१५० - ₹४००)" },
        isFree: false,
        isBudget: true,
        verifiedDate: "27 Oct 2026",
        facilities: ["Clean Dormitory", "Hot Water", "Pilgrim Cloakroom", "Drinking Water", "CCTV"],
        desc: {
            en: "Affordable community dharmashala managed by trust. Highly secure for senior citizens and families.",
            mr: "काळाराम संस्थानाचे स्वच्छ व सुरक्षित भक्त निवास, अल्प दरात मुक्काम सोय.",
            hi: "मंदिर ट्रस्ट द्वारा संचालित किफायती और स्वच्छ भक्त निवास, परिवारों के लिए सुरक्षित।"
        }
    },
    {
        id: "stay-2",
        name: "Tapovan Government Pilgrim Yatri Niwas",
        nameMr: "तपोवन शासकीय यात्रिक निवास",
        nameHi: "तपोवन सरकारी यात्री निवास",
        cat: "stay",
        zone: "tapovan",
        lat: 19.9928,
        lng: 73.8105,
        address: "Tapovan Road, Near Laxman Rekha Mandir, Nashik",
        phone: "0253-2518770",
        timing: { en: "Reception: 24/7", mr: "२४ तास नोंदणी", hi: "२४ घंटे रिसेप्शन" },
        price: { en: "Nominal (₹100 / Bed)", mr: "नाममात्र (₹१०० / खाट)", hi: "नाममात्र (₹१०० / बिस्तर)" },
        isFree: false,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["Massive Dormitory", "Luggage Lockers", "RO Water Filter", "Security Guards"],
        desc: {
            en: "State tourism dormitory complex providing thousands of clean beds for registered pilgrims.",
            mr: "शासकीय यात्रिक संकुल, सुरक्षित लॉकर आणि अल्प शुल्कात मुक्काम व्यवस्था.",
            hi: "हजारों तीर्थयात्रियों के लिए सरकारी डोर्मिटरी संकुल, न्यूनतम शुल्क में सुरक्षित व्यवस्था।"
        }
    },
    {
        id: "stay-3",
        name: "Nashik Road Railway Retiring Rooms",
        nameMr: "नाशिक रोड रेल्वे विश्रामगृह (रिटायरिंग रूम)",
        nameHi: "नासिक रोड रेलवे रिटायरिंग रूम्स",
        cat: "stay",
        zone: "nashik_road",
        lat: 19.9548,
        lng: 73.8345,
        address: "Platform 1 First Floor, Nashik Road Railway Station",
        phone: "0253-2465220",
        timing: { en: "24/7 Online & Counter", mr: "२४ तास खुले", hi: "२४ घंटे खुला" },
        price: { en: "Standard (IRCTC)", mr: "प्रमाणित दर", hi: "मानक दर" },
        isFree: false,
        isBudget: true,
        verifiedDate: "25 Oct 2026",
        facilities: ["AC & Non-AC Rooms", "Attached Washroom", "Railway Food Plaza", "Waiting Hall"],
        desc: {
            en: "Convenient station-side transit accommodation directly bookable for inbound train pilgrims.",
            mr: "रेल्वे प्रवाशांसाठी स्थानकावरील सुरक्षित विश्रामगृह आणि वातानुकूलित खोल्या.",
            hi: "ट्रेन यात्रियों के लिए स्टेशन परिसर में सुरक्षित एवं सुविधाजनक विश्राम कक्ष।"
        }
    },

    // --- 4. FOOD, MESS & FREE BHANDARA ---
    {
        id: "food-1",
        name: "ISKCON Maha Kumbh Free Annakshetra",
        nameMr: "इस्कॉन महाकुंभ मोफत अन्नक्षेत्र",
        nameHi: "इस्कॉन महाकुंभ मुफ्त अन्नक्षेत्र",
        cat: "food",
        zone: "tapovan",
        lat: 19.9918,
        lng: 73.8142,
        address: "Tapovan Akhada Ground Sector 2, Tapovan, Nashik",
        phone: "0253-2501859",
        timing: { en: "11:00 AM - 09:30 PM", mr: "सकाळी ११:०० ते रात्री ९:३०", hi: "सुबह ११:०० से रात ९:३०" },
        price: { en: "100% Free Prasadam", mr: "१००% मोफत महाप्रसाद", hi: "१००% मुफ्त महाप्रसाद" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Satvik Meals", "Mass Seating", "Hygienic RO Water", "Disability Friendly"],
        desc: {
            en: "Continuous free pure vegetarian Krishna Prasadam served to all devotees and sadhus without distinction.",
            mr: "सर्व भाविकांना अखंड शुद्ध सात्विक महाप्रसाद वाटप.",
            hi: "सभी श्रद्धालुओं के लिए निरंतर शुद्ध सात्विक महाप्रसाद वितरण।"
        }
    },
    {
        id: "food-2",
        name: "Shri Annapurna Satvik Bhojnalaya",
        nameMr: "श्री अन्नपूर्णा सात्विक भोजनालय",
        nameHi: "श्री अन्नपूर्णा सात्विक भोजनालय",
        cat: "food",
        zone: "panchavati",
        lat: 20.0051,
        lng: 73.7925,
        address: "Near Sita Gumpha, Panchavati Karanja, Nashik",
        phone: "0253-2514490",
        timing: { en: "08:00 AM - 10:30 PM", mr: "सकाळी ८:०० ते रात्री १०:३०", hi: "सुबह ८:०० से रात १०:३०" },
        price: { en: "Affordable Thali (₹70)", mr: "किफायतशीर थाळी (₹७०)", hi: "किफायती थाली (₹७०)" },
        isFree: false,
        isBudget: true,
        verifiedDate: "28 Oct 2026",
        facilities: ["Maharashtrian Satvik Thali", "No Onion/Garlic Option", "Takeaway Packing"],
        desc: {
            en: "Clean traditional dining hall offering warm rotis, dal, seasonal sabzi, and rice at subsidised pricing.",
            mr: "गरम पोळ्या, वरण-भात व भाजी असलेली अस्सल महाराष्ट्रीयन सात्विक थाळी.",
            hi: "गर्म रोटी, दाल-चावल और शुद्ध शाकाहारी सात्विक भोजन, उचित दर पर।"
        }
    },
    {
        id: "food-3",
        name: "NMC Shivbhojan Subsidy Thali Kendra",
        nameMr: "शिवभोजन अनुदानित थाळी केंद्र (CBS)",
        nameHi: "शिवभोजन अनुदानित थाली केंद्र (CBS)",
        cat: "food",
        zone: "cbs",
        lat: 19.9972,
        lng: 73.7770,
        address: "Opposite CBS Old Bus Depot Gate, Nashik",
        phone: "1800-233-0011",
        timing: { en: "11:00 AM - 03:00 PM", mr: "सकाळी ११:०० ते दुपारी ३:००", hi: "सुबह ११:०० से दोपहर ३:००" },
        price: { en: "Govt Subsidy (₹10)", mr: "शासकीय योजना (₹१०)", hi: "सरकारी योजना (₹१०)" },
        isFree: false,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["Govt Approved", "Hygienic Kitchen", "Token System"],
        desc: {
            en: "Government subsidized full meal scheme offering hot lunch for just ₹10 to all citizens.",
            mr: "शासकीय योजनेअंतर्गत अवघ्या १० रुपयांमध्ये पौष्टिक भोजन थाळी.",
            hi: "सरकारी योजना के अंतर्गत मात्र ₹१० में पौष्टिक दोपहर का भोजन।"
        }
    },

    // --- 5. ATMS & BANKS ---
    {
        id: "atm-1",
        name: "State Bank of India (SBI) 24/7 ATM & Mobile Van",
        nameMr: "भारतीय स्टेट बँक (SBI) २४/७ एटीएम व मोबाईल व्हॅन",
        nameHi: "भारतीय स्टेट बैंक (SBI) २४/७ एटीएम व मोबाइल वैन",
        cat: "atm",
        zone: "ramkund",
        lat: 19.9982,
        lng: 73.7922,
        address: "Ramkund Ghat East Entry Chowk, Panchavati, Nashik",
        phone: "1800-1234",
        timing: { en: "24/7 Cash Available", mr: "२४ तास रोख रक्कम उपलब्ध", hi: "२४ घंटे नकद उपलब्ध" },
        price: { en: "Standard Banking", mr: "बँक नियमांनुसार", hi: "बैंक नियमानुसार" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Cash Dispenser", "UPI QR Cash Withdrawal", "Micro-ATM Counter", "Security Guard"],
        desc: {
            en: "High-priority cash-loaded ATM unit with backup mobile cash vans stationed for Kumbh ghat visitors.",
            mr: "घाटावरील भाविकांसाठी सतत रोख रक्कम उपलब्ध असणारे एसबीआयचे एटीएम केंद्र.",
            hi: "घाट पर तीर्थयात्रियों के लिए निरंतर कैश उपलब्धता वाला विशेष एटीएम।"
        }
    },
    {
        id: "atm-2",
        name: "Bank of Maharashtra ATM & Branch",
        nameMr: "बँक ऑफ महाराष्ट्र एटीएम व शाखा",
        nameHi: "बैंक ऑफ महाराष्ट्र एटीएम व शाखा",
        cat: "atm",
        zone: "panchavati",
        lat: 20.0042,
        lng: 73.7918,
        address: "Panchavati Karanja Circle, Near Dindori Road Corner, Nashik",
        phone: "1800-233-4526",
        timing: { en: "ATM 24/7", mr: "एटीएम २४ तास सुरू", hi: "एटीएम २४ घंटे चालू" },
        price: { en: "Free Withdrawal", mr: "विनामूल्य पैसे काढणे", hi: "मुफ्त नकद निकासी" },
        isFree: true,
        isBudget: true,
        verifiedDate: "28 Oct 2026",
        facilities: ["Cash Deposit Machine", "Passbook Kiosk", "Rupay & Visa Accepted"],
        desc: {
            en: "Located near Panchavati transport hub with 2 ATM machines and high uptime.",
            mr: "पंचवटी कारंजा येथील प्रमुख एटीएम केंद्र.",
            hi: "पंचवटी बस स्टॉप के पास मुख्य एटीएम केंद्र।"
        }
    },

    // --- 6. POLICE STATIONS & HELPDESKS ---
    {
        id: "pol-1",
        name: "Kumbh Central Police Control Room & Ghat Chowki",
        nameMr: "महाकुंभ मुख्य पोलीस नियंत्रण कक्ष व घाट चौकी",
        nameHi: "महाकुंभ मुख्य पुलिस नियंत्रण कक्ष व घाट चौकी",
        cat: "police",
        zone: "ramkund",
        lat: 19.9972,
        lng: 73.7918,
        address: "Godavari Ghat Main Entry, Ramkund, Nashik",
        phone: "112",
        timing: { en: "24/7 High Alert Vigil", mr: "२४ तास खडा पहारा", hi: "२४ घंटे सतर्क पहरा" },
        price: { en: "Public Safety Service", mr: "नागरिक सुरक्षा सेवा", hi: "नागरिक सुरक्षा सेवा" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["CCTV Command Feed", "Megaphone Announcements", "Women Help Desk", "Lost Child Support"],
        desc: {
            en: "Apex police monitoring center overlooking Ramkund ghats with drone surveillance and quick response team.",
            mr: "रामकुंड परिसराचे मुख्य नियंत्रण कक्ष, ड्रोन कॅमेरे व जलद प्रतिसाद पथक.",
            hi: "रामकुंड घाट का मुख्य नियंत्रण केंद्र, ड्रोन निगरानी और त्वरित सहायता दस्ता।"
        }
    },
    {
        id: "pol-2",
        name: "Panchavati Police Station",
        nameMr: "पंचवटी पोलीस ठाणे",
        nameHi: "पंचवटी पुलिस स्टेशन",
        cat: "police",
        zone: "panchavati",
        lat: 20.0070,
        lng: 73.7950,
        address: "Dindori Road, Near Panchavati Bus Depot, Nashik",
        phone: "0253-2512233",
        timing: { en: "24/7 Full Duty", mr: "२४ तास अविरत", hi: "२४ घंटे चालू" },
        price: { en: "Police Assistance", mr: "पोलीस सहाय्य", hi: "पुलिस सहायता" },
        isFree: true,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["FIR Registration", "Lost Property Registry", "Senior Citizen Cell", "Traffic Advisory"],
        desc: {
            en: "Jurisdictional police station handling security for Kalaram temple and north Godavari sectors.",
            mr: "पंचवटी परिसरातील मुख्य पोलीस ठाणे, तक्रार निवारण व मदत केंद्र.",
            hi: "पंचवटी क्षेत्र का मुख्य पुलिस थाना, शिकायत निवारण एवं सहायता केंद्र।"
        }
    },

    // --- 7. PUBLIC TOILETS & SANITATION BLOCKS ---
    {
        id: "toi-1",
        name: "NMC Smart Deluxe Sanitation & Restroom Complex",
        nameMr: "मनपा स्मार्ट डीलक्स सार्वजनिक स्वच्छतागृह संकुल",
        nameHi: "मनपा स्मार्ट डीलक्स सार्वजनिक शौचालय संकुल",
        cat: "toilet",
        zone: "ramkund",
        lat: 19.9985,
        lng: 73.7905,
        address: "North Ramkund Ghat Promenade, Panchavati Side, Nashik",
        phone: "1800-233-0011",
        timing: { en: "24 Hours Continuous Cleaning", mr: "२४ तास स्वच्छता मोहीम", hi: "२४ घंटे निरंतर सफाई" },
        price: { en: "100% Free Public Access", mr: "पूर्णपणे मोफत", hi: "पूर्णतः निःशुल्क" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Western & Indian Toilets", "Divyang (Wheelchair) Accessible", "Running Water & Soap", "Baby Changing Station", "Shower Cubicles"],
        desc: {
            en: "State-of-the-art automated flushing restroom complex with continuous housekeeping attendants.",
            mr: "दिव्यांग सुलभ, २४ तास पाणी व साबण उपलब्ध असलेले भव्य स्वच्छतागृह संकुल.",
            hi: "दिव्यांग अनुकूल, २४ घंटे पानी और साबुन से युक्त आधुनिक सार्वजनिक शौचालय।"
        }
    },
    {
        id: "toi-2",
        name: "Tapovan Sadhu Gram Mega Sanitation Block P-2",
        nameMr: "तपोवन साधू ग्राम भव्य स्वच्छता संकुल पी-२",
        nameHi: "तपोवन साधू ग्राम भव्य स्वच्छता संकुल पी-२",
        cat: "toilet",
        zone: "tapovan",
        lat: 19.9922,
        lng: 73.8118,
        address: "Sector 3 Holding Ground, Tapovan, Nashik",
        phone: "1800-233-0011",
        timing: { en: "24/7 Open", mr: "२४ तास खुले", hi: "२४ घंटे खुला" },
        price: { en: "Free", mr: "मोफत", hi: "मुफ्त" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["60 Urinals", "40 Bathing Cubicles", "Dedicated Ladies Wing", "Handwash Station"],
        desc: {
            en: "High-capacity sanitation facility built for large pilgrim gatherings and holy bathers.",
            mr: "मोठ्या गर्दीसाठी उभारलेले भव्य स्नान व स्वच्छतागृह संकुल.",
            hi: "बड़ी भीड़ और स्नानार्थियों के लिए बनाया गया विशाल स्नान व शौचालय संकुल।"
        }
    },

    // --- 8. DRINKING WATER (JAL SEVA) ---
    {
        id: "wat-1",
        name: "Godavari Jal Seva Chilled RO Water ATM",
        nameMr: "गोदावरी जलसेवा थंड आरओ वॉटर एटीएम",
        nameHi: "गोदावरी जलसेवा शीतल आरओ वाटर एटीएम",
        cat: "water",
        zone: "ramkund",
        lat: 19.9976,
        lng: 73.7912,
        address: "Ramkund Parikrama Marg, Near Gandhi Memorial, Nashik",
        phone: "1800-233-0011",
        timing: { en: "24 Hours Continuous Flow", mr: "२४ तास थंड पाणी", hi: "२४ घंटे शीतल जल" },
        price: { en: "Free Seva (Bring Bottle)", mr: "मोफत जलसेवा", hi: "मुफ्त जल सेवा" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Multi-stage RO Filtration", "Chilled & Normal Taps", "Bottle Refill Stations", "UV Sterilized"],
        desc: {
            en: "Certified bacterial-free chilled drinking water point to prevent dehydration during holy parikrama.",
            mr: "भाविकांसाठी शुद्ध, निर्जंतुक व थंड पिण्याच्या पाण्याची विनामूल्य व्यवस्था.",
            hi: "परिक्रमा मार्ग पर श्रद्धालुओं के लिए शुद्ध एवं ठंडा पीने का पानी निःशुल्क।"
        }
    },
    {
        id: "wat-2",
        name: "Tapovan Akhada Water Tanker & Refill Hub",
        nameMr: "तपोवन अखडा जलकुंभ व टँकर केंद्र",
        nameHi: "तपोवन अखाड़ा जलकुंभ व टैंकर केंद्र",
        cat: "water",
        zone: "tapovan",
        lat: 19.9912,
        lng: 73.8130,
        address: "Tapovan Entry Gate 1, Nashik",
        phone: "0253-2317151",
        timing: { en: "24/7 Flow", mr: "२४ तास पाणी पुरवठा", hi: "२४ घंटे जलापूर्ति" },
        price: { en: "Free", mr: "मोफत", hi: "मुफ्त" },
        isFree: true,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["Continuous Tanker Refill", "Tap Standposts", "Quality Tested"],
        desc: {
            en: "Municipal tanker station ensuring non-stop potable drinking water supply across camps.",
            mr: "साधुग्राममधील भाविकांसाठी महानगरपालिकेचे पिण्याचे पाणी केंद्र.",
            hi: "साधुग्राम में श्रद्धालुओं के लिए नगर निगम का पेयजल केंद्र।"
        }
    },

    // --- 9. PARKING FACILITIES & HOLDING AREAS ---
    {
        id: "park-1",
        name: "Tapovan Satellite Mega Holding Parking P-1",
        nameMr: "तपोवन सॅटेलाईट भव्य वाहनतळ पी-१",
        nameHi: "तपोवन सेटेलाइट भव्य पार्किंग पी-१",
        cat: "parking",
        zone: "tapovan",
        lat: 19.9890,
        lng: 73.8165,
        address: "Aurangabad Bypass Highway, Near Tapovan Corner, Nashik",
        phone: "1800-233-0011",
        timing: { en: "24 Hours Operational", mr: "२४ तास पार्किंग सुरू", hi: "२४ घंटे पार्किंग चालू" },
        price: { en: "Free Govt Parking", mr: "मोफत शासकीय वाहनतळ", hi: "मुफ्त सरकारी पार्किंग" },
        isFree: true,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["Capacity: 3500 Buses/Cars", "Free Electric Shuttle to Ramkund", "Security & CCTV", "Driver Resting Shed", "Toilet & Water Blocks"],
        desc: {
            en: "Primary satellite parking for vehicles arriving via Aurangabad and Pune highways. Includes free feeder bus.",
            mr: "३५०० वाहनांची क्षमता, मोफत शटल बस सेवा आणि चालकांसाठी विश्रामगृह.",
            hi: "३५०० वाहनों की क्षमता, रामकुंड के लिए मुफ्त शटल बस और सुरक्षित पार्किंग।"
        }
    },
    {
        id: "park-2",
        name: "CBS Municipal Multi-Level Parking",
        nameMr: "मध्यवर्ती बस स्थानक बहुमजली वाहनतळ",
        nameHi: "सेंट्रल बस स्टैंड बहुमंजिला पार्किंग",
        cat: "parking",
        zone: "cbs",
        lat: 19.9985,
        lng: 73.7752,
        address: "Near Old CBS Flyover, Central Nashik",
        phone: "0253-2575511",
        timing: { en: "24/7 Open", mr: "२४ तास खुले", hi: "२४ घंटे खुला" },
        price: { en: "Affordable (₹20/hr)", mr: "किफायतशीर दर", hi: "किफायती दर" },
        isFree: false,
        isBudget: true,
        verifiedDate: "27 Oct 2026",
        facilities: ["Covered Parking", "2-Wheeler & 4-Wheeler", "EV Fast Charging", "Boom Barriers"],
        desc: {
            en: "Secured municipal parking in city center close to bus terminals and commercial markets.",
            mr: "शहराच्या मध्यवर्ती भागात सुरक्षित दुचाकी व चारचाकी वाहनतळ.",
            hi: "शहर के केंद्र में सुरक्षित दोपहिया एवं चारपहिया वाहन पार्किंग।"
        }
    },

    // --- 10. BUS STATIONS & RAILWAY STATIONS ---
    {
        id: "trans-1",
        name: "Nashik Road Central Railway Station",
        nameMr: "नाशिक रोड मध्यवर्ती रेल्वे स्थानक",
        nameHi: "नासिक रोड केंद्रीय रेलवे स्टेशन",
        cat: "transport",
        zone: "nashik_road",
        lat: 19.9542,
        lng: 73.8338,
        address: "Subhash Road, Nashik Road, Nashik - 422101",
        phone: "139",
        timing: { en: "24 Hours Passenger Services", mr: "२४ तास प्रवासी सेवा", hi: "२४ घंटे यात्री सेवा" },
        price: { en: "Railway Tariffs", mr: "रेल्वे नियमानुसार", hi: "रेलवे नियमानुसार" },
        isFree: false,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["Kumbh Special Trains", "Helpdesk Kiosks", "Battery Cars for Elders", "Foot Overbridges with Lifts", "Prepaid Taxi Stand"],
        desc: {
            en: "Primary Central Railway terminal serving express and suburban trains connecting all corners of India.",
            mr: "देशभरातून येणाऱ्या भाविकांचे मुख्य रेल्वे जंक्शन, विशेष कुंभ गाड्यांची सोय.",
            hi: "देशभर के श्रद्धालुओं का मुख्य रेलवे जंक्शन, विशेष कुंभ ट्रेनों की सुविधा।"
        }
    },
    {
        id: "trans-2",
        name: "CBS MSRTC Central Bus Stand",
        nameMr: "मध्यवर्ती एसटी महामंडळ बस स्थानक (CBS)",
        nameHi: "सेंट्रल एसटी महामंडल बस स्टैंड (CBS)",
        cat: "transport",
        zone: "cbs",
        lat: 19.9978,
        lng: 73.7765,
        address: "Gole Colony, Shivaji Road, CBS, Nashik",
        phone: "0253-2575222",
        timing: { en: "24/7 State Bus Departures", mr: "२४ तास एसटी बसेस", hi: "२४ घंटे बस सेवा" },
        price: { en: "MSRTC Rates", mr: "एसटी दर", hi: "एसटी दर" },
        isFree: false,
        isBudget: true,
        verifiedDate: "28 Oct 2026",
        facilities: ["Shuttle to Trimbakeshwar", "Shivshahi / Electric Buses", "Pilgrim Inquiries", "Luggage Cloakroom"],
        desc: {
            en: "Main bus terminal connecting Pune, Mumbai, Dhule, and 24x7 pilgrimage shuttles to Trimbak.",
            mr: "त्र्यंबकेश्वर, मुंबई व पुणे करिता अविरत एसटी बसेसचे मुख्य केंद्र.",
            hi: "त्र्यंबकेश्वर, मुंबई और पुणे के लिए निरंतर राज्य परिवहन बसों का मुख्य केंद्र।"
        }
    },

    // --- 11. LOST-AND-FOUND ASSISTANCE ---
    {
        id: "lost-1",
        name: "Kumbh Central Lost & Found Assistance Center",
        nameMr: "महाकुंभ हरवलेल्या व्यक्ती व वस्तू शोध कक्ष",
        nameHi: "महाकुंभ खोया-पाया व व्यक्ति पुनर्मिलन केंद्र",
        cat: "lostfound",
        zone: "ramkund",
        lat: 19.9974,
        lng: 73.7925,
        address: "Ramkund Control Tower, Panchavati Bank, Nashik",
        phone: "1800-233-0011",
        timing: { en: "24 Hours Continuous Desk", mr: "२४ तास अविरत कक्ष", hi: "२४ घंटे निरंतर सहायता" },
        price: { en: "Free Public Service", mr: "विनामूल्य सेवा", hi: "निःशुल्क सेवा" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Multilingual Public Address", "Digital Photo Matching", "Child Welfare Officers", "Rest Lounge for Separated Elders"],
        desc: {
            en: "Official police and volunteer desk to safely reunite lost children, senior citizens, and missing belongings.",
            mr: "गर्दीत हरवलेल्या लहान मुलांची व वृद्धांची सुरक्षित नातेवाईकांशी भेट घडवून देणारा अधिकृत कक्ष.",
            hi: "मेले में बिछड़े बच्चों और बुजुर्गों को परिजनों से मिलाने वाला आधिकारिक खोया-पाया केंद्र।"
        }
    },
    {
        id: "lost-2",
        name: "Tapovan Sector 1 Reunification & Help Kiosk",
        nameMr: "तपोवन मदत व आप्त शोध कक्ष",
        nameHi: "तपोवन सहायता एवं परिजन मिलन कियोस्क",
        cat: "lostfound",
        zone: "tapovan",
        lat: 19.9925,
        lng: 73.8110,
        address: "Opposite Tapovan Police Chowki, Nashik",
        phone: "112",
        timing: { en: "24/7 Desk", mr: "२४ तास सेवा", hi: "२४ घंटे सेवा" },
        price: { en: "Free", mr: "मोफत", hi: "मुफ्त" },
        isFree: true,
        isBudget: true,
        verifiedDate: "29 Oct 2026",
        facilities: ["Loudspeaker Calls", "Hindi / Marathi / English Staff", "Free Phone Calling Facility"],
        desc: {
            en: "Equipped with dedicated phone lines allowing stranded devotees to contact their families anywhere in India.",
            mr: "भाविकांसाठी मोफत दूरध्वनी व आप्तेष्टांशी संपर्क कक्ष.",
            hi: "बिछड़े श्रद्धालुओं के लिए मुफ्त फोन कॉल एवं लाउडस्पीकर उद्घोषणा केंद्र।"
        }
    },

    // --- 12. TOURIST & PILGRIM INFORMATION CENTRES ---
    {
        id: "tour-1",
        name: "MTDC Pilgrim & Tourist Facilitation Kiosk",
        nameMr: "एमटीडीसी यात्रिक व पर्यटक माहिती केंद्र",
        nameHi: "एमटीडीसी तीर्थयात्री एवं पर्यटक सूचना केंद्र",
        cat: "tourist",
        zone: "ramkund",
        lat: 19.9971,
        lng: 73.7914,
        address: "Ghat Promenade, Near Ahilyabai Holkar Bridge, Ramkund, Nashik",
        phone: "0253-2570059",
        timing: { en: "06:00 AM - 10:00 PM", mr: "सकाळी ६:०० ते रात्री १०:००", hi: "सुबह ६:०० से रात १०:००" },
        price: { en: "Free Guidance & Maps", mr: "मोफत मार्गदर्शन व नकाशे", hi: "मुफ्त मार्गदर्शन व नक्शे" },
        isFree: true,
        isBudget: true,
        verifiedDate: "30 Oct 2026",
        facilities: ["Free Physical Maps", "Shahi Snan Timetable", "Multi-lingual Guides", "Heritage Walk Info"],
        desc: {
            en: "Official Maharashtra Tourism counter providing printed circuit maps, bathing schedules, and ghat rules.",
            mr: "शाही स्नान वेळापत्रक, नाशिक दर्शन व घाट मार्गदर्शनाचे अधिकृत शासकीय केंद्र.",
            hi: "शाही स्नान समय-सारणी, पर्यटन सर्किट और घाट नियमों की आधिकारिक जानकारी।"
        }
    },
    {
        id: "tour-2",
        name: "Nashik Municipal Tourist Information Center (CBS)",
        nameMr: "नाशिक महापालिका माहिती केंद्र (CBS)",
        nameHi: "नासिक नगर निगम सूचना केंद्र (CBS)",
        cat: "tourist",
        zone: "cbs",
        lat: 19.9982,
        lng: 73.7761,
        address: "Opposite CBS Bus Terminus, Nashik",
        phone: "1800-233-0011",
        timing: { en: "07:00 AM - 09:00 PM", mr: "सकाळी ७:०० ते रात्री ९:००", hi: "सुबह ७:०० से रात ९:००" },
        price: { en: "Free", mr: "मोफत", hi: "मुफ्त" },
        isFree: true,
        isBudget: true,
        verifiedDate: "28 Oct 2026",
        facilities: ["City Guide Brochures", "Trimbak Bus Schedules", "Senior Citizen Assistance Desk"],
        desc: {
            en: "City center portal offering up-to-date information on Kumbh shuttle buses and crowd congestion status.",
            mr: "कुंभ वाहतूक, शटल बस व गर्दीची सद्यस्थिती सांगणारे माहिती केंद्र.",
            hi: "कुंभ शटल बसों एवं भीड़ की स्थिति की अद्यतन जानकारी प्रदान करने वाला केंद्र।"
        }
    }
];

// 3. MULTILINGUAL TRANSLATION DICTIONARY
// Full 3-Language UI mapping (English, मराठी, हिन्दी)
const TRANSLATIONS = {
    en: {
        emergencyLabel: "EMERGENCY 24/7:",
        brandSubtitle: "Smart Maha Kumbh Services Portal • कुंभसेतू नाशिक",
        useGpsBtn: "Find Near Me",
        gpsActiveBtn: "GPS Active",
        savedPill: "Saved",
        qrBtn: "Get QR Poster",
        heroBadge: "Nashik Maha Kumbh Mela 2027",
        heroTitle: "Pilgrim Essential Services Directory",
        heroDesc: "Scan & find verified hospitals, clean toilets, drinking water, satvik food, shelters, and police helpdesks around Ramkund, Panchavati & Tapovan.",
        zoneSelectorLabel: "Select Your Pilgrim Zone:",
        zoneAll: "All Nashik",
        zoneRamkund: "Ramkund Ghat",
        zonePanchavati: "Panchavati",
        zoneTapovan: "Tapovan (Sadhu Gram)",
        zoneNashikRoad: "Nashik Road Station",
        zoneCBS: "CBS Bus Stand",
        searchPlaceholder: "Search hospital, food, toilet, drinking water, ATM...",
        radiusLabel: "Search Radius:",
        sortLabel: "Sort By:",
        sortDistance: "Nearest Distance",
        sortVerified: "Recently Verified",
        sortName: "Name (A-Z)",
        filterCostLabel: "Cost Filter:",
        costAll: "All Types",
        costFree: "Free / Seva Only",
        costBudget: "Budget / Affordable",
        locDefaultNote: "Calculating distances from Ramkund Ghat Center. Enable GPS for live distance.",
        locGpsActiveNote: "Live GPS Active. Distances calculated from your current smartphone position.",
        locDeniedNote: "Location permission denied. Showing distances from chosen pilgrim zone.",
        enableGpsLink: "Enable GPS",
        catAll: "All Services",
        catHospital: "Hospitals",
        catAmbulance: "Ambulance",
        catStay: "Stay & Lodges",
        catFood: "Food & Mess",
        catAtm: "ATMs & Banks",
        catPolice: "Police & Help",
        catToilet: "Public Toilets",
        catWater: "Drinking Water",
        catParking: "Parking Areas",
        catTransport: "Bus & Railway",
        catLostFound: "Lost & Found",
        catTourist: "Information Centers",
        resultsFound: "Verified pilgrim services found near you",
        sampleDataTag: "Demo Dataset (Verified Schema)",
        noResultsTitle: "No Services Found In This Range",
        noResultsDesc: "Try expanding your search radius slider, clearing keyword filters, or changing your current zone.",
        resetFiltersBtn: "Reset All Filters",
        maxRadiusBtn: "Expand Radius to 15 KM",
        emergencySecTitle: "Official Nashik Emergency Assistance",
        emergencySecDesc: "Toll-free emergency numbers and first-aid response units authorized for Nashik Maha Kumbh Mela.",
        emergencyDisclaimer: "Important Notice: KumbhSetu is an informational public-service directory and does not directly dispatch emergency responders. In case of critical emergency, dial 108 or 112 immediately. Information displayed is prepared for pilgrim assistance and subject to District Administration confirmation.",
        qrModalTitle: "Pilgrim QR Poster Generator",
        qrModalDesc: "Generate instant scannable QR codes for your physical information stalls, ghats, or camps.",
        qrTargetLabel: "Target Zone for this QR Code:",
        printPosterBtn: "Print Physical Poster",
        copyLinkBtn: "Copy Portal Link",
        bnavHome: "Home",
        bnavCategories: "Services",
        bnavEmergency: "Emergency",
        bnavSaved: "Saved",
        bnavQr: "QR Poster",
        footerTagline: "Smart Maha Kumbh Services & Pilgrim Navigation Portal",
        adminLink: "Admin Portal",
        footerZonesTitle: "Key Pilgrim Zones",
        footerHelpTitle: "Emergency Hotlines",
        footerProjectTitle: "Community Engagement Project",
        clearZoneBtn: "View All Nashik",
        callBtn: "Call",
        navBtn: "Navigate",
        reportBtn: "Report Issue",
        distFromLoc: "KM away",
        verifiedTag: "Verified",
        freeTag: "Free / Seva"
    },
    mr: {
        emergencyLabel: "आपत्कालीन सेवा २४/७:",
        brandSubtitle: "स्मार्ट महाकुंभ सेवा पोर्टल • कुंभसेतू नाशिक",
        useGpsBtn: "माझ्या जवळ शोधा",
        gpsActiveBtn: "जीपीएस सक्रिय",
        savedPill: "जतन केलेल्या",
        qrBtn: "क्यूआर पोस्टर",
        heroBadge: "नाशिक त्र्यंबकेश्वर महाकुंभमेळा २०२७",
        heroTitle: "भाविकांसाठी अत्यावश्यक सेवा मार्गदर्शक",
        heroDesc: "रामकुंड, पंचवटी आणि तपोवन परिसरातील रुग्णालये, स्वच्छ स्वच्छतागृहे, पिण्याचे पाणी, मोफत अन्नक्षेत्र आणि पोलीस मदत केंद्रे त्वरित शोधा.",
        zoneSelectorLabel: "तुमचा सध्याचा परिसर निवडा:",
        zoneAll: "संपूर्ण नाशिक",
        zoneRamkund: "रामकुंड घाट",
        zonePanchavati: "पंचवटी",
        zoneTapovan: "तपोवन (साधु ग्राम)",
        zoneNashikRoad: "नाशिक रोड रेल्वे स्थानक",
        zoneCBS: "सीबीएस बस स्थानक",
        searchPlaceholder: "रुग्णालय, अन्नक्षेत्र, शौचालय, पाणी, एटीएम शोधा...",
        radiusLabel: "शोध अंतर मर्यादा (किमी):",
        sortLabel: "क्रमवारी:",
        sortDistance: "सर्वात जवळचे अंतर",
        sortVerified: "नुकतेच तपासलेले",
        sortName: "नावाप्रमाणे (A-Z)",
        filterCostLabel: "खर्च प्रकार:",
        costAll: "सर्व प्रकार",
        costFree: "केवळ विनामूल्य / सेवा",
        costBudget: "किफायतशीर / बजेट",
        locDefaultNote: "रामकुंड घाट केंद्रापासून अंतर मोजले जात आहे. अचूक अंतरासाठी जीपीएस सुरू करा.",
        locGpsActiveNote: "थेट जीपीएस सुरू आहे. तुमच्या सध्याच्या मोबाईल स्थानावरून अचूक अंतर दाखवले जात आहे.",
        locDeniedNote: "जीपीएस परवानगी मिळालेली नाही. निवडलेल्या कुंभ क्षेत्रानुसार अंतर दाखवले जात आहे.",
        enableGpsLink: "जीपीएस सुरू करा",
        catAll: "सर्व सेवा",
        catHospital: "रुग्णालये",
        catAmbulance: "रुग्णवाहिका",
        catStay: "धर्मशाळा व निवास",
        catFood: "अन्नक्षेत्र व भोजनालय",
        catAtm: "एटीएम व बँका",
        catPolice: "पोलीस व मदत",
        catToilet: "सार्वजनिक स्वच्छतागृहे",
        catWater: "पिण्याचे पाणी (जलसेवा)",
        catParking: "वाहनतळ (पार्किंग)",
        catTransport: "बस व रेल्वे वाहतूक",
        catLostFound: "हरवले-सापडले कक्ष",
        catTourist: "माहिती व दर्शन केंद्र",
        resultsFound: "तुमच्या जवळ उपलब्ध सत्यापित सेवा",
        sampleDataTag: "डेमो डेटा (प्रमाणित आराखडा)",
        noResultsTitle: "या परिसरात सेवा उपलब्ध नाहीत",
        noResultsDesc: "कृपया शोध अंतर मर्यादा वाढवा, शोध शब्द बदला किंवा दुसरा परिसर निवडा.",
        resetFiltersBtn: "सर्व फिल्टर्स पूर्ववत करा",
        maxRadiusBtn: "मर्यादा १५ किमी करा",
        emergencySecTitle: "नाशिक महाकुंभ अधिकृत आपत्कालीन मदत",
        emergencySecDesc: "नाशिक महाकुंभमेळ्यासाठी अधिकृत २४ तास मोफत हेल्पलाइन आणि तात्काळ वैद्यकीय मदत पथके.",
        emergencyDisclaimer: "महत्त्वाची सूचना: कुंभसेतू हे एक माहितीपूर्ण जनसेवा पोर्टल आहे आणि ते थेट रुग्णवाहिका अथवा पोलीस पाठवत नाही. अतिदक्षतेच्या प्रसंगी त्वरित १०८ किंवा ११२ वर कॉल करा. प्रदर्शित माहिती भाविकांच्या सोयीसाठी तयार केलेली असून शासकीय पडताळणीवर आधारित आहे.",
        qrModalTitle: "कुंभ क्यूआर पोस्टर जनरेटर",
        qrModalDesc: "घाटांवर, माहिती केंद्रांवर किंवा मुक्कामाच्या ठिकाणी लावण्यासाठी त्वरित स्कॅन होणारे क्यूआर पोस्टर तयार करा.",
        qrTargetLabel: "या क्यूआर कोडसाठी परिसर निवडा:",
        printPosterBtn: "पोस्टर प्रिंट करा",
        copyLinkBtn: "वेबसाइट लिंक कॉपी करा",
        bnavHome: "मुख्यपृष्ठ",
        bnavCategories: "सेवा",
        bnavEmergency: "आपत्कालीन",
        bnavSaved: "जतन",
        bnavQr: "क्यूआर",
        footerTagline: "स्मार्ट महाकुंभ सेवा व तीर्थयात्री मार्गदर्शन प्रणाली",
        adminLink: "प्रशासक कक्ष",
        footerZonesTitle: "प्रमुख तीर्थक्षेत्र परिसर",
        footerHelpTitle: "तातडीचे संपर्क क्रमांक",
        footerProjectTitle: "कम्युनिटी एंगेजमेंट प्रोजेक्ट",
        clearZoneBtn: "संपूर्ण नाशिक पहा",
        callBtn: "कॉल करा",
        navBtn: "मार्गदर्शन (Map)",
        reportBtn: "त्रुटी नोंदवा",
        distFromLoc: "किमी अंतरावर",
        verifiedTag: "तपासलेले",
        freeTag: "विनामूल्य / सेवा"
    },
    hi: {
        emergencyLabel: "आपातकालीन सेवा २४/७:",
        brandSubtitle: "स्मार्ट महाकुंभ सेवा पोर्टल • कुंभसेतू नाशिक",
        useGpsBtn: "निकटतम खोजें",
        gpsActiveBtn: "जीपीएस सक्रिय",
        savedPill: "सहेजे गए",
        qrBtn: "क्यूआर पोस्टर",
        heroBadge: "नासिक महाकुंभ मेला २०२७",
        heroTitle: "तीर्थयात्री आवश्यक सेवा निर्देशिका",
        heroDesc: "रामकुंड, पंचवटी और तपोवन क्षेत्र में अस्पताल, स्वच्छ शौचालय, पेयजल, निःशुल्क भंडारे और पुलिस सहायता केंद्र तुरंत ढूंढें।",
        zoneSelectorLabel: "अपना तीर्थ क्षेत्र चुनें:",
        zoneAll: "संपूर्ण नासिक",
        zoneRamkund: "रामकुंड घाट",
        zonePanchavati: "पंचवटी",
        zoneTapovan: "तपोवन (साधु ग्राम)",
        zoneNashikRoad: "नासिक रोड रेलवे स्टेशन",
        zoneCBS: "सीबीएस बस स्टैंड",
        searchPlaceholder: "अस्पताल, भंडारा, शौचालय, पेयजल, एटीएम खोजें...",
        radiusLabel: "खोज दायरा (किमी):",
        sortLabel: "क्रमबद्ध करें:",
        sortDistance: "निकटतम दूरी",
        sortVerified: "हाल ही में सत्यापित",
        sortName: "नाम अनुसार (A-Z)",
        filterCostLabel: "लागत प्रकार:",
        costAll: "सभी प्रकार",
        costFree: "केवल निःशुल्क / सेवा",
        costBudget: "किफायती / बजट",
        locDefaultNote: "रामकुंड घाट केंद्र से दूरी की गणना की जा रही है। सटीक दूरी हेतु जीपीएस चालू करें।",
        locGpsActiveNote: "लाइव जीपीएस सक्रिय है। आपके वर्तमान स्मार्टफोन स्थान से दूरी मापी जा रही है।",
        locDeniedNote: "स्थान अनुमति अस्वीकृत। चुने गए तीर्थ क्षेत्र के आधार पर दूरी दर्शाई जा रही है।",
        enableGpsLink: "जीपीएस चालू करें",
        catAll: "सभी सेवाएं",
        catHospital: "अस्पताल",
        catAmbulance: "एम्बुलेंस",
        catStay: "धर्मशाला व निवास",
        catFood: "भंडारा व भोजन",
        catAtm: "एटीएम व बैंक",
        catPolice: "पुलिस व सुरक्षा",
        catToilet: "सार्वजनिक शौचालय",
        catWater: "पेयजल (जल सेवा)",
        catParking: "पार्किंग क्षेत्र",
        catTransport: "बस व रेलवे",
        catLostFound: "खोया-पाया केंद्र",
        catTourist: "सूचना व दर्शन केंद्र",
        resultsFound: "आपके समीप सत्यापित तीर्थ सेवाएं",
        sampleDataTag: "डेमो डेटा (प्रमाणित स्कीमा)",
        noResultsTitle: "इस दायरे में कोई सेवा नहीं मिली",
        noResultsDesc: "कृपया खोज दायरा बढ़ाएं, खोज शब्द बदलें अथवा दूसरा क्षेत्र चुनें।",
        resetFiltersBtn: "सभी फ़िल्टर रीसेट करें",
        maxRadiusBtn: "दायरा १५ किमी करें",
        emergencySecTitle: "नासिक महाकुंभ आधिकारिक आपातकालीन सहायता",
        emergencySecDesc: "नासिक महाकुंभ मेले हेतु अधिकृत २४ घंटे टोल-फ्री हेल्पलाइन और प्राथमिक चिकित्सा दस्ते।",
        emergencyDisclaimer: "महत्वपूर्ण सूचना: कुंभसेतू केवल एक सूचनात्मक जनसेवा पोर्टल है और सीधे पुलिस अथवा एम्बुलेंस नहीं भेजता। आपातकालीन स्थिति में तुरंत १०८ अथवा ११२ पर कॉल करें। प्रदर्शित जानकारी श्रद्धालुओं की सहायता हेतु तैयार की गई है।",
        qrModalTitle: "कुंभ क्यूआर पोस्टर जनरेटर",
        qrModalDesc: "घाटों, शिविरों अथवा सूचना केंद्रों पर लगाने हेतु तुरंत स्कैन होने वाला क्यूआर पोस्टर बनाएं।",
        qrTargetLabel: "इस क्यूआर कोड हेतु क्षेत्र चुनें:",
        printPosterBtn: "पोस्टर प्रिंट करें",
        copyLinkBtn: "वेबसाइट लिंक कॉपी करें",
        bnavHome: "होम",
        bnavCategories: "सेवाएं",
        bnavEmergency: "आपातकाल",
        bnavSaved: "सहेजे गए",
        bnavQr: "क्यूआर",
        footerTagline: "स्मार्ट महाकुंभ सेवा एवं तीर्थयात्री मार्गदर्शन प्रणाली",
        adminLink: "प्रशासक कक्ष",
        footerZonesTitle: "प्रमुख तीर्थ क्षेत्र",
        footerHelpTitle: "आपातकालीन नंबर",
        footerProjectTitle: "कम्युनिटी एंगेजमेंट प्रोजेक्ट",
        clearZoneBtn: "संपूर्ण नासिक देखें",
        callBtn: "कॉल करें",
        navBtn: "मार्गदर्शन (Map)",
        reportBtn: "त्रुटि बताएं",
        distFromLoc: "किमी दूर",
        verifiedTag: "सत्यापित",
        freeTag: "निःशुल्क / सेवा"
    }
};

// 4. CLIENT-SIDE DATA STORE & LOCAL STORAGE ORCHESTRATION
const STORAGE_KEYS = {
    PLACES: "kumbhsetu_places_v3",
    SAVED: "kumbhsetu_saved_v3",
    REPORTS: "kumbhsetu_reports_v3",
    LANG: "kumbhsetu_lang_pref",
    ADMIN_AUTH: "kumbhsetu_admin_auth"
};

const KumbhStore = {
    getAllPlaces: function() {
        const stored = localStorage.getItem(STORAGE_KEYS.PLACES);
        if (!stored) {
            this.setAllPlaces(DEFAULT_SERVICES_DATA);
            return DEFAULT_SERVICES_DATA;
        }
        try {
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed) || parsed.length < 10) {
                this.setAllPlaces(DEFAULT_SERVICES_DATA);
                return DEFAULT_SERVICES_DATA;
            }
            return parsed;
        } catch (e) {
            console.error("Error reading stored places, resetting to default", e);
            this.setAllPlaces(DEFAULT_SERVICES_DATA);
            return DEFAULT_SERVICES_DATA;
        }
    },

    setAllPlaces: function(data) {
        localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(data));
    },

    addPlace: function(newPlace) {
        const list = this.getAllPlaces();
        list.unshift(newPlace);
        this.setAllPlaces(list);
    },

    deletePlace: function(id) {
        let list = this.getAllPlaces();
        list = list.filter(p => p.id !== id);
        this.setAllPlaces(list);
    },

    resetToDefault: function() {
        this.setAllPlaces(DEFAULT_SERVICES_DATA);
    },

    getSavedPlaceIds: function() {
        const stored = localStorage.getItem(STORAGE_KEYS.SAVED);
        return stored ? JSON.parse(stored) : [];
    },

    toggleSavePlace: function(id) {
        let saved = this.getSavedPlaceIds();
        const index = saved.indexOf(id);
        let isNowSaved = false;
        if (index > -1) {
            saved.splice(index, 1);
        } else {
            saved.push(id);
            isNowSaved = true;
        }
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(saved));
        return isNowSaved;
    },

    clearAllSaved: function() {
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify([]));
    },

    getReports: function() {
        const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
        return stored ? JSON.parse(stored) : [];
    },

    addReport: function(reportObj) {
        const list = this.getReports();
        list.unshift(reportObj);
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
    },

    clearReports: function() {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    }
};

// 5. APPLICATION STATE
const AppState = {
    currentCategory: 'all',
    currentZone: 'all',
    maxRadius: 10.0,
    searchQuery: '',
    sortBy: 'distance',
    affordability: 'all',
    currentLang: 'en',
    userLocation: {
        lat: NASHIK_ZONES.ramkund.lat,
        lng: NASHIK_ZONES.ramkund.lng,
        isGPS: false,
        accuracy: null,
        zoneName: 'ramkund',
        isFarFromNashik: false,
        actualDistanceToNashik: 0
    },
    qrCodeInstance: null
};

// 6. INITIALIZATION LIFECYCLE
window.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initUrlParameters();
    initSavedBadge();
    renderDirectory();
    updateCategoryBadges();
    detectProtocolForQR();
});

// Check URL parameters for zone targeting (e.g., ?zone=ramkund)
function initUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const zoneParam = urlParams.get('zone');
    if (zoneParam && NASHIK_ZONES[zoneParam]) {
        AppState.currentZone = zoneParam;
        AppState.userLocation.lat = NASHIK_ZONES[zoneParam].lat;
        AppState.userLocation.lng = NASHIK_ZONES[zoneParam].lng;
        AppState.userLocation.zoneName = zoneParam;

        // Activate zone chip in UI
        document.querySelectorAll('.zone-chip').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-zone') === zoneParam);
        });

        // Show welcome banner for zone
        showActiveZoneBanner(zoneParam);
    }
}

// Language initialization
function initLanguage() {
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
    AppState.currentLang = savedLang;
    const select = document.getElementById('langSelect');
    if (select) select.value = savedLang;
    applyLanguage(savedLang);
}

function changeLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    AppState.currentLang = lang;
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    applyLanguage(lang);
    renderDirectory();
    updateCategoryBadges();
    if (AppState.currentZone !== 'all') {
        showActiveZoneBanner(AppState.currentZone);
    }
}

function applyLanguage(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // Apply text to all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    // Apply placeholder to elements with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });

    // Update GPS status banner
    updateLocationStatusDisplay();
}

// 7. ACCURATE HAVERSINE DISTANCE FORMULA (Kilometers)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Earth's mean radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
}

// 8. BROWSER GEOLOCATION HANDLING WITH INTELLIGENT OUT-OF-NASHIK SIMULATION
function requestUserLocation() {
    const statusText = document.getElementById('locationStatusText');
    const gpsBtn = document.getElementById('gpsToggleBtn');
    const gpsBtnText = document.getElementById('gpsBtnText');
    const statusBar = document.getElementById('locationStatusAlert');
    const t = TRANSLATIONS[AppState.currentLang];

    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your current browser.");
        return;
    }

    if (statusText) statusText.innerText = "Requesting GPS coordinates...";
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const accuracy = Math.round(position.coords.accuracy);

            // Calculate distance to Ramkund center
            const distToRamkund = calculateHaversineDistance(
                userLat,
                userLng,
                NASHIK_ZONES.ramkund.lat,
                NASHIK_ZONES.ramkund.lng
            );

            AppState.userLocation.accuracy = accuracy;
            AppState.userLocation.isGPS = true;

            // Intelligent out-of-Nashik detection (e.g. testing from Mumbai, Pune, or other cities)
            if (distToRamkund > 60.0) {
                AppState.userLocation.isFarFromNashik = true;
                AppState.userLocation.actualDistanceToNashik = distToRamkund;
                // Keep coordinates focused on Ramkund for practical directory browsing, but acknowledge GPS
                AppState.userLocation.lat = NASHIK_ZONES.ramkund.lat;
                AppState.userLocation.lng = NASHIK_ZONES.ramkund.lng;
                
                showToast(`📍 GPS active (${distToRamkund} KM from Nashik). Showing simulated pilgrim view at Ramkund.`);
            } else {
                AppState.userLocation.isFarFromNashik = false;
                AppState.userLocation.lat = userLat;
                AppState.userLocation.lng = userLng;
                showToast("📍 Location detected successfully within Nashik!");
            }

            if (gpsBtn) gpsBtn.classList.add('active');
            if (gpsBtnText) gpsBtnText.innerText = t.gpsActiveBtn || "GPS Active";
            if (statusBar) statusBar.classList.add('gps-active');

            updateLocationStatusDisplay();
            renderDirectory();
        },
        (error) => {
            console.warn("Geolocation permission denied or timed out:", error.message);
            AppState.userLocation.isGPS = false;
            AppState.userLocation.isFarFromNashik = false;

            if (gpsBtn) gpsBtn.classList.remove('active');
            if (gpsBtnText) gpsBtnText.innerText = t.useGpsBtn || "Find Near Me";
            if (statusBar) statusBar.classList.remove('gps-active');

            if (statusText) {
                statusText.innerText = t.locDeniedNote;
            }
            showToast("Location access denied. Using reference zone distances.");
            renderDirectory();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
}

function updateLocationStatusDisplay() {
    const statusText = document.getElementById('locationStatusText');
    const t = TRANSLATIONS[AppState.currentLang];
    if (!statusText || !t) return;

    if (AppState.userLocation.isGPS) {
        if (AppState.userLocation.isFarFromNashik) {
            statusText.innerText = `GPS Active (${AppState.userLocation.actualDistanceToNashik} KM away). Simulated pilgrim perspective from Ramkund Ghat.`;
        } else {
            statusText.innerText = `${t.locGpsActiveNote} (±${AppState.userLocation.accuracy || 15}m)`;
        }
    } else if (AppState.currentZone !== 'all') {
        const zoneInfo = NASHIK_ZONES[AppState.currentZone];
        const zoneName = AppState.currentLang === 'mr' ? zoneInfo.nameMr : (AppState.currentLang === 'hi' ? zoneInfo.nameHi : zoneInfo.name);
        statusText.innerText = `Calculating distances relative to ${zoneName}.`;
    } else {
        statusText.innerText = t.locDefaultNote;
    }
}

// 9. ZONE FILTERING & PRIORITIZATION
function selectZone(zoneKey) {
    if (!NASHIK_ZONES[zoneKey]) return;
    AppState.currentZone = zoneKey;

    // Update Zone Chips in UI
    document.querySelectorAll('.zone-chip').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-zone') === zoneKey);
    });

    if (zoneKey !== 'all') {
        AppState.userLocation.lat = NASHIK_ZONES[zoneKey].lat;
        AppState.userLocation.lng = NASHIK_ZONES[zoneKey].lng;
        AppState.userLocation.zoneName = zoneKey;
        showActiveZoneBanner(zoneKey);
    } else {
        // Reset to default datum (Ramkund center)
        AppState.userLocation.lat = NASHIK_ZONES.ramkund.lat;
        AppState.userLocation.lng = NASHIK_ZONES.ramkund.lng;
        AppState.userLocation.zoneName = 'all';
        hideActiveZoneBanner();
    }

    updateLocationStatusDisplay();
    renderDirectory();
}

function showActiveZoneBanner(zoneKey) {
    const banner = document.getElementById('activeZoneBanner');
    const bannerText = document.getElementById('zoneBannerText');
    if (!banner || !bannerText) return;

    const zone = NASHIK_ZONES[zoneKey];
    const zoneName = AppState.currentLang === 'mr' ? zone.nameMr : (AppState.currentLang === 'hi' ? zone.nameHi : zone.name);
    bannerText.innerHTML = `<strong>📍 Active Zone:</strong> Showing services prioritized around <b>${zoneName}</b> (${zone.desc || ''})`;
    banner.classList.remove('hidden');
}

function hideActiveZoneBanner() {
    const banner = document.getElementById('activeZoneBanner');
    if (banner) banner.classList.add('hidden');
}

function clearZoneFilter() {
    selectZone('all');
}

// 10. FILTER CONTROLS (Category, Search, Radius, Sort, Affordability)
function setCategory(catKey) {
    AppState.currentCategory = catKey;
    document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.remove('active');
    });
    const target = document.getElementById(`cat-${catKey}`);
    if (target) target.classList.add('active');
    renderDirectory();
}

function updateRadius(val) {
    AppState.maxRadius = parseFloat(val);
    const radiusValEl = document.getElementById('radiusVal');
    if (radiusValEl) {
        radiusValEl.innerText = AppState.maxRadius.toFixed(1) + " KM";
    }
    renderDirectory();
}

function handleSearchInput() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    AppState.searchQuery = input.value.trim().toLowerCase();

    if (clearBtn) {
        clearBtn.classList.toggle('hidden', AppState.searchQuery.length === 0);
    }
    renderDirectory();
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    if (input) input.value = '';
    AppState.searchQuery = '';
    if (clearBtn) clearBtn.classList.add('hidden');
    renderDirectory();
}

function updateSort(val) {
    AppState.sortBy = val;
    renderDirectory();
}

function updateAffordability(val) {
    AppState.affordability = val;
    renderDirectory();
}

function resetAllFilters() {
    AppState.currentCategory = 'all';
    AppState.currentZone = 'all';
    AppState.maxRadius = 10.0;
    AppState.searchQuery = '';
    AppState.sortBy = 'distance';
    AppState.affordability = 'all';

    // Reset controls
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearchBtn').classList.add('hidden');
    document.getElementById('radiusSlider').value = 10.0;
    document.getElementById('radiusVal').innerText = "10.0 KM";
    document.getElementById('sortBySelect').value = 'distance';
    document.getElementById('affordabilityFilter').value = 'all';

    document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
    document.getElementById('cat-all').classList.add('active');

    document.querySelectorAll('.zone-chip').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-zone') === 'all'));
    hideActiveZoneBanner();

    renderDirectory();
}

function expandRadiusToMax() {
    const slider = document.getElementById('radiusSlider');
    if (slider) {
        slider.value = 15.0;
        updateRadius(15.0);
    }
}

// 11. MAIN RENDERING ENGINE FOR DIRECTORY CARDS
function renderDirectory() {
    const grid = document.getElementById('placesGrid');
    const noResults = document.getElementById('noResults');
    const resultCountEl = document.getElementById('resultCount');
    if (!grid) return;

    const allPlaces = KumbhStore.getAllPlaces();
    const savedIds = KumbhStore.getSavedPlaceIds();
    const t = TRANSLATIONS[AppState.currentLang];

    // Compute live distance for each place from current location/zone
    const placesWithDist = allPlaces.map(place => {
        const dist = calculateHaversineDistance(
            AppState.userLocation.lat,
            AppState.userLocation.lng,
            place.lat,
            place.lng
        );
        return { ...place, calculatedDist: dist };
    });

    // Filter by Category, Radius, Zone, Affordability, and Search
    let filtered = placesWithDist.filter(place => {
        // Category check
        const matchCat = (AppState.currentCategory === 'all' || place.cat === AppState.currentCategory);
        
        // Radius check
        const matchDist = (place.calculatedDist <= AppState.maxRadius);

        // Zone prioritization check
        const matchZone = (AppState.currentZone === 'all' || place.zone === AppState.currentZone);

        // Affordability check
        let matchCost = true;
        if (AppState.affordability === 'free') {
            matchCost = (place.isFree === true);
        } else if (AppState.affordability === 'budget') {
            matchCost = (place.isBudget === true || place.isFree === true);
        }

        // Search text check
        let matchSearch = true;
        if (AppState.searchQuery.length > 0) {
            const query = AppState.searchQuery;
            const nameMatch = place.name.toLowerCase().includes(query);
            const nameMrMatch = place.nameMr ? place.nameMr.toLowerCase().includes(query) : false;
            const nameHiMatch = place.nameHi ? place.nameHi.toLowerCase().includes(query) : false;
            const addrMatch = place.address.toLowerCase().includes(query);
            const facMatch = place.facilities ? place.facilities.some(f => f.toLowerCase().includes(query)) : false;
            const catMatch = place.cat.toLowerCase().includes(query);
            matchSearch = (nameMatch || nameMrMatch || nameHiMatch || addrMatch || facMatch || catMatch);
        }

        return matchCat && matchDist && matchZone && matchCost && matchSearch;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
        if (AppState.sortBy === 'distance') {
            return a.calculatedDist - b.calculatedDist;
        } else if (AppState.sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (AppState.sortBy === 'verified') {
            return new Date(b.verifiedDate || 0) - new Date(a.verifiedDate || 0);
        }
        return 0;
    });

    // Update Counter
    if (resultCountEl) {
        resultCountEl.innerText = filtered.length;
    }

    // Render Cards
    grid.innerHTML = '';
    if (filtered.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        filtered.forEach(place => {
            const isSaved = savedIds.includes(place.id);
            const cardEl = createServiceCardElement(place, isSaved, t);
            grid.appendChild(cardEl);
        });
    }

    // Also update Category Tab badges
    updateCategoryBadges();
}

// Create individual Service Card DOM element with robust event bindings
function createServiceCardElement(place, isSaved, t) {
    const card = document.createElement('article');
    card.className = `service-card service-cat-${place.cat}`;
    card.id = `card-${place.id}`;

    // Localized titles
    const displayName = AppState.currentLang === 'mr' ? (place.nameMr || place.name) : (AppState.currentLang === 'hi' ? (place.nameHi || place.name) : place.name);
    const subName = AppState.currentLang === 'en' ? (place.nameMr || place.nameHi || '') : place.name;
    const localizedTiming = place.timing ? (place.timing[AppState.currentLang] || place.timing.en) : '24 Hours';
    const localizedPrice = place.price ? (place.price[AppState.currentLang] || place.price.en) : '';

    // Zone label
    const zoneInfo = NASHIK_ZONES[place.zone] || { name: place.zone };
    const zoneName = AppState.currentLang === 'mr' ? (zoneInfo.nameMr || zoneInfo.name) : (AppState.currentLang === 'hi' ? (zoneInfo.nameHi || zoneInfo.name) : zoneInfo.name);

    // Facilities Chips HTML
    const facilitiesHtml = place.facilities && place.facilities.length > 0 
        ? place.facilities.slice(0, 3).map(f => `<span class="facility-chip">${escapeHtml(f)}</span>`).join('') 
        : '';

    // Navigation Google Maps Link
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

    card.innerHTML = `
        <div>
            <div class="card-top-meta">
                <span class="card-category-tag tag-${place.cat}">
                    <i class="${getCategoryIcon(place.cat)}"></i> ${getCategoryLabel(place.cat)}
                </span>
                <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" title="Save this service">
                    <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
                </button>
            </div>

            <h3 class="service-card-title">${escapeHtml(displayName)}</h3>
            ${subName ? `<div class="service-native-title">${escapeHtml(subName)}</div>` : ''}

            <div class="card-zone-badge">
                <i class="fa-solid fa-location-dot"></i> ${escapeHtml(zoneName)}
            </div>

            <div class="card-dist-row">
                <i class="fa-solid fa-route"></i>
                <span>${place.calculatedDist} ${t.distFromLoc || 'KM away'}</span>
            </div>

            <p class="card-address">
                <i class="fa-solid fa-map-pin"></i>
                <span>${escapeHtml(place.address)}</span>
            </p>

            ${facilitiesHtml ? `<div class="card-facilities">${facilitiesHtml}</div>` : ''}

            <div class="card-extra-info">
                <span class="card-price-tag"><i class="fa-solid fa-tag"></i> ${escapeHtml(localizedPrice || t.freeTag)}</span>
                <span class="card-verified-tag"><i class="fa-solid fa-circle-check"></i> ${t.verifiedTag} ${place.verifiedDate}</span>
            </div>
        </div>

        <div class="card-bottom-actions">
            <div class="card-actions-grid">
                ${place.phone ? `
                    <a href="tel:${place.phone.replace(/[^0-9+]/g, '')}" class="btn-card-action btn-action-call" title="Call ${escapeHtml(place.name)}">
                        <i class="fa-solid fa-phone"></i> ${t.callBtn}
                    </a>
                ` : `
                    <button class="btn-card-action btn-action-call" disabled title="No verified phone">
                        <i class="fa-solid fa-phone-slash"></i> ${t.callBtn}
                    </button>
                `}
                <a href="${navUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-action-nav" title="Navigate on Google Maps">
                    <i class="fa-solid fa-diamond-turn-right"></i> ${t.navBtn}
                </a>
            </div>
            <button class="btn-report-info">
                <i class="fa-solid fa-flag"></i> ${t.reportBtn}
            </button>
        </div>
    `;

    // Safe event listeners (avoids quote-escaping pitfalls)
    const bookmarkBtn = card.querySelector('.card-bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => toggleSave(place.id));
    }

    const reportBtn = card.querySelector('.btn-report-info');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => openReportModal(place.id, displayName));
    }

    return card;
}

// Category icons
function getCategoryIcon(cat) {
    const icons = {
        hospital: "fa-solid fa-hospital",
        ambulance: "fa-solid fa-truck-medical",
        stay: "fa-solid fa-bed",
        food: "fa-solid fa-utensils",
        atm: "fa-solid fa-money-bill-transfer",
        police: "fa-solid fa-shield-halved",
        toilet: "fa-solid fa-restroom",
        water: "fa-solid fa-bottle-water",
        parking: "fa-solid fa-square-parking",
        transport: "fa-solid fa-bus-simple",
        lostfound: "fa-solid fa-person-circle-question",
        tourist: "fa-solid fa-circle-info"
    };
    return icons[cat] || "fa-solid fa-location-dot";
}

// Localized category names
function getCategoryLabel(cat) {
    const t = TRANSLATIONS[AppState.currentLang];
    const catMap = {
        hospital: t.catHospital,
        ambulance: t.catAmbulance,
        stay: t.catStay,
        food: t.catFood,
        atm: t.catAtm,
        police: t.catPolice,
        toilet: t.catToilet,
        water: t.catWater,
        parking: t.catParking,
        transport: t.catTransport,
        lostfound: t.catLostFound,
        tourist: t.catTourist
    };
    return catMap[cat] || cat;
}

// Category tab counters
function updateCategoryBadges() {
    const allPlaces = KumbhStore.getAllPlaces();
    const counts = { all: allPlaces.length };

    allPlaces.forEach(p => {
        counts[p.cat] = (counts[p.cat] || 0) + 1;
    });

    for (let key in counts) {
        const countEl = document.getElementById(`count-${key}`);
        if (countEl) countEl.innerText = counts[key];
    }
}

// 12. BOOKMARKING / SAVED PLACES SYSTEM
function toggleSave(id) {
    const isNowSaved = KumbhStore.toggleSavePlace(id);
    initSavedBadge();
    renderDirectory();
    showToast(isNowSaved ? "🔖 Service bookmarked for quick access!" : "Service removed from bookmarks.");
}

function initSavedBadge() {
    const savedIds = KumbhStore.getSavedPlaceIds();
    const badge = document.getElementById('savedCountBadge');
    if (badge) badge.innerText = savedIds.length;
}

function openSavedDrawer() {
    const drawer = document.getElementById('savedDrawer');
    const container = document.getElementById('savedPlacesList');
    if (!drawer || !container) return;

    const savedIds = KumbhStore.getSavedPlaceIds();
    const allPlaces = KumbhStore.getAllPlaces();
    const savedPlaces = allPlaces.filter(p => savedIds.includes(p.id));

    container.innerHTML = '';
    if (savedPlaces.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b;">No saved services yet. Tap the bookmark icon on any service card to save it here for offline viewing.</div>`;
    } else {
        savedPlaces.forEach(place => {
            const item = document.createElement('div');
            item.className = 'saved-place-item';
            item.innerHTML = `
                <div class="saved-item-info">
                    <h4>${escapeHtml(place.name)}</h4>
                    <p><i class="fa-solid fa-map-pin"></i> ${escapeHtml(place.address)}</p>
                </div>
                <div class="saved-item-actions">
                    ${place.phone ? `<a href="tel:${place.phone}" class="btn-card-action btn-action-call" style="padding:6px 10px;"><i class="fa-solid fa-phone"></i></a>` : ''}
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" target="_blank" class="btn-card-action btn-action-nav" style="padding:6px 10px;"><i class="fa-solid fa-location-arrow"></i></a>
                    <button class="btn-danger-outline-sm btn-delete-saved" title="Remove"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            const deleteBtn = item.querySelector('.btn-delete-saved');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    toggleSave(place.id);
                    openSavedDrawer();
                });
            }
            container.appendChild(item);
        });
    }

    drawer.classList.remove('hidden');
}

function closeSavedDrawer() {
    const drawer = document.getElementById('savedDrawer');
    if (drawer) drawer.classList.add('hidden');
}

function clearAllSaved() {
    if (confirm("Are you sure you want to remove all saved services?")) {
        KumbhStore.clearAllSaved();
        initSavedBadge();
        openSavedDrawer();
        renderDirectory();
        showToast("All saved services cleared.");
    }
}

// 13. QR CODE GENERATION & PRINTABLE A4 POSTER
function detectProtocolForQR() {
    const alertBox = document.getElementById('qrLocalFileAlert');
    const localUrlDisplay = document.getElementById('localUrlDisplay');
    if (window.location.protocol === 'file:') {
        if (alertBox) alertBox.classList.remove('hidden');
        if (localUrlDisplay) localUrlDisplay.innerText = window.location.href.substring(0, 40) + "...";
    }
}

function openQRModal() {
    const modal = document.getElementById('qrModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const select = document.getElementById('qrZoneSelect');
    if (select && AppState.currentZone) {
        select.value = AppState.currentZone;
    }

    generateDynamicQR();
}

function closeQRModal() {
    const modal = document.getElementById('qrModal');
    if (modal) modal.classList.add('hidden');
}

function generateDynamicQR() {
    const select = document.getElementById('qrZoneSelect');
    const zoneVal = select ? select.value : 'all';
    const qrContainer = document.getElementById('qrcode');
    const posterZoneTag = document.getElementById('posterZoneName');
    if (!qrContainer) return;

    // Clear previous QR code elements
    qrContainer.innerHTML = '';

    // Construct Scannable URL
    let targetUrl = '';
    if (window.location.protocol === 'file:') {
        // In local mode, simulate production domain for smartphone testing
        targetUrl = 'https://kumbhsetu-nashik.gov.in/';
        if (zoneVal !== 'all') {
            targetUrl += `?zone=${encodeURIComponent(zoneVal)}`;
        }
    } else {
        const baseUrl = window.location.origin + window.location.pathname;
        targetUrl = zoneVal === 'all' ? baseUrl : `${baseUrl}?zone=${encodeURIComponent(zoneVal)}`;
    }

    // Update Poster Title
    const zoneInfo = NASHIK_ZONES[zoneVal] || { name: "All Nashik" };
    if (posterZoneTag) {
        posterZoneTag.innerText = zoneVal === 'all' ? "All Nashik Pilgrim Portal" : `${zoneInfo.name} Sector Portal`;
    }

    // Safe invocation of QRCode library
    if (typeof QRCode !== 'undefined') {
        AppState.qrCodeInstance = new QRCode(qrContainer, {
            text: targetUrl,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        qrContainer.innerHTML = `<p style="color:#b91c1c; font-size:12px; padding:10px;">QR Library loading... Please check internet connection.</p>`;
    }
}

function printPoster() {
    window.print();
}

function copyCurrentPortalUrl() {
    const select = document.getElementById('qrZoneSelect');
    const zoneVal = select ? select.value : 'all';
    let targetUrl = window.location.protocol === 'file:' 
        ? `https://kumbhsetu-nashik.gov.in/${zoneVal !== 'all' ? '?zone=' + zoneVal : ''}`
        : (zoneVal === 'all' ? window.location.origin + window.location.pathname : `${window.location.origin + window.location.pathname}?zone=${zoneVal}`);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(targetUrl).then(() => {
            showToast("📋 Portal link copied to clipboard!");
        }).catch(() => {
            showToast(`Portal URL: ${targetUrl}`);
        });
    } else {
        prompt("Copy this URL:", targetUrl);
    }
}

// 14. PILGRIM INCORRECT INFORMATION REPORTING
function openReportModal(placeId, placeName) {
    const modal = document.getElementById('reportModal');
    const idInput = document.getElementById('reportPlaceId');
    const nameInput = document.getElementById('reportPlaceName');
    if (!modal) return;

    if (idInput) idInput.value = placeId;
    if (nameInput) nameInput.value = placeName;

    modal.classList.remove('hidden');
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) modal.classList.add('hidden');
}

function submitReport(e) {
    e.preventDefault();
    const placeId = document.getElementById('reportPlaceId').value;
    const placeName = document.getElementById('reportPlaceName').value;
    const reason = document.getElementById('reportReason').value;
    const details = document.getElementById('reportDetails').value;
    const contact = document.getElementById('reporterContact').value;

    const reportObj = {
        id: "rep-" + Date.now(),
        placeId,
        placeName,
        reason,
        details,
        contact: contact || "Anonymous Devotee",
        timestamp: new Date().toLocaleString()
    };

    KumbhStore.addReport(reportObj);
    closeReportModal();
    document.getElementById('reportForm').reset();
    showToast("🙏 Thank you! Your correction report has been registered for administrative review.");
}

// 15. ADMINISTRATOR CMS & CLOUD DATABASE READINESS
function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const isAuthed = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    document.getElementById('adminAuthScreen').classList.toggle('hidden', isAuthed);
    document.getElementById('adminPanelContent').classList.toggle('hidden', !isAuthed);

    if (isAuthed) {
        renderAdminTables();
    }
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.classList.add('hidden');
}

function verifyAdminPasscode() {
    const passcode = document.getElementById('adminPasscode').value;
    // Standard secure client-side demo evaluation key
    if (passcode === 'kumbh2027') {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        document.getElementById('adminAuthScreen').classList.add('hidden');
        document.getElementById('adminPanelContent').classList.remove('hidden');
        renderAdminTables();
        showToast("🔓 Administrator dashboard unlocked!");
    } else {
        showToast("❌ Incorrect passcode. Hint: use 'kumbh2027'");
    }
}

function switchAdminTab(tabKey) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.remove('active'));

    const targetBtn = document.querySelector(`.admin-tab-btn[data-tab="${tabKey}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }

    const tabMap = {
        listings: 'adminTabListings',
        add: 'adminTabAdd',
        reports: 'adminTabReports',
        database: 'adminTabDatabase'
    };

    const targetPane = document.getElementById(tabMap[tabKey]);
    if (targetPane) targetPane.classList.add('active');
}

function renderAdminTables() {
    const places = KumbhStore.getAllPlaces();
    const reports = KumbhStore.getReports();

    document.getElementById('adminListCount').innerText = places.length;
    document.getElementById('adminReportCount').innerText = reports.length;

    // Render Listings Table
    const tbody = document.getElementById('adminTableBody');
    if (tbody) {
        tbody.innerHTML = '';
        places.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code>${escapeHtml(p.id)}</code></td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td><span class="facility-chip">${escapeHtml(p.cat)}</span></td>
                <td>${escapeHtml(p.zone)}</td>
                <td>${escapeHtml(p.phone || 'N/A')}</td>
                <td>
                    <button class="btn-danger-outline-sm btn-admin-del" data-id="${escapeHtml(p.id)}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            const delBtn = tr.querySelector('.btn-admin-del');
            if (delBtn) {
                delBtn.addEventListener('click', () => adminDeletePlace(p.id));
            }
            tbody.appendChild(tr);
        });
    }

    // Render Reports List
    const repContainer = document.getElementById('adminReportsContainer');
    if (repContainer) {
        repContainer.innerHTML = '';
        if (reports.length === 0) {
            repContainer.innerHTML = '<p style="color:#64748b; padding:10px 0;">No active user error reports at this time.</p>';
        } else {
            reports.forEach(r => {
                const item = document.createElement('div');
                item.className = 'saved-place-item';
                item.style.marginBottom = '10px';
                item.innerHTML = `
                    <div class="saved-item-info">
                        <h4>${escapeHtml(r.placeName)} - <span style="color:#b91c1c;">${escapeHtml(r.reason)}</span></h4>
                        <p>${escapeHtml(r.details)}</p>
                        <small style="color:#94a3b8;">Reported by: ${escapeHtml(r.contact)} on ${r.timestamp}</small>
                    </div>
                `;
                repContainer.appendChild(item);
            });
        }
    }
}

function handleAdminAddService(e) {
    e.preventDefault();
    const name = document.getElementById('newPlaceName').value.trim();
    const nameMr = document.getElementById('newPlaceNameMr').value.trim();
    const cat = document.getElementById('newPlaceCategory').value;
    const zone = document.getElementById('newPlaceZone').value;
    const priceVal = document.getElementById('newPlacePrice').value;
    const phone = document.getElementById('newPlacePhone').value.trim();
    const timing = document.getElementById('newPlaceTiming').value.trim() || '24/7';
    const lat = parseFloat(document.getElementById('newPlaceLat').value);
    const lng = parseFloat(document.getElementById('newPlaceLng').value);
    const address = document.getElementById('newPlaceAddress').value.trim();
    const facilitiesRaw = document.getElementById('newPlaceFacilities').value.trim();

    const facilities = facilitiesRaw ? facilitiesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    const newPlace = {
        id: "svc-" + Date.now(),
        name,
        nameMr: nameMr || name,
        nameHi: name,
        cat,
        zone,
        lat,
        lng,
        address,
        phone: phone || "1800-233-0011",
        timing: { en: timing, mr: timing, hi: timing },
        price: { en: priceVal, mr: priceVal, hi: priceVal },
        isFree: priceVal.includes("Free"),
        isBudget: true,
        verifiedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        facilities,
        desc: { en: `Essential service listing for ${name}`, mr: `${name} साठी आवश्यक सेवा`, hi: `${name} के लिए आवश्यक सेवा` }
    };

    KumbhStore.addPlace(newPlace);
    document.getElementById('addServiceForm').reset();
    renderAdminTables();
    renderDirectory();
    updateCategoryBadges();
    showToast("✅ New essential service listing added to database!");
    switchAdminTab('listings');
}

function adminDeletePlace(id) {
    if (confirm("Are you sure you want to remove this service from KumbhSetu?")) {
        KumbhStore.deletePlace(id);
        renderAdminTables();
        renderDirectory();
        updateCategoryBadges();
        showToast("Service listing removed.");
    }
}

function resetDatabaseToDefault() {
    if (confirm("Reset service directory back to standard Nashik Kumbh demonstration entries?")) {
        KumbhStore.resetToDefault();
        renderAdminTables();
        renderDirectory();
        updateCategoryBadges();
        showToast("Database reset to verified sample data.");
    }
}

function clearAllReports() {
    if (confirm("Clear all pilgrim feedback reports?")) {
        KumbhStore.clearReports();
        renderAdminTables();
        showToast("All feedback reports cleared.");
    }
}

function exportDataAsJSON() {
    const data = KumbhStore.getAllPlaces();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "kumbhsetu_nashik_services.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("📁 Database exported as JSON file.");
}

function printSchemaInfo() {
    alert("KumbhSetu is pre-architected for Firebase Firestore or Supabase.\n\nSee README.md for connection credentials guide and Cloud Security Rules.");
}

// 16. MOBILE BOTTOM NAV & SCROLL HELPERS
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToCategories() {
    const el = document.getElementById('mainDirectory');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function scrollToEmergency() {
    const el = document.getElementById('emergencySection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// 17. UTILITY FUNCTIONS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let toastTimer = null;
function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${escapeHtml(msg)}</span>`;
    toast.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}
