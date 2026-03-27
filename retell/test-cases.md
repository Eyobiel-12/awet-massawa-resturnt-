# Massawa Retell Agent - Test Cases

## Test Case 1: Successful Reservation (Happy Path)
**Scenario:** Valid reservation for 4 people on Tuesday at 19:00

**User Input Flow:**
1. Agent: "Goedendag, welkom bij Massawa..."
   - User: "Hallo, ik wil graag reserveren"
2. Agent: "Op welke naam mag ik de reservering noteren?"
   - User: "Jan de Vries"
3. Agent: "Mag ik uw e-mailadres voor de bevestiging?"
   - User: "jan.devries@example.com"
4. Agent: "Mag ik uw telefoonnummer zodat we u kunnen bereiken?"
   - User: "+31612345678"
5. Agent: "Voor hoeveel personen mag ik de tafel reserveren?"
   - User: "4 personen"
6. Agent: "Op welke datum wilt u graag komen dineren?"
   - User: "Volgende week dinsdag" (or "2025-12-02")
7. Agent: "Welke tijd tussen 17:00 en 21:30 heeft u in gedachten?"
   - User: "19:00"
8. Agent: "Zijn er speciale verzoeken of allergieën waar we rekening mee moeten houden?"
   - User: "Nee, dat is alles"

**Expected Result:**
- Status: `confirmed`
- Message: "Dank u wel, ik heb uw tafel vastgelegd. U ontvangt een bevestiging per e-mail via ons systeem."
- Reservation saved in Supabase with email: jan.devries@example.com

---

## Test Case 2: Party Size > 10 (Handoff)
**Scenario:** User wants to book for 12 people

**User Input Flow:**
1-4. Same as Test Case 1 (name, email, phone)
5. Agent: "Voor hoeveel personen mag ik de tafel reserveren?"
   - User: "12 personen"

**Expected Result:**
- Agent: "Voor groepen groter dan tien personen helpt ons team u graag persoonlijk via +31 6 24834382. Zal ik u doorverbinden of liever het nummer toesturen?"
- No webhook call (handoff before booking)

---

## Test Case 3: Monday Booking (Rejection)
**Scenario:** User tries to book on Monday

**User Input Flow:**
1-5. Same as Test Case 1 (name, email, phone, party size)
6. Agent: "Op welke datum wilt u graag komen dineren?"
   - User: "Maandag" or "2025-12-01"

**Expected Result:**
- Agent: "Massawa is op maandag gesloten. Kies alstublieft een dag tussen dinsdag en zondag."
- Agent loops back to date question
- User provides valid day (Tuesday-Sunday)

---

## Test Case 4: Time Outside Hours (Rejection)
**Scenario:** User wants to book at 16:00 (too early)

**User Input Flow:**
1-6. Same as Test Case 1 (name, email, phone, party size, valid date)
7. Agent: "Welke tijd tussen 17:00 en 21:30 heeft u in gedachten?"
   - User: "16:00"

**Expected Result:**
- Agent: "We nemen reserveringen aan tussen 17:00 en 21:30. Zal ik samen met u een tijd binnen dit venster kiezen?"
- Agent loops back to time question
- User provides valid time (17:00-21:30)

---

## Test Case 5: Time Too Late (Rejection)
**Scenario:** User wants to book at 22:00 (too late)

**User Input Flow:**
1-6. Same as Test Case 1
7. Agent: "Welke tijd tussen 17:00 en 21:30 heeft u in gedachten?"
   - User: "22:00"

**Expected Result:**
- Same as Test Case 4 (time validation loop)

---

## Test Case 6: Past Date (Rejection)
**Scenario:** User tries to book for yesterday

**User Input Flow:**
1-5. Same as Test Case 1
6. Agent: "Op welke datum wilt u graag komen dineren?"
   - User: "Gisteren" or past date

**Expected Result:**
- Webhook returns: `status: "past_date"`, `message: "Reserveren kan alleen voor toekomstige datums."`
- Agent reads message and asks for new date

---

## Test Case 7: Full Time Slot (Capacity Check)
**Scenario:** All 10 tables already booked for that time slot

**User Input Flow:**
1-7. Same as Test Case 1 (all valid inputs)
8. Function node calls webhook

**Expected Result:**
- Webhook returns: `status: "full"`, `message: "Dat tijdslot is volgeboekt. Zal ik een ander tijdstip of dag voorstellen?"`
- Agent reads message and offers alternative time/date

---

## Test Case 8: No Email Provided
**Scenario:** User doesn't want to give email

**User Input Flow:**
1-2. Same as Test Case 1 (name)
3. Agent: "Mag ik uw e-mailadres voor de bevestiging?"
   - User: "Nee, liever niet" or "Dat hoeft niet"

