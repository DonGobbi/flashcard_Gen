from typing import Optional
import os
import sys

class Config:
    GROQ_API_KEY: Optional[str] = None
    ALLOWED_EXTENSIONS = {'docx', 'pptx', 'csv', 'xlsx', 'txt', 'pdf'}
    UPLOAD_FOLDER = 'test_files'  # Changed to test_files for easier testing
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

    @staticmethod
    def init_app(app):
        # Create upload folder if it doesn't exist
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)
        
        # Load environment variables
        Config.GROQ_API_KEY = os.getenv('GROQ_API_KEY')
        
        # Check if API key is set
        if not Config.GROQ_API_KEY:
            print("\nError: GROQ_API_KEY environment variable is not set!")
            print("Please set your Groq API key using one of these methods:")
            print("\n1. Command Prompt (temporary):")
            print("   set GROQ_API_KEY=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")
            print("\n2. Create a .env file in the project root with:")
            print("   GROQ_API_KEY=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")
            print("\nGet your API key from: https://console.groq.com/keys\n")
            sys.exit(1)

config = Config()
