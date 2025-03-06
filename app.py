from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import docx
from pptx import Presentation
import pandas as pd

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'docx', 'pptx', 'csv', 'xlsx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_docx(file_path):
    doc = docx.Document(file_path)
    flashcards = []
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if ':' in text:
            question, answer = text.split(':', 1)
            flashcards.append({
                'question': question.strip(),
                'answer': answer.strip()
            })
    
    return flashcards

def process_pptx(file_path):
    prs = Presentation(file_path)
    flashcards = []
    
    for slide in prs.slides:
        if len(slide.shapes.title.text.strip()) > 0:
            question = slide.shapes.title.text
            answer = ""
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape != slide.shapes.title:
                    answer += shape.text + " "
            flashcards.append({
                'question': question.strip(),
                'answer': answer.strip()
            })
    
    return flashcards

def process_csv(file_path):
    df = pd.read_csv(file_path)
    flashcards = []
    
    for _, row in df.iterrows():
        if len(df.columns) >= 2:
            flashcards.append({
                'question': str(row[0]).strip(),
                'answer': str(row[1]).strip()
            })
    
    return flashcards

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            if filename.endswith('.docx'):
                flashcards = process_docx(file_path)
            elif filename.endswith('.pptx'):
                flashcards = process_pptx(file_path)
            elif filename.endswith('.csv'):
                flashcards = process_csv(file_path)
            else:
                return jsonify({'error': 'Unsupported file format'}), 400
            
            os.remove(file_path)  # Clean up the uploaded file
            return jsonify({'flashcards': flashcards})
        
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
