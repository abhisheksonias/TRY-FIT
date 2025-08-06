# TryFit: AI Virtual Try-On

TryFit is an AI-powered virtual try-on web application that allows users to upload clothing images, generate AI models, and create stunning virtual photoshoots. Built with Next.js, TypeScript, Tailwind CSS, and Genkit AI, TryFit delivers a seamless and modern user experience for fashion and e-commerce innovation.

## Features
- **AI Virtual Try-On:** Upload clothing images and generate realistic AI models wearing the selected items.
- **AI Model Generation:** Customize model gender, pose, body type, and skin tone for personalized results.
- **Smart Gender Detection:** Automatically detects whether clothing is for male or female models.
- **Clothing Analysis:** Analyze uploaded clothing images for better AI compositing.
- **Download Results:** Save your virtual try-on images for sharing or further use.
- **Modern UI:** Responsive, clean, and user-friendly interface built with Tailwind CSS and Radix UI components.

## Technology Stack
- **Next.js** (React framework)
- **TypeScript**
- **Tailwind CSS**
- **Genkit AI** (Google Gemini API)
- **Radix UI** (component library)
- **Zod** (form validation)

## Project Structure
```
TRY-FIT/
├── src/
│   ├── app/                # Main app files (layout, pages, global styles)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── ai/                 # AI flows and integrations
├── docs/                   # Project documentation
├── public/                 # Static assets (if any)
├── .env                    # Environment variables (GEMINI_API_KEY)
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Getting Started
1. **Clone the repository:**
   ```powershell
   git clone <your-repo-url>
   cd TRY-FIT
   ```
2. **Install dependencies:**
   ```powershell
   npm install
   ```
3. **Set up environment variables:**
   - Add your Google Gemini API key to the `.env` file:
     ```env
     GEMINI_API_KEY=your-gemini-api-key
     ```
4. **Run the development server:**
   ```powershell
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage Guide
- **Upload Clothing:** Use the UI to upload an image of clothing.
- **Auto-Gender Detection:** The system will automatically suggest male/female model based on clothing style.
- **Customize Model:** Select or adjust gender, pose, body type, and skin tone.
- **Generate Model:** Click to generate an AI model wearing the clothing.
- **Create Try-On:** Composite the clothing onto the model and view the result.
- **Download Image:** Save your virtual try-on image.

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. For major changes, open an issue first to discuss your ideas.

## License
This project is licensed under the MIT License.

## Credits
- Built by [Your Name/Team]
- Powered by Google Gemini AI and Genkit
- UI components by Radix UI

---
For questions or support, please open an issue or contact the maintainer.
