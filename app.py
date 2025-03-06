from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import docx
from pptx import Presentation
import pandas as pd
from config import config
from services.ai_service import AIService
import asyncio
from functools import wraps
import uuid

app = Flask(__name__)
CORS(app)

# Initialize configuration
config.init_app(app)
app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize AI service
ai_service = AIService()

def async_route(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))
    return wrapped

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS

def process_docx(file_path):
    """Extract content from DOCX files, preserving structure."""
    try:
        doc = docx.Document(file_path)
        content_parts = []
        
        # Process headings and paragraphs
        for paragraph in doc.paragraphs:
            if paragraph.style.name.startswith('Heading'):
                content_parts.append(f"\n{paragraph.text}\n")
            elif paragraph.text.strip():
                content_parts.append(paragraph.text)
        
        return "\n".join(content_parts)
    except Exception as e:
        app.logger.error(f"Error processing DOCX file: {str(e)}")
        raise

def process_pptx(file_path):
    """Extract content from PPTX files, preserving slide structure."""
    try:
        prs = Presentation(file_path)
        content_parts = []
        
        for slide_number, slide in enumerate(prs.slides, 1):
            # Add slide title
            if slide.shapes.title:
                content_parts.append(f"\nSlide {slide_number}: {slide.shapes.title.text}\n")
            
            # Process all shapes containing text
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    if shape != slide.shapes.title:  # Skip title as it's already added
                        # Handle bullet points
                        text = shape.text.strip()
                        if text.startswith('•'):
                            text = text.replace('•', '-')
                        content_parts.append(text)
        
        return "\n".join(content_parts)
    except Exception as e:
        app.logger.error(f"Error processing PPTX file: {str(e)}")
        raise

def process_txt(file_path):
    """Process plain text files."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        app.logger.error(f"Error processing TXT file: {str(e)}")
        raise

def process_csv(file_path):
    """Process CSV files."""
    try:
        df = pd.read_csv(file_path)
        content = []
        for _, row in df.iterrows():
            if len(df.columns) >= 2:
                content.extend([str(row[0]), str(row[1])])
        return "\n".join(content)
    except Exception as e:
        app.logger.error(f"Error processing CSV file: {str(e)}")
        raise

@app.route('/api/upload', methods=['POST'])
@async_route
async def upload_file():
    temp_file_path = None
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Create a unique temporary file path
            temp_filename = f"temp_{uuid.uuid4()}_{filename}"
            temp_file_path = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
            
            try:
                # Save the file
                file.save(temp_file_path)
                
                # Extract content based on file type
                try:
                    if filename.endswith('.docx'):
                        content = process_docx(temp_file_path)
                    elif filename.endswith('.pptx'):
                        content = process_pptx(temp_file_path)
                    elif filename.endswith('.txt'):
                        content = process_txt(temp_file_path)
                    elif filename.endswith('.csv'):
                        content = process_csv(temp_file_path)
                    else:
                        return jsonify({'error': 'Unsupported file format'}), 400

                    if not content.strip():
                        return jsonify({'error': 'No content found in file'}), 400

                    # Get additional parameters
                    try:
                        num_cards = int(request.form.get('num_cards', 5))
                        if num_cards < 1 or num_cards > 20:
                            return jsonify({'error': 'Number of cards must be between 1 and 20'}), 400
                    except ValueError:
                        return jsonify({'error': 'Invalid number of cards specified'}), 400

                    subject = request.form.get('subject', None)
                    
                    # Generate flashcards using AI
                    try:
                        flashcards = await ai_service.generate_flashcards(content, num_cards, subject)
                        return jsonify({'flashcards': flashcards})
                    except ValueError as e:
                        return jsonify({'error': str(e)}), 500
                    
                except Exception as e:
                    app.logger.error(f"Error processing file content: {str(e)}")
                    return jsonify({'error': f'Error processing file content: {str(e)}'}), 500
            
            except Exception as e:
                app.logger.error(f"Error saving file: {str(e)}")
                return jsonify({'error': f'Error saving file: {str(e)}'}), 500
            
            finally:
                # Clean up the temporary file
                if temp_file_path and os.path.exists(temp_file_path):
                    try:
                        os.remove(temp_file_path)
                    except Exception as e:
                        app.logger.error(f"Error removing temporary file: {str(e)}")
        
        return jsonify({'error': 'Invalid file type'}), 400
    
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
    
    finally:
        # Extra cleanup attempt for the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                app.logger.error(f"Error in final cleanup: {str(e)}")

@app.route('/api/improve', methods=['POST'])
@async_route
async def improve_flashcard():
    try:
        data = request.json
        if not data or 'question' not in data or 'answer' not in data:
            return jsonify({'error': 'Missing question or answer'}), 400
        
        improved = await ai_service.improve_flashcard(data['question'], data['answer'])
        return jsonify(improved)
    except Exception as e:
        app.logger.error(f"Error improving flashcard: {str(e)}")
        return jsonify({'error': f'Error improving flashcard: {str(e)}'}), 500

@app.route('/api/translate', methods=['POST'])
@async_route
async def translate_flashcard():
    try:
        data = request.json
        if not data or 'question' not in data or 'answer' not in data or 'target_language' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        translated = await ai_service.translate_flashcard(
            data['question'], 
            data['answer'], 
            data['target_language']
        )
        return jsonify(translated)
    except Exception as e:
        app.logger.error(f"Error translating flashcard: {str(e)}")
        return jsonify({'error': f'Error translating flashcard: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'ai_service': bool(config.GROQ_API_KEY)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
