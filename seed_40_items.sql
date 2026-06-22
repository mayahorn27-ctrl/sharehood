-- Create 10 deterministic UUIDs for our mock users
DO $$
DECLARE
  u1 uuid := '11111111-1111-1111-1111-111111111111';
  u2 uuid := '22222222-2222-2222-2222-222222222222';
  u3 uuid := '33333333-3333-3333-3333-333333333333';
  u4 uuid := '44444444-4444-4444-4444-444444444444';
  u5 uuid := '55555555-5555-5555-5555-555555555555';
  u6 uuid := '66666666-6666-6666-6666-666666666666';
  u7 uuid := '77777777-7777-7777-7777-777777777777';
  u8 uuid := '88888888-8888-8888-8888-888888888888';
  u9 uuid := '99999999-9999-9999-9999-999999999999';
  u10 uuid := '00000000-0000-0000-0000-000000000010';
BEGIN
  -- 1. Insert into auth.users (this will fire our trigger to create public.users)
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, is_super_admin)
  VALUES 
  (u1, '00000000-0000-0000-0000-000000000000', 'israel@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"ישראל ישראלי"}', now(), now(), 'authenticated', false),
  (u2, '00000000-0000-0000-0000-000000000000', 'michal@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"מיכל כהן"}', now(), now(), 'authenticated', false),
  (u3, '00000000-0000-0000-0000-000000000000', 'yossi@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"יוסי לוי"}', now(), now(), 'authenticated', false),
  (u4, '00000000-0000-0000-0000-000000000000', 'dana@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"דנה אברהם"}', now(), now(), 'authenticated', false),
  (u5, '00000000-0000-0000-0000-000000000000', 'roni@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"רוני גבאי"}', now(), now(), 'authenticated', false),
  (u6, '00000000-0000-0000-0000-000000000000', 'omer@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"עומר שטרן"}', now(), now(), 'authenticated', false),
  (u7, '00000000-0000-0000-0000-000000000000', 'liat@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"ליאת פז"}', now(), now(), 'authenticated', false),
  (u8, '00000000-0000-0000-0000-000000000000', 'aviv@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"אביב משה"}', now(), now(), 'authenticated', false),
  (u9, '00000000-0000-0000-0000-000000000000', 'idan@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"עידן רייכל"}', now(), now(), 'authenticated', false),
  (u10, '00000000-0000-0000-0000-000000000000', 'gadi@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"גדי וילצ''רסקי"}', now(), now(), 'authenticated', false)
  ON CONFLICT (id) DO NOTHING;

  -- 2. Update the public.users with their phone numbers and specific response times
  UPDATE public.users SET phone = '050-1111111', location = 'תל אביב' WHERE id = u1;
  UPDATE public.users SET phone = '050-2222222', location = 'גבעתיים' WHERE id = u2;
  UPDATE public.users SET phone = '050-3333333', location = 'רמת גן' WHERE id = u3;
  UPDATE public.users SET phone = '050-4444444', location = 'הרצליה' WHERE id = u4;
  UPDATE public.users SET phone = '050-5555555', location = 'חולון' WHERE id = u5;
  UPDATE public.users SET phone = '050-6666666', location = 'ראשון לציון' WHERE id = u6;
  UPDATE public.users SET phone = '050-7777777', location = 'רעננה' WHERE id = u7;
  UPDATE public.users SET phone = '050-8888888', location = 'פתח תקווה' WHERE id = u8;
  UPDATE public.users SET phone = '050-9999999', location = 'כפר סבא' WHERE id = u9;
  UPDATE public.users SET phone = '050-1010101', location = 'חיפה' WHERE id = u10;

  -- 3. Delete existing products to avoid duplicates or messy DB
  DELETE FROM public.products;

  -- 4. Insert 40 diverse products assigned to our users
  INSERT INTO public.products (name, price, rating, reviews, category, location, description, image, lender_id, lender_name, lender_response_time, lender_joined, lender_image)
  VALUES
  -- כלי עבודה
  ('מקדחה מקצועית מקיטה', 40, 4.8, 12, 'כלי עבודה', 'תל אביב', 'מקדחה חזקה ואמינה, מתאימה לכל עבודות הבית.', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', u1, 'ישראל ישראלי', 'פחות משעה', 'מאי 2023', 'https://ui-avatars.com/api/?name=ישראל+ישראלי'),
  ('סט מברגות נטענות', 60, 4.9, 8, 'כלי עבודה', 'גבעתיים', 'סט מושלם לעבודות עץ וברזל.', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800', u2, 'מיכל כהן', 'שעתיים', 'אוגוסט 2022', 'https://ui-avatars.com/api/?name=מיכל+כהן'),
  ('משחזת זווית 4.5 אינץ', 35, 4.5, 3, 'כלי עבודה', 'רמת גן', 'משחזת לחיתוך מהיר, קלה לאחיזה.', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800', u3, 'יוסי לוי', '30 דקות', 'ינואר 2024', 'https://ui-avatars.com/api/?name=יוסי+לוי'),
  ('מסור עגול 1500W', 80, 5.0, 5, 'כלי עבודה', 'הרצליה', 'מסור עוצמתי לעץ, כולל להב נוסף.', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', u4, 'דנה אברהם', 'שעה', 'מרץ 2023', 'https://ui-avatars.com/api/?name=דנה+אברהם'),
  ('פטישון חציבה', 90, 4.7, 15, 'כלי עבודה', 'חולון', 'חזק במיוחד לקידוח בבטון וקירות תמך.', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800', u5, 'רוני גבאי', '4 שעות', 'יוני 2021', 'https://ui-avatars.com/api/?name=רוני+גבאי'),
  
  -- מחנאות
  ('אוהל 4 אנשים', 50, 4.9, 20, 'מחנאות', 'ראשון לציון', 'אוהל פתיחה מהירה במצב חדש לגמרי.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800', u6, 'עומר שטרן', 'שעתיים', 'דצמבר 2023', 'https://ui-avatars.com/api/?name=עומר+שטרן'),
  ('גזיית שטח מקצועית', 25, 4.6, 7, 'מחנאות', 'רעננה', 'גזייה עמידה לרוחות, כולל פינג''אן מתנה.', 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800', u7, 'ליאת פז', 'פחות משעה', 'פברואר 2022', 'https://ui-avatars.com/api/?name=ליאת+פז'),
  ('שק שינה 5- מעלות', 30, 4.8, 11, 'מחנאות', 'פתח תקווה', 'מושלם לקמפינג ברמת הגולן.', 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&q=80&w=800', u8, 'אביב משה', '5 שעות', 'אוקטובר 2023', 'https://ui-avatars.com/api/?name=אביב+משה'),
  ('צידנית 40 ליטר עם גלגלים', 40, 4.4, 6, 'מחנאות', 'כפר סבא', 'שומרת על קור עד 3 ימים. נוחה במיוחד.', 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800', u9, 'עידן רייכל', 'שעתיים', 'ספטמבר 2022', 'https://ui-avatars.com/api/?name=עידן+רייכל'),
  ('ערסל זוגי', 20, 5.0, 4, 'מחנאות', 'חיפה', 'קל משקל ומגיע עם רצועות קשירה לעצים.', 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800', u10, 'גדי וילצ''רסקי', 'יום', 'יולי 2023', 'https://ui-avatars.com/api/?name=גדי'),
  
  -- מטבח
  ('מיקסר קיטשן אייד אדום', 80, 4.9, 32, 'מטבח', 'תל אביב', 'המיקסר האייקוני לאפייה מקצועית בבית.', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800', u1, 'ישראל ישראלי', 'פחות משעה', 'מאי 2023', 'https://ui-avatars.com/api/?name=ישראל+ישראלי'),
  ('מכונת פסטה איטלקית', 35, 4.3, 9, 'מטבח', 'רמת גן', 'הכנת פסטה טרייה בקלות.', 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800', u3, 'יוסי לוי', '30 דקות', 'ינואר 2024', 'https://ui-avatars.com/api/?name=יוסי+לוי'),
  ('מעשנת בשר קומפקטית', 100, 4.7, 14, 'מטבח', 'חולון', 'מושלם לעישון בריסקט ואסאדו במרפסת.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', u5, 'רוני גבאי', '4 שעות', 'יוני 2021', 'https://ui-avatars.com/api/?name=רוני+גבאי'),
  ('טאבון פיצה גז Ooni', 120, 5.0, 22, 'מטבח', 'רעננה', 'פיצה מדהימה תוך 60 שניות. מגיע עם בלון גז קטן.', 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800', u7, 'ליאת פז', 'פחות משעה', 'פברואר 2022', 'https://ui-avatars.com/api/?name=ליאת+פז'),
  ('מכונת גלידה ביתית', 45, 4.6, 5, 'מטבח', 'כפר סבא', 'מכינה גלידה מעולה וסורבה מירות טריים.', 'https://images.unsplash.com/photo-1570197781417-0a82375c9371?auto=format&fit=crop&q=80&w=800', u9, 'עידן רייכל', 'שעתיים', 'ספטמבר 2022', 'https://ui-avatars.com/api/?name=עידן+רייכל'),

  -- אירוח
  ('מקרן קולנוע ביתי 4K', 80, 5.0, 18, 'אירוח', 'גבעתיים', 'צפייה בסרטים באיכות קולנוע. כולל חצובה.', 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800', u2, 'מיכל כהן', 'שעתיים', 'אוגוסט 2022', 'https://ui-avatars.com/api/?name=מיכל+כהן'),
  ('מכונת צמר גפן מתוק', 40, 4.8, 25, 'אירוח', 'הרצליה', 'אטרקציה מדהימה לימי הולדת.', 'https://images.unsplash.com/photo-1574856344991-afa31b463283?auto=format&fit=crop&q=80&w=800', u4, 'דנה אברהם', 'שעה', 'מרץ 2023', 'https://ui-avatars.com/api/?name=דנה+אברהם'),
  ('10 כיסאות פלסטיק מתקפלים', 30, 4.5, 40, 'אירוח', 'ראשון לציון', 'כיסאות חזקים, נוחים לאירוח של כמות אנשים.', 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=800', u6, 'עומר שטרן', 'שעתיים', 'דצמבר 2023', 'https://ui-avatars.com/api/?name=עומר+שטרן'),
  ('שולחן מתקפל 1.8 מטר', 25, 4.4, 15, 'אירוח', 'פתח תקווה', 'אידיאלי לבופה או לישיבה של 8 אנשים.', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800', u8, 'אביב משה', '5 שעות', 'אוקטובר 2023', 'https://ui-avatars.com/api/?name=אביב+משה'),
  ('רמקול מסיבות עם קריוקי JBL', 150, 4.9, 10, 'אירוח', 'חיפה', 'רמקול מפלצתי עם סאונד מדהים ושני מיקרופונים.', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', u10, 'גדי וילצ''רסקי', 'יום', 'יולי 2023', 'https://ui-avatars.com/api/?name=גדי'),

  -- ספורט
  ('אופני הרים מקצועיות Trek', 90, 4.7, 8, 'ספורט', 'תל אביב', 'מידה M. כולל קסדה ומנשא מים.', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800', u1, 'ישראל ישראלי', 'פחות משעה', 'מאי 2023', 'https://ui-avatars.com/api/?name=ישראל+ישראלי'),
  ('גלשן סופט 7 פיט', 50, 4.6, 12, 'ספורט', 'הרצליה', 'מעולה למתחילים, מצב כמו חדש.', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800', u4, 'דנה אברהם', 'שעה', 'מרץ 2023', 'https://ui-avatars.com/api/?name=דנה+אברהם'),
  ('אוהל גג לרכב מחנאות', 200, 5.0, 3, 'ספורט', 'רמת גן', 'אוהל איכותי שמתחבר לגגון הרכב לחוויית קמפינג מושלמת.', 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800', u3, 'יוסי לוי', '30 דקות', 'ינואר 2024', 'https://ui-avatars.com/api/?name=יוסי+לוי'),
  ('סט משקולות מתכוונן (עד 24 ק"ג)', 35, 4.8, 22, 'ספורט', 'חולון', 'אימון כוח מלא בבית בלי לתפוס מקום.', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800', u5, 'רוני גבאי', '4 שעות', 'יוני 2021', 'https://ui-avatars.com/api/?name=רוני+גבאי'),
  ('סאפ מתנפח מלא', 60, 4.9, 14, 'ספורט', 'חיפה', 'סאפ יציב הכולל משוט, ליש ומשאבה כפולה.', 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80&w=800', u10, 'גדי וילצ''רסקי', 'יום', 'יולי 2023', 'https://ui-avatars.com/api/?name=גדי'),

  -- גינה
  ('מכסחת דשא חשמלית', 45, 4.4, 9, 'גינה', 'רעננה', 'מכסחת קלה ושקטה לגינות בינוניות.', 'https://images.unsplash.com/photo-1592424001806-03f6f9fc53ce?auto=format&fit=crop&q=80&w=800', u7, 'ליאת פז', 'פחות משעה', 'פברואר 2022', 'https://ui-avatars.com/api/?name=ליאת+פז'),
  ('מפוח עלים נטען', 35, 4.5, 6, 'גינה', 'כפר סבא', 'מנקה את החצר בשניות, סוללה חזקה.', 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=800', u9, 'עידן רייכל', 'שעתיים', 'ספטמבר 2022', 'https://ui-avatars.com/api/?name=עידן+רייכל'),
  ('מסור שרשרת', 50, 4.7, 4, 'גינה', 'ראשון לציון', 'לחיתוך ענפים עבים. מגיע עם שמן לשרשרת.', 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=800', u6, 'עומר שטרן', 'שעתיים', 'דצמבר 2023', 'https://ui-avatars.com/api/?name=עומר+שטרן'),
  ('חרמש מוטורי', 55, 4.6, 7, 'גינה', 'פתח תקווה', 'חרמש מקצועי לניקוי עשביה קשה.', 'https://images.unsplash.com/photo-1592424001806-03f6f9fc53ce?auto=format&fit=crop&q=80&w=800', u8, 'אביב משה', '5 שעות', 'אוקטובר 2023', 'https://ui-avatars.com/api/?name=אביב+משה'),
  ('מנגל פחמים גדול', 40, 4.3, 16, 'גינה', 'גבעתיים', 'מנגל רחב לפריסת בשרים נוחה.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', u2, 'מיכל כהן', 'שעתיים', 'אוגוסט 2022', 'https://ui-avatars.com/api/?name=מיכל+כהן'),

  -- גיימינג
  ('פלייסטיישן 5 עם 2 שלטים', 100, 5.0, 28, 'גיימינג', 'תל אביב', 'קונסולה מושלמת עם משחקים מותקנים כמו פיפא 24.', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800', u1, 'ישראל ישראלי', 'פחות משעה', 'מאי 2023', 'https://ui-avatars.com/api/?name=ישראל+ישראלי'),
  ('ערכת מציאות מדומה Oculus Quest 2', 90, 4.9, 15, 'גיימינג', 'רמת גן', 'חוויה מטורפת! המון משחקים, אין צורך במחשב.', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800', u3, 'יוסי לוי', '30 דקות', 'ינואר 2024', 'https://ui-avatars.com/api/?name=יוסי+לוי'),
  ('הגה מרוצים G29 + דוושות', 70, 4.8, 12, 'גיימינג', 'רעננה', 'מתאים ל-PC ופלייסטיישן. חוויית נהיגה מציאותית.', 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=800', u7, 'ליאת פז', 'פחות משעה', 'פברואר 2022', 'https://ui-avatars.com/api/?name=ליאת+פז'),
  ('קונסולת Nintendo Switch', 60, 4.7, 19, 'גיימינג', 'חולון', 'ניידת ומדהימה למשפחה. מגיעה עם זלדה ומריו.', 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?auto=format&fit=crop&q=80&w=800', u5, 'רוני גבאי', '4 שעות', 'יוני 2021', 'https://ui-avatars.com/api/?name=רוני+גבאי'),
  ('מקרן גיימינג 120Hz', 120, 5.0, 4, 'גיימינג', 'חיפה', 'צפייה במשחקים על מסך ענק עם זמן תגובה אפסי.', 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800', u10, 'גדי וילצ''רסקי', 'יום', 'יולי 2023', 'https://ui-avatars.com/api/?name=גדי'),

  -- תינוקות
  ('עגלת Yoyo טיולון', 40, 4.9, 35, 'תינוקות', 'גבעתיים', 'העגלה המושלמת לטיסות. קלה בטירוף ונקייה.', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', u2, 'מיכל כהן', 'שעתיים', 'אוגוסט 2022', 'https://ui-avatars.com/api/?name=מיכל+כהן'),
  ('טרמפולינה לתינוק בייבי ביורן', 30, 4.8, 20, 'תינוקות', 'ראשון לציון', 'מצילה חיים לאמהות טריות. כיסוי כובס.', 'https://images.unsplash.com/photo-1522771730849-ce458c028593?auto=format&fit=crop&q=80&w=800', u6, 'עומר שטרן', 'שעתיים', 'דצמבר 2023', 'https://ui-avatars.com/api/?name=עומר+שטרן'),
  ('כסא בטיחות סייבקס', 50, 4.9, 12, 'תינוקות', 'פתח תקווה', 'כיסא בטיחותי מאוד, מתאים מלידה ועד 18 ק"ג.', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', u8, 'אביב משה', '5 שעות', 'אוקטובר 2023', 'https://ui-avatars.com/api/?name=אביב+משה'),
  ('לול קמפינג מתקפל', 25, 4.6, 17, 'תינוקות', 'כפר סבא', 'מעולה לסופי שבוע אצל סבא וסבתא.', 'https://images.unsplash.com/photo-1522771730849-ce458c028593?auto=format&fit=crop&q=80&w=800', u9, 'עידן רייכל', 'שעתיים', 'ספטמבר 2022', 'https://ui-avatars.com/api/?name=עידן+רייכל'),
  ('משאבת חלב מדלה פריסטייל', 45, 4.7, 10, 'תינוקות', 'הרצליה', 'דו צדדית נטענת, מגיעה מעוקרת ונקייה.', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', u4, 'דנה אברהם', 'שעה', 'מרץ 2023', 'https://ui-avatars.com/api/?name=דנה+אברהם');

END $$;
