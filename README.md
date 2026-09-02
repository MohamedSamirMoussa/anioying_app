# Anoing — Minecraft Community Platform

The Next.js front end for Anoing, a full-stack Minecraft community platform. It combines public server content, live server data, leaderboards, community guides, authentication, donations, blogs, notifications, and an administrative content dashboard.

## Related Repository

[Backend API and real-time gateway](https://github.com/MohamedSamirMoussa/BE)

## Features

- Responsive public landing experience
- Multiple Minecraft server tabs and connection details
- Real-time server data through Socket.IO
- Searchable player leaderboard
- Community setup guides and optional mod information
- Gallery and blog content
- Email, Google, and Discord authentication flows
- Password recovery and email confirmation
- PayPal donation interface
- Role-aware dashboard
- Editable page content and server settings
- User, donation, gallery, and notification management
- SEO metadata, sitemap, and robots configuration
- Redux Toolkit state management with persisted client state

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Redux Toolkit and React Redux
- Socket.IO Client
- Axios
- Tailwind CSS
- Formik and Yup
- PayPal React SDK
- Google OAuth
- React Hot Toast

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A running Anoing backend

### Installation

~~~bash
git clone https://github.com/MohamedSamirMoussa/anioying_app.git
cd anioying_app
npm install
~~~

Create .env.local:

~~~env
NEXT_PUBLIC_BACK_END_URI=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
~~~

Run the development server:

~~~bash
npm run dev
~~~

Open http://localhost:3000.

## Available Scripts

~~~bash
npm run dev
npm run build
npm run start
npm run lint
~~~

## Main Areas

- Public site: home, server information, leaderboard, gallery, blogs, and community content
- Authentication: sign-in, registration, confirmation, and password recovery
- Dashboard: users, servers, donations, gallery, notifications, and editable site content

## Configuration Note

Values prefixed with NEXT_PUBLIC_ are delivered to the browser. Only place public client identifiers and public URLs in those variables; never store private secrets there.

## Author

[Mohamed Samir Moussa](https://github.com/MohamedSamirMoussa)
