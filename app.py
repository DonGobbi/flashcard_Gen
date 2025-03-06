from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services.ai_service import AIService
import os
import tempfile
from fpdf import FPDF
import genanki
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ai_service = AIService()

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        content = file.read().decode('utf-8')
        flashcards = ai_service.generate_flashcards(content)
        
        return jsonify({'flashcards': flashcards})
    except Exception as e:
        logger.error(f"Error in upload_file: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/improve', methods=['POST'])
def improve_flashcard():
    try:
        data = request.get_json()
        if not data or 'flashcard' not in data:
            return jsonify({'error': 'No flashcard provided'}), 400
            
        improved_flashcard = ai_service.improve_flashcard(data['flashcard'])
        return jsonify({'flashcard': improved_flashcard})
    except Exception as e:
        logger.error(f"Error in improve_flashcard: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/translate', methods=['POST'])
def translate_flashcard():
    try:
        data = request.get_json()
        if not data or 'flashcard' not in data or 'target_language' not in data:
            return jsonify({'error': 'Missing flashcard or target language'}), 400
            
        translated_flashcard = ai_service.translate_flashcard(
            data['flashcard'],
            data['target_language']
        )
        return jsonify({'flashcard': translated_flashcard})
    except Exception as e:
        logger.error(f"Error in translate_flashcard: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/export/pdf', methods=['POST'])
def export_pdf():
    try:
        data = request.get_json()
        if not data or 'flashcards' not in data:
            return jsonify({'error': 'No flashcards provided'}), 400

        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Add title
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(200, 10, txt="Flashcards", ln=1, align='C')
        pdf.set_font("Arial", size=12)
        
        # Add flashcards
        for i, card in enumerate(data['flashcards'], 1):
            pdf.cell(200, 10, txt=f"Card {i}", ln=1, align='L')
            pdf.multi_cell(0, 10, txt=f"Question: {card['question']}")
            pdf.multi_cell(0, 10, txt=f"Answer: {card['answer']}")
            pdf.ln(10)

        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            pdf.output(tmp.name)
            tmp_path = tmp.name

        return send_file(
            tmp_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='flashcards.pdf'
        )
    except Exception as e:
        logger.error(f"Error in export_pdf: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/export/anki', methods=['POST'])
def export_anki():
    try:
        data = request.get_json()
        if not data or 'flashcards' not in data:
            return jsonify({'error': 'No flashcards provided'}), 400

        # Create Anki deck
        deck_id = 2059400110  # Random but fixed deck ID
        model_id = 1607392319  # Random but fixed model ID
        
        deck = genanki.Deck(
            deck_id,
            'Generated Flashcards'
        )

        model = genanki.Model(
            model_id,
            'Simple Model',
            fields=[
                {'name': 'Question'},
                {'name': 'Answer'},
            ],
            templates=[
                {
                    'name': 'Card 1',
                    'qfmt': '{{Question}}',
                    'afmt': '{{FrontSide}}<hr id="answer">{{Answer}}',
                },
            ])

        # Add notes to deck
        for card in data['flashcards']:
            note = genanki.Note(
                model=model,
                fields=[card['question'], card['answer']]
            )
            deck.add_note(note)

        # Create package
        package = genanki.Package(deck)
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.apkg') as tmp:
            package.write_to_file(tmp.name)
            tmp_path = tmp.name

        return send_file(
            tmp_path,
            mimetype='application/octet-stream',
            as_attachment=True,
            download_name='flashcards.apkg'
        )
    except Exception as e:
        logger.error(f"Error in export_anki: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
