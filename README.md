# 🗳️ VoteInfo AI: Intelligent Election Assistant

**VoteInfo AI** is a premium, feature-rich web application designed to empower Indian voters with data-driven insights and AI-powered reasoning. Built with **React**, **Vite**, and **Google Gemini API**, it provides an interactive journey through the electoral process.

![VoteInfo AI Banner](https://images.unsplash.com/photo-1540910419892-f0c74b0e53b3?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

*   **🤖 Voter Mitra AI**: A next-generation assistant powered by **Gemini 2.0/2.5**, capable of analyzing complex election data and explaining constitutional procedures.
*   **📊 Data Lab**: Real-time interactive charts (Recharts) visualizing historical voter turnout, demographic trends, and gender participation gaps.
*   **🗺️ Election Journey**: A step-by-step visual timeline of the voting process, from registration to the polling booth.
*   **🎯 Voter Simulator**: A readiness calculator that provides personalized checklists based on your registration status and location.
*   **💎 Rich Aesthetics**: Modern glassmorphism UI with smooth animations (Framer Motion) and a responsive layout for all devices.

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI Engine**: Google Generative AI (Gemini 2.0 Flash)
- **Visualization**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/voteinfo-ai.git
cd voteinfo-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
> Get your API key at [Google AI Studio](https://aistudio.google.com/).

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧪 Testing

The project includes a comprehensive suite of unit and component tests.
```bash
# Run tests
npx vitest

# Run tests with UI
npx vitest --ui
```

## 🔒 Security & Safety

- **Neutrality**: The AI assistant is programmed to remain strictly non-partisan and neutral.
- **Privacy**: No personal user data is stored; all simulations are processed locally.
- **Sanitization**: Input prompts are sanitized to prevent common risk vectors.

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ for a stronger democracy.
