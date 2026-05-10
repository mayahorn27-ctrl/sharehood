export const CATEGORIES = ["הכל", "כלי עבודה", "מחנאות", "מטבח", "אירוח", "ספורט", "גינה", "גיימינג"];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "מקדחה מקצועית מקיטה",
    price: 40,
    rating: 4.8,
    reviews: 12,
    category: "כלי עבודה",
    location: "200 מ' ממך",
    description: "מקדחה חזקה ואמינה, מתאימה לכל עבודות הבית. כולל סט מקדחים בסיסי. קלה לתפעול ונוחה לאחיזה.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "ישראל ישראלי",
      responseTime: "פחות משעה",
      joined: "מאי 2023",
      image: "https://i.pravatar.cc/150?u=israel"
    },
    reviewsList: [
      { id: 1, user: "רון לביא", rating: 5, date: "לפני שבועיים", comment: "מקדחה מצוינת, עשתה את העבודה בקלות. ישראל היה מאוד נחמד וגמיש בזמנים." },
      { id: 2, user: "מיכל שרון", rating: 4, date: "לפני חודש", comment: "אחלה מכשיר, הגיע עם כל החלקים. היה קצת אבק אבל לא נורא." }
    ]
  },
  {
    id: 2,
    name: "אוהל 4 אנשים - פתיחה מהירה",
    price: 60,
    rating: 4.9,
    reviews: 8,
    category: "מחנאות",
    location: "500 מ' ממך",
    description: "אוהל בן-רגע ל-4 אנשים, מושלם לקמפינג משפחתי. הקמה תוך 60 שניות. עמיד בגשם ורוח.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "מיכל כהן",
      responseTime: "שעתיים",
      joined: "אוגוסט 2022",
      image: "https://i.pravatar.cc/150?u=michal"
    },
    reviewsList: [
      { id: 1, user: "דודו אהרון", rating: 5, date: "לפני 3 ימים", comment: "האוהל הכי נוח שהיה לי! נפתח באמת תוך דקה. נקי ומסודר." },
      { id: 2, user: "יעל שלביה", rating: 5, date: "לפני שבועיים", comment: "שירות מעולה של מיכל. האוהל היה במצב חדש." }
    ]
  },
  {
    id: 3,
    name: "מיקסר קיטשן אייד - אדום",
    price: 55,
    rating: 4.7,
    reviews: 15,
    category: "מטבח",
    location: "1.2 ק\"מ ממך",
    description: "המיקסר הקלאסי והחזק של KitchenAid. מגיע עם וו לישה, מקצף ואביזר גיטרה. אידיאלי לאפייה מקצועית.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "יוסי לוי",
      responseTime: "30 דקות",
      joined: "ינואר 2024",
      image: "https://i.pravatar.cc/150?u=yossi"
    },
    reviewsList: [
      { id: 1, user: "נועה קירל", rating: 5, date: "לפני שבוע", comment: "הכנתי איתו עוגות לכל המשפחה. עובד כמו סוס. יוסי מקסים!" }
    ]
  },
  {
    id: 4,
    name: "מקרן קולנוע ביתי 4K",
    price: 80,
    rating: 5.0,
    reviews: 5,
    category: "אירוח",
    location: "800 מ' ממך",
    description: "מקרן 4K איכותי לחוויית קולנוע ביתית מושלמת. בהירות גבוהה וחיבור פשוט לכל מכשיר. כולל מסך הקרנה מתקפל.",
    image: "/mini-projector.png",
    lender: {
      name: "דנה אברהם",
      responseTime: "שעה",
      joined: "מרץ 2023",
      image: "https://i.pravatar.cc/150?u=dana"
    },
    reviewsList: [
      { id: 1, user: "סטטיק", rating: 5, date: "אתמול", comment: "וואו! איכות מטורפת. המקרן קטן וקומפקטי אבל התמונה ענקית וחדה." },
      { id: 2, user: "בן אל", rating: 5, date: "לפני שבוע", comment: "סגר לנו פינה לערב סרט עם החבר'ה. דנה הייתה סופר נחמדה." }
    ]
  },
  {
    id: 5,
    name: "סט כלי עבודה חשמליים",
    price: 120,
    rating: 4.6,
    reviews: 20,
    category: "כלי עבודה",
    location: "1.5 ק\"מ ממך",
    description: "סט מקיף הכולל מברגה, משחזת זווית ומסור אנכי. הכל מופעל על סוללות נטענות (כלולות).",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "רוני גבאי",
      responseTime: "4 שעות",
      joined: "יוני 2021",
      image: "https://i.pravatar.cc/150?u=roni"
    },
    reviewsList: [
      { id: 1, user: "עומר אדם", rating: 4, date: "לפני חודש", comment: "סט מעולה לשיפוץ. הסוללות מחזיקות המון זמן." }
    ]
  },
  {
    id: 6,
    name: "שק שינה לטמפרטורות קיצון",
    price: 30,
    rating: 4.5,
    reviews: 3,
    category: "מחנאות",
    location: "2.1 ק\"מ ממך",
    description: "שק שינה איכותי המתאים לטמפרטורות של עד -5 מעלות. קל משקל ונוח לנשיאה.",
    image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "עומר שטרן",
      responseTime: "שעתיים",
      joined: "דצמבר 2023",
      image: "https://i.pravatar.cc/150?u=omer"
    },
    reviewsList: [
      { id: 1, user: "עדן בן זקן", rating: 5, date: "לפני שבועיים", comment: "היה לי חם ונעים כל הלילה בחרמון. מומלץ!" }
    ]
  },
  {
    id: 7,
    name: "מכונת קפה אספרסו",
    price: 45,
    rating: 4.9,
    reviews: 25,
    category: "מטבח",
    location: "900 מ' ממך",
    description: "מכונת אספרסו ביתית המפיקה קפה באיכות בית קפה. כולל מקציף חלב מובנה.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "ליאת פז",
      responseTime: "פחות משעה",
      joined: "פברואר 2022",
      image: "https://i.pravatar.cc/150?u=liat"
    },
    reviewsList: [
      { id: 1, user: "מרגי", rating: 5, date: "לפני 5 ימים", comment: "קפה מושלם. המכונה נקייה ופשוטה לשימוש." }
    ]
  },
  {
    id: 8,
    name: "כיסאות מתקפלים לאירוח",
    price: 15,
    rating: 4.3,
    reviews: 30,
    category: "אירוח",
    location: "400 מ' ממך",
    description: "סט של 10 כיסאות מתקפלים חזקים ונוחים. מושלם לאירועים בחצר או בבית.",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "אביב משה",
      responseTime: "5 שעות",
      joined: "אוקטובר 2023",
      image: "https://i.pravatar.cc/150?u=aviv"
    },
    reviewsList: [
      { id: 1, user: "אנה זק", rating: 4, date: "לפני שבוע", comment: "כיסאות נוחים, עשו את העבודה במסיבת יום הולדת." }
    ]
  },
  {
    id: 9,
    name: "אופני הרים מקצועיות",
    price: 70,
    rating: 4.7,
    reviews: 7,
    category: "ספורט",
    location: "3.2 ק\"מ ממך",
    description: "אופני שיכוך מלא למסלולים טכניים. שלדת אלומיניום קלה ומערכת הילוכים מתקדמת.",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "עידן רייכל",
      responseTime: "שעתיים",
      joined: "ספטמבר 2022",
      image: "https://i.pravatar.cc/150?u=idan"
    },
    reviewsList: [
      { id: 1, user: "טדי נגוסה", rating: 5, date: "לפני שבועיים", comment: "אופניים מטורפים, נהניתי מכל רגע במסלול." }
    ]
  },
  {
    id: 10,
    name: "מסור חשמלי לגינה",
    price: 50,
    rating: 4.4,
    reviews: 4,
    category: "גינה",
    location: "1.8 ק\"מ ממך",
    description: "מסור שרשרת חשמלי חזק לגיזום עצים ועבודות גינה. בטיחותי וקל לשימוש.",
    image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=800",
    lender: {
      name: "גדי וילצ'רסקי",
      responseTime: "יום",
      joined: "יולי 2023",
      image: "https://i.pravatar.cc/150?u=gadi"
    },
    reviewsList: [
      { id: 1, user: "רביד פלוטניק", rating: 5, date: "לפני חודש", comment: "מסור חזק מאוד. גדי הסביר לי הכל בסבלנות." }
    ]
  }
];

