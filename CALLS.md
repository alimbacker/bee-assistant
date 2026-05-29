# Connecting real phone calls to Bee

Bee can answer real phone calls: the caller talks, Bee understands and replies in a
voice, and every caller is saved as a lead in your dashboard.

**Important:** the browser/app can't receive phone calls by itself. You need a
**telephony provider** that gives you a phone number and sends the call to your
backend. Your Bee backend is already ready for this — the brain runs on your server
with **no extra API key**. You only need an account + number on the provider's side
(this part costs money and requires signup; there's no free keyless option for real
PSTN phone numbers).

The endpoint is already built:

```
POST  https://<your-api>.onrender.com/api/calls/twiml
```

It returns TwiML, the format used by **Twilio** (and compatible with Plivo, and
similar to Exotel — popular in India). Below are Twilio steps; others are analogous.

---

## Option A — Twilio (works worldwide)

1. Create an account at **twilio.com** and add a little credit.
2. **Buy a number** with **Voice** capability (Phone Numbers → Buy a number).
   - For India, Twilio numbers have local regulatory (KYC) requirements; you can
     start testing with a US number, then add an Indian number once verified.
3. Go to **Phone Numbers → Manage → your number → Voice Configuration**.
4. Under **"A call comes in"**, choose **Webhook**, set:
   ```
   https://<your-api>.onrender.com/api/calls/twiml
   ```
   method **HTTP POST**. Save.
5. Call your Twilio number. You should hear Bee greet you, then it listens, answers
   your question, and the caller shows up under **Recent Leads** in your dashboard.

That's it — Twilio does the speech-to-text and text-to-speech; Bee's logic runs on
your server.

> First call after the backend has been idle may take ~50s (Render free tier waking
> up). Keep the service warm with a paid Render plan or a simple uptime pinger if you
> need instant answer.

---

## Option B — Exotel (India-focused)

Exotel is widely used in India and supports KYC for Indian numbers.

1. Sign up at **exotel.com**, complete KYC, and get a number.
2. In Exotel's **App Bazaar / Flow**, add a step that calls an external URL
   (a "Passthru" / webhook applet) pointing at your `/api/calls/handle` endpoint
   (the JSON one), or use their "Gather speech" equivalent to your `/api/calls/twiml`.
3. Exotel's exact applet names differ from Twilio; their support can map
   "speech gather → webhook" for you. The JSON endpoint `/api/calls/handle` returns
   `{ say, intent, transfer_to_human }` which you can feed into their flow.

---

## WhatsApp / Telegram / Messenger (text, not calls)

The same brain (`/api/voice/process`) can power chat channels:

- **WhatsApp**: use Twilio's WhatsApp API or Meta's Cloud API; forward each incoming
  message's text to `POST /api/voice/process` and reply with the `reply` field.
- **Telegram**: create a bot via **@BotFather**, run a small webhook that forwards
  message text to `/api/voice/process`.
- **Messenger**: Meta's Messenger Platform webhook → same pattern.

Each needs that provider's token/credentials, set as environment variables on your
backend when you build the channel.

---

## What stays keyless vs. what needs an account

| Capability | Needs a paid account / key? |
|------------|------------------------------|
| Web voice (mic + spoken replies) | No — browser built-in |
| Bee's understanding & replies | No — runs on your server |
| Lead capture + dashboard | No |
| **Real phone number + calls** | **Yes** (Twilio/Exotel/etc.) |
| WhatsApp / Telegram / Messenger | Yes (provider tokens) |
| Premium AI voices (ElevenLabs) etc. | Yes |
