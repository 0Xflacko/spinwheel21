# WTF Games Spinning Wheel 🎯

A Next.js web application featuring an interactive spinning wheel for prize giveaways and email collection.

## Features

- 🎲 Interactive spinning wheel with 6 prize segments ($20, $50, $100, $200, $300, $500)
- 📧 Email collection with Google Sheets integration
- 🎉 Animated confetti and prize celebration
- 🐹 Dynamic Hamster animations based on wheel spin state
- 📱 Fully responsive design (mobile-first)
- ⚡ Built with Next.js 15 and TypeScript
- 🎨 Styled with Tailwind CSS

## Live Demo

🚀 **Deployed on Vercel**: [Your deployment URL will go here]

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Google Sheets API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Console account (for Sheets API)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/0xflacko/wtf-games-spinwheel.git
cd wtf-games-spinwheel
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your Google Sheets API credentials.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_CLIENT_ID=your_client_id
```

## Deployment

This app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

## Analytics Setup

For conversion tracking and analytics, see `GOOGLE_ANALYTICS_CONVERSION_TRACKING.md`.

## Google Sheets Integration

For setting up the email collection system, see `GOOGLE_SHEETS_SETUP.md`.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── CompletionPage.tsx # Prize/email form page
│   └── SpinWheel.tsx      # Spinning wheel component
├── lib/                   # Utility libraries
│   └── googleSheets.ts    # Google Sheets integration
├── public/               # Static assets
│   ├── logo/            # WTF Games logo
│   ├── wheel_prize/     # Wheel graphics
│   └── ...              # Other assets
├── utils/               # Utility functions
│   └── prizeCalculator.ts # Prize calculation logic
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to WTF Games.

## Support

For questions or support, contact: dinokou01@gmail.com

---

Built with ❤️ by [0xflacko](https://github.com/0xflacko)
