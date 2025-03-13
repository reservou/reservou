# Reservou - LLM Code Generation Guide

## Overview

Reservation platform that allows hotels to create slugs that customers can visit
and book rooms by urls like www.[slug].reservou.xyz.

Powered by Node.js, uses Next.js in Vercel environment for this first fullstack
version.

## Workflows

This is how the user's journey will look like for completing a reservation

### Hotel Workflow:

1. The user creates a Hotel account

- Social login with Google
- Magic link

2. Complete hotel basic registration

- Inform hotel name, location and description
- Inform hotel tax information (Currently planning to support Brazil customers
  for first version)
- Agree to Legal terms

3. Complete hotel rooms setup

- Register existing rooms
- Inform about each room reservation price, amenities (Wi-fi, TV, coffee maker),
  tags, room size(2 people)
- Attach photos for each room, and define one as landscape

4. Complete payment setup

- Inform payment methods (only PIX for the first version)
- Inform hotel cash-out PIX address (optional)

### Customer Workflow:

The user does not _need_ to be authenticated, he can be but it's not required,
the necessary personal data will be retrieved by payment step

1. Visits www.[slug].reservou.xyz
2. Chooses a room to reserve
3. Inform his name, CPF and e-mail to receive the reservation ticket (if is not
   logged in)
4. Agree with platform terms and pay
5. Receive a ticket in the website with the following options (print, share,
   download).
6. Receive a ticket by the provided e-mail.

## Events

This is what the platform will (do/require user action) in case of the following
events

### New Reservation

1. Platform will flag the room as unavailable
2. Platform will send hotel admin notification for confirm/cancel the
   reservation

- The room might have been reserved physically in the hotel and owner forgot to
  update
- If the admin cancels the reservation the user will be refunded and the hotel
  will pay a small fee to cover costs
  - A feedback must be given, through platform options or owner's own words
- The user should be notified if the reservation is cancelled.

3. Platform will retrieve the payment until user can not cancel it anymore.

4. Platform unlocks the hotel's balance after cancel period

### Customer Refund

1. The user can cancel the reservation and refund the money within a period of
   time(to be defined following the Brazillian Law)
   - If possibilly legal, user will pay a fee to cancel (refund will be
     decreased that fee).

2. The hotel admin's will be notified
3. Platform will flag the room as available again

### Manual Reservation

1. The hotel's admin manually flags the room as unavailable

## Technical Details

### Tech stack

- **Language**: TypeScript
- **Framework**: Next.js (v15.2.1)
- **UI Library**: React (^v19)
- **UI Components**: Shadcn/ui Components
- **CSS Library**: TailwindCSS (v4)
- **JavaScript Runtime**: Node (v22.13.1)
- **Database**: MongoDB with Mongoose (^8.12.1) as ORM
- **Caching**: Redis with Upstash
- **Containerization**: Docker
- **Biome**: Formatter and linter

### Architecture

**Folder structure** All the Next.js pages/routes are under the @/app folder,
the components, actions, models, lib, are under the @/src folder

```
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [slug]
│   │   ├── page.tsx
│   │   └── reserve
│   │       └── page.tsx
│   └── ticket
│       └── page.tsx
├── biome.json
├── components.json
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── public
│   ├── logo.png
│   └── ...resources
├── README.md
├── src
│   ├── actions
│   ├── components
│   │   └── ui // shadcn UI components
│   ├── errors
│   │   └── index.ts
│   ├── hooks
│   │   └── use-mobile.ts
│   ├── lib
│   │   ├── controller.ts
│   │   └── utils.ts
```

**Coupling** For the first version, the code will be coupled until the first
requirements are done, so the implementation goes directly in the API route
handlers or server actions
