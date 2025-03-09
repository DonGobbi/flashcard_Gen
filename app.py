

import os
import tempfile
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services.ai_service import AIService
from services.auth_service import AuthService
from functools import wraps
from fpdf import FPDF
import genanki
import json
import dotenv

# Load environment variables
dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ai_service = AIService()
auth_service = AuthService()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            email = auth_service.verify_token(token)
            if not email:
                return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400

        result = auth_service.register_user(data['email'], data['password'])
        return jsonify(result)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error in register: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400

        result = auth_service.login_user(data['email'], data['password'])
        return jsonify(result)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error in login: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/upload', methods=['POST'])
@token_required
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

        customization = data.get('customization', {})
        style = customization.get('style', 'Classic')
        
        # Create PDF with customization
        pdf = FPDF()
        pdf.add_page()
        
        # Set font based on customization
        font_family = customization.get('font', 'Arial')
        font_size = int(customization.get('fontSize', 12))
        
        # Add title with custom styling
        pdf.set_font(font_family if font_family in ['Arial', 'Times'] else 'Arial', 
                    style='B', 
                    size=font_size + 6)
        pdf.set_text_color(33, 150, 243)  # Primary blue color
        pdf.cell(0, 20, txt="My Flashcards", ln=1, align='C')
        pdf.ln(10)

        # Style-specific settings
        if style == 'Modern':
            bg_color = (245, 245, 245)
            border_color = (33, 150, 243)
            question_color = (33, 150, 243)
            answer_color = (85, 85, 85)
        elif style == 'Minimalist':
            bg_color = (255, 255, 255)
            border_color = (200, 200, 200)
            question_color = (0, 0, 0)
            answer_color = (85, 85, 85)
        elif style == 'Colorful':
            bg_color = (240, 248, 255)
            border_color = (33, 150, 243)
            question_color = (156, 39, 176)
            answer_color = (0, 150, 136)
        else:  # Classic
            bg_color = (250, 250, 250)
            border_color = (180, 180, 180)
            question_color = (33, 33, 33)
            answer_color = (85, 85, 85)

        # Add flashcards with custom styling
        for i, card in enumerate(data['flashcards'], 1):
            # Card container
            pdf.set_fill_color(*bg_color)
            pdf.set_draw_color(*border_color)
            pdf.rect(10, pdf.get_y(), 190, 0, 'S')
            pdf.ln(5)

            # Card number
            pdf.set_font(font_family if font_family in ['Arial', 'Times'] else 'Arial', 
                        style='B', 
                        size=font_size)
            pdf.set_text_color(*question_color)
            pdf.cell(0, 10, txt=f"Card {i}", ln=1, align='L')
            
            # Question
            pdf.set_font(font_family if font_family in ['Arial', 'Times'] else 'Arial', 
                        style='B', 
                        size=font_size)
            pdf.set_text_color(*question_color)
            pdf.multi_cell(0, 10, txt="Question:", fill=True)
            pdf.set_font(font_family if font_family in ['Arial', 'Times'] else 'Arial', 
                        size=font_size)
            pdf.multi_cell(0, 10, txt=card['question'])
            pdf.ln(5)
            
            # Answer
            pdf.set_font(font_family if font_family in ['Arial', 'Times'] else 'Arial', 
                        style='B', 
                        size=font_size)
            pdf.set_text_color(*answer_color)
            pdf.multi_cell(0, 10, txt="Answer:", fill=True)
            pdf.set_font(font_family if font_family in ['Arial', 'Times'] else 'Arial', 
                        size=font_size)
            pdf.multi_cell(0, 10, txt=card['answer'])
            pdf.ln(10)

            # Bottom border
            pdf.set_draw_color(*border_color)
            pdf.rect(10, pdf.get_y() - 5, 190, 0, 'S')
            pdf.ln(15)

            # Add new page if needed
            if pdf.get_y() > 250:
                pdf.add_page()

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

        customization = data.get('customization', {})
        style = customization.get('style', 'Classic')
        
        # Create Anki deck with customization
        deck_id = 2059400110  # Random but fixed deck ID
        model_id = 1607392319  # Random but fixed model ID
        
        deck = genanki.Deck(
            deck_id,
            'My Flashcards'
        )

        # Style-specific settings
        if style == 'Modern':
            primary_color = '#2196F3'
            secondary_color = '#555555'
            bg_color = '#f5f5f5'
        elif style == 'Minimalist':
            primary_color = '#000000'
            secondary_color = '#555555'
            bg_color = '#ffffff'
        elif style == 'Colorful':
            primary_color = '#9C27B0'
            secondary_color = '#009688'
            bg_color = '#f0f8ff'
        else:  # Classic
            primary_color = '#212121'
            secondary_color = '#555555'
            bg_color = '#fafafa'

        # Create custom styling based on customization options
        font_family = customization.get('font', 'Arial')
        font_size = customization.get('fontSize', '16')
        card_style = f"""
        .card {{
            font-family: {font_family}, Arial, sans-serif;
            font-size: {font_size}px;
            text-align: center;
            color: {primary_color};
            background-color: {bg_color};
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .question {{
            font-weight: bold;
            margin-bottom: 20px;
            color: {primary_color};
            font-size: {int(font_size) + 2}px;
        }}
        .answer {{
            margin-top: 20px;
            color: {secondary_color};
        }}
        hr {{
            margin: 20px 0;
            border: none;
            border-top: 1px solid #ddd;
        }}
        """

        model = genanki.Model(
            model_id,
            'Custom Model',
            fields=[
                {'name': 'Question'},
                {'name': 'Answer'},
            ],
            templates=[
                {
                    'name': 'Card 1',
                    'qfmt': '''
                    <div class="card">
                        <div class="question">
                            {{Question}}
                        </div>
                    </div>
                    ''',
                    'afmt': '''
                    <div class="card">
                        <div class="question">
                            {{Question}}
                        </div>
                        <hr id="answer">
                        <div class="answer">
                            {{Answer}}
                        </div>
                    </div>
                    ''',
                },
            ],
            css=card_style
        )

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
