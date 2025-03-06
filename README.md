# Flashcard Generator

A web application that automatically generates flashcards from various file formats including DOCX, PPTX, and CSV files.

## Features

- Upload documents (DOCX, PPTX, CSV) to generate flashcards
- Interactive flashcard interface with flip animation
- Modern, responsive UI using Material-UI
- Support for multiple file formats
- Easy navigation between flashcards

## Setup

### Backend Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The backend server will start at http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will start at http://localhost:3000

## File Format Guidelines

### DOCX
- Format each flashcard as "Question: Answer" on separate lines
- Empty lines will be ignored

### PPTX
- Slide title will be used as the question
- Slide content will be used as the answer

### CSV
- First column: Questions
- Second column: Answers
- First row can be headers (will be skipped)

## Technologies Used

- Backend:
  - Flask (Python web framework)
  - python-docx (DOCX processing)
  - python-pptx (PPTX processing)
  - pandas (CSV processing)

- Frontend:
  - React
  - Material-UI
  - Axios for API calls
