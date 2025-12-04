# The Style Studio

A high-fidelity "Digital Darkroom" for turning cartoon concepts into gritty, photorealistic cinematography. Powered by Google Gemini AI.

![Style Studio](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

### 🎬 The Director (Prompt Generator)
Upload a reference image and describe your concept. The AI Art Director analyzes your input and generates a polished "Director's Treatment" with detailed lighting, lens, and texture specifications.

### 🎨 Style Transfer (Image Generation)
Combine structure and style references to generate gritty, photorealistic images. Uses advanced AI image generation with:
- **Structure Reference**: Defines composition, pose, and layout
- **Style Reference**: Defines lighting, textures, and visual style

### ✨ Prompt Polish (Prompt Rewriter)
Rewrite any prompt for gritty realism. Transform "cute" descriptions into cinematic, texture-rich specifications.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Service**: Google Gemini API
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/style-studio.git
cd style-studio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Google AI API key to `.env.local`:
```
GOOGLE_AI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── director/      # Prompt generation endpoint
│   │   ├── generate/      # Image generation endpoint
│   │   └── rewrite/       # Prompt rewriting endpoint
│   ├── brief/             # Phase A: The Brief page
│   ├── studio/            # Phase B: The Studio page
│   ├── gallery/           # Gallery page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── DragDropZone.tsx   # Image upload component
│   ├── PromptTerminal.tsx # Code editor-style text input
│   ├── ComparisonSlider.tsx # Before/after comparison
│   ├── TerminalLog.tsx    # Loading progress display
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── RewriteModal.tsx   # Prompt rewrite modal
├── lib/                   # Utility functions
│   ├── gemini.ts          # Gemini API integration
│   └── utils.ts           # Helper functions
├── store/                 # State management
│   └── useProjectStore.ts # Zustand store
└── types/                 # TypeScript types
    └── index.ts
```

## Usage

### Phase A: The Brief
1. Navigate to "The Brief" page
2. (Optional) Upload a reference image
3. Enter your concept description
4. Click "Generate Director's Treatment"
5. Copy the treatment or send it to The Studio

### Phase B: The Studio
1. Navigate to "The Studio" page
2. Upload a Structure Reference (defines composition)
3. Upload a Style Reference (defines textures/lighting)
4. Enter or paste your prompt
5. Click "RENDER" to generate the image
6. Use the comparison slider to compare before/after

### Prompt Polish
- Click the "Rewrite" button next to any prompt input
- The AI will transform your prompt for gritty realism

## Design System

### Colors
- **Background**: Deep Charcoals (`#0d0d0d`, `#1a1a1a`, `#242424`)
- **Accent**: Warning Yellow/Amber (`#f59e0b`, `#d97706`)
- **Text**: Light gray (`#ededed`) with muted variants

### Typography
- **UI**: Inter (sans-serif)
- **Code/Prompts**: JetBrains Mono (monospace)

## API Endpoints

### POST /api/director
Generate a Director's Treatment from a concept.

```json
{
  "conceptText": "Dragon in a sandbox, sad",
  "referenceImage": "base64_image_data" // optional
}
```

### POST /api/generate
Generate an image with style transfer.

```json
{
  "prompt": "Director's treatment text",
  "structureReference": "base64_image_data", // optional
  "styleReference": "base64_image_data" // optional
}
```

### POST /api/rewrite
Rewrite a prompt for gritty realism.

```json
{
  "originalPrompt": "A cute dragon playing",
  "referenceImage": "base64_image_data" // optional
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `GOOGLE_AI_API_KEY`: Your Google AI API key
4. Deploy

### Docker

```bash
docker build -t style-studio .
docker run -p 3000:3000 -e GOOGLE_AI_API_KEY=your_key style-studio
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for styling utilities
