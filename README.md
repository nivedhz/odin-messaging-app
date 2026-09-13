<div align="center">

# Sendzy 📨

**Lower your messaging experience.**

*Not real-time • Not encrypted • Not blazing fast — a messaging app built while learning the [Odin Project](https://www.theodinproject.com/) curriculum.*

</div>

---

## What is this?

Sendzy is a full-stack chat app where you can sign up, add friends, and exchange messages in a fully **unregulated** environment. It is slow, un-encrypted, and built for groups that never sleep — most notably the residents of `#bikini-bottom`:

> **SpongeBob:** The Krusty Krab pizza is the pizza for you and me!
>
> **Patrick:** Is mayonnaise an instrument?
>
> **Mr. Krabs:** log back in already, me boy — the Krusty Krab misses ye!

Humpty is sitting on a high place. Cindrella lost her shoe. These are the conversations that matter. Powered by Sendzy.

## Features (allegedly)

- 🔐 **Auth that mostly works** — sign-up / login with bcrypt-hashed passwords and 1-hour JWT sessions in `httpOnly` cookies. Wrong password? You'll get the extremely precise error *"Incorrect username of password"*.
- 🧑‍🤝‍🧑 **Friendships with bureaucracy** — send, cancel, accept, and decline friend requests. Nothing happens instantly; everything is a database roundtrip, as nature intended.
- 💬 **DMs on first send** — tapping a person stages a *pending* thread with zero database writes (we're frugal like that). The chat only materializes when you actually say something.
- ⚡ **Blazing-slow message delivery** — guaranteed `>50ms` delivery. Messages are fetched fresh every time you open a thread, because caching is for apps with confidence.
- 🔍 **Ctrl+K search** — focuses search from anywhere. The one genuinely fast thing in here.
- 😀 **Hand-rolled emoji picker** — 72 emojis, zero libraries. We looked at installing one and decided our bundle deserved better.
- 📜 **Auto-scroll, but smooth** — threads rest on the newest message. New arrivals glide; thread switches land instantly (no scenic swoosh through 400 messages of Krusty Krab lore).
- 🟢 **Presence you can trust** — a green dot that pulses next to the word "Online". No further questions.
- 🌊 **A WebGL background** — animated gradient waves render behind everything, permanently mounted so route changes don't flash. It's the most expensive part of the app and it does absolutely nothing functional.
- 🚪 **Logout with commitment issues** — requires a centered confirmation modal. Escape, backdrop click, and Cancel all chicken out safely.

## Tech stack

| Layer    | Choice | Justification |
|----------|--------|---------------|
| Framework | Next.js 16 + React 19 | App Router, server components, server actions |
| Styling   | Tailwind CSS v4 + shadcn-style primitives | Glassmorphism over everything, readability nowhere |
| Database  | PostgreSQL via Prisma 7 | Relations for days: users, friendships, chats, messages |
| Auth      | bcrypt + jose (JWT) | Passwords hashed, sessions signed, secrets env-varred |
| Icons     | lucide-react | Every icon is a 15px line drawing and that's beautiful |
| 3D bg     | ogl (raw WebGL shaders) | Because `npm install three` was too mainstream |
| Primitives| @base-ui/react | Used exactly once, for an emoji popover we later replaced |

## Project structure

```
app/
  page.tsx            # Landing: "Lower Your Messaging Experience"
  login/  sign-up/    # Auth pages with Bikini Bottom chat previews
  chat/page.tsx       # Loads everything once, hands it to ChatScreen
features/
  auth/               # login/ + sign-up/ vertical slices (actions, logic, UI)
  chat/
    user.ts           # getUser, getFriends, getAllUsers, request helpers
    direct.ts         # getOrCreateDirectChat, sendMessage, getMessages
    actions.ts        # The ONLY client↔db bridge (session-guarded)
    components/       # 17 tiny documented pieces (ChatScreen orchestrates)
lib/auth/             # password hashing + JWT session cookies
prisma/schema.prisma  # User ↔ Friendship ↔ Chat ↔ Message
proxy.ts              # Route guard: logged-in → /chat, strangers → /login
```

The `features/chat/components/` folder is the crown jewel: each file has a docblock explaining what it does, because past-us kept asking "what the fuck is the switch the right panel".

## Getting started

```bash
npm install

# .env — the two secrets standing between you and production:
#   DATABASE_URL="postgresql://..."
#   SESSION_SECRET="something-unbelievably-long"

npx prisma migrate dev
npm run dev
```

| Script | What it does |
|--------|--------------|
| `npm run dev` | Dev server (turbopack, feelings included) |
| `npm run build` | Production build that somehow still passes |
| `npm run lint` | ESLint, which has opinions about GradientWaves |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run vercel-build` | Migrate + build, for the cloud |

There's also a `startup.sh` that opens tmux with the dev server, nvim, pgcli, and a spare terminal — for developers who enjoy watching four panes of nothing happen simultaneously.

## Roadmap (aspirational)

- [ ] Image storage (the button is already there, greyed out, judging you)
- [ ] Real-time anything (currently every refresh is a pilgrimage to Postgres)
- [ ] Actual encryption (the shield icon is decorative)
- [ ] Getting Cindrella's shoe back

## Disclaimer

Built for learning, not for your secrets. Do not send anything through Sendzy that you wouldn't also yell across the Krusty Krab. No messages were encrypted in the making of this app.

---

<div align="center">

*Sendzy — lock your messaging potential in a fully unregulated environment.*

</div>