**Expected Result:**
- Email variable is empty or set to fallback
- Reservation saved with fallback email: `voice-agent@massawa-habesha.nl` or `RETELL_FALLBACK_EMAIL`
- Message field includes: "Geen e-mailadres opgegeven; bevestig telefonisch."
- Admin panel can confirm via phone

---

## Test Case 9: Special Requests
**Scenario:** User has dietary requirements

**User Input Flow:**
1-7. Same as Test Case 1
8. Agent: "Zijn er speciale verzoeken of allergieën waar we rekening mee moeten houden?"
   - User: "Ja, ik ben vegetarisch en heb een notenallergie"

**Expected Result:**
- `special_requests` saved in Supabase
- Message field includes: "Speciale verzoeken: vegetarisch, notenallergie"
- Admin panel sees special requests

---

## Test Case 10: Language Switch (Dutch → English)
**Scenario:** User struggles with Dutch

**User Input Flow:**
1. Agent: "Goedendag, welkom bij Massawa..."
   - User: "Hello, can you speak English?"
2. Agent: (after 2 unclear Dutch interactions)
   - Agent: "Het lijkt erop dat we elkaar niet helemaal begrijpen. Zal ik in het Engels verdergaan?"
   - User: "Yes please"

**Expected Result:**
- Agent switches to English
- Continues booking flow in English
- All fields collected in English
- Webhook receives `language: "en-US"`

---

## Test Case 11: Invalid Phone Number Format
**Scenario:** User provides unclear phone number

**User Input Flow:**
1-2. Same as Test Case 1 (name, email)
3. Agent: "Mag ik uw telefoonnummer zodat we u kunnen bereiken?"
   - User: "Mijn nummer is..." (unclear)

**Expected Result:**
- Agent: "Sorry, ik heb het nummer niet helemaal gehoord. Kunt u het nogmaals noemen?"
- Agent retries until valid phone number collected

---

## Test Case 12: Complete Flow with All Validations
**Scenario:** Full end-to-end test with all valid inputs

**User Input:**
- Name: "Maria van der Berg"
- Email: "maria.vandenberg@example.com"
- Phone: "+31698765432"
- Party Size: 6
- Date: "2025-12-05" (Friday)
- Time: "20:00"
- Special Requests: "Verjaardag, graag een taart"

**Expected Result:**
- All validations pass
- Webhook returns: `status: "confirmed"`
- Reservation ID generated
- Agent: "Dank u wel, ik heb uw tafel vastgelegd. U ontvangt een bevestiging per e-mail via ons systeem."
- Reservation appears in admin panel with `[Voice Agent]` tag
- Email confirmation sent automatically from admin panel

---

## Test Checklist

### Pre-Test Setup
- [ ] Retell agent published
- [ ] Webhook URL configured: `https://www.massawa-habesha.nl/api/retell-webhook`
- [ ] Authorization header set: `Bearer key_f69285ccb6bd6226aa2ce5c68302`
- [ ] All environment variables set in Vercel
- [ ] Supabase reservations table accessible
- [ ] Admin panel accessible

### During Test
- [ ] All Extract Variable nodes collect data correctly
- [ ] Logic splits work (party size > 10, Monday check, time validation)
- [ ] Function node calls webhook successfully
- [ ] Response variables extracted (`status`, `message`)
- [ ] Success/error branches work correctly
- [ ] Reservations appear in Supabase
- [ ] Admin panel shows new reservations

### Post-Test Verification
- [ ] Check Supabase for reservation record
- [ ] Verify email field is populated (or fallback used)
- [ ] Check message field includes `[Voice Agent]` tag
- [ ] Verify special requests are saved
- [ ] Confirm admin panel can send email confirmation
- [ ] Test email confirmation delivery

---

## Quick Test Script (Copy-Paste Ready)

**For Retell Simulation:**

```
User: "Hallo, ik wil graag reserveren"
Agent: [Asks for name]
User: "Jan de Vries"
Agent: [Asks for email]
User: "jan.devries@example.com"
Agent: [Asks for phone]
User: "+31612345678"
Agent: [Asks for party size]
User: "4 personen"
Agent: [Asks for date]
User: "Volgende week dinsdag"
Agent: [Asks for time]
User: "19:00"
Agent: [Asks for special requests]
User: "Nee"
Agent: [Confirms reservation]
```

**Expected Webhook Payload:**
```json
{
  "name": "Jan de Vries",
  "email": "jan.devries@example.com",
  "phone": "+31612345678",
  "party_size": 4,
  "date": "2025-12-02",
  "time": "19:00",
  "special_requests": "",
  "source": "retell",
  "language": "nl-NL"
}
```

**Expected Webhook Response:**
```json
{
  "status": "confirmed",
  "message": "Reservering bevestigd voor 2025-12-02 om 19:00.",
  "reservation_id": "<uuid>",
  "dining_window_minutes": 90
}
```






