# Flashcard Generator

A modern web application for generating educational flashcards from various file formats and online resources. Built with React, Material-UI, and Python Flask.

## Features

### 1. File Input Support
- Document formats (DOC, DOCX)
- Presentation files (PPT, PPTX)
- Spreadsheets (CSV, Google Sheets)
- YouTube video transcripts
- Text files (TXT)

### 2. Customizable Flashcard Design
- Multiple card styles:
  - Modern (gradient background)
  - Classic (solid color)
  - Minimalist (clean borders)
  - Colorful (vibrant gradients)
- Font customization (family and size)
- Color theme selection
- Animation toggles
- Responsive layout

### 3. Enhanced User Interaction
- Card flip animations
- Progress tracking
- Success rate monitoring
- Average review time tracking
- Dark/light mode toggle

### 4. Export Options
- Print-ready format
- PDF export
- Anki deck export
- Share functionality

### 5. Additional Features
- Translation support with multiple languages
- Card improvement suggestions
- Interactive study mode with correct/incorrect tracking

## Tech Stack

### Frontend
- React
- Material-UI for UI components
- Framer Motion for animations
- React Router for navigation

### Backend
- Python Flask
- Groq API for AI-powered flashcard generation
- Support for multiple file formats
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flashcard-generator.git
cd flashcard-generator
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the backend directory:
```
GROQ_API_KEY=your_groq_api_key
FLASK_APP=app.py
FLASK_ENV=development
```

### Running the Application

1. Start the backend server:
```bash
cd backend
flask run
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Upload Files:
   - Click "Choose File" or drag and drop supported files
   - Enter a YouTube URL or Google Sheets link
   - Select the number of flashcards to generate

2. Customize Design:
   - Choose a card style
   - Adjust font settings
   - Select color theme
   - Toggle animations

3. Study Mode:
   - Flip through cards
   - Mark cards as correct/incorrect
   - Track progress
   - View statistics

4. Export:
   - Download as PDF
   - Export to Anki
   - Print cards
   - Share with others

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful components
- Framer Motion for smooth animations
- Groq for AI capabilities
- All contributors and users of the application
