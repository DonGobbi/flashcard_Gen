from typing import Optional
import os

class Config:
    GROQ_API_KEY: Optional[str] = None
    ALLOWED_EXTENSIONS = {'docx', 'pptx', 'csv', 'txt'}
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size

    @staticmethod
    def init_app(app):
        # Load environment variables
        Config.GROQ_API_KEY = os.getenv('GROQ_API_KEY')
        
        # Log API key status
        if not Config.GROQ_API_KEY:
            print("\nError: GROQ_API_KEY environment variable is not set.")
            print("Please set your Groq API key using:")
            print("\n1. Command Prompt (temporary):")
            print("   set GROQ_API_KEY=your_api_key")
            print("\n2. Create a .env file in the project root with:")
            print("   GROQ_API_KEY=your_api_key")
            print("\nGet your API key from: https://console.groq.com/keys\n")
            raise ValueError("GROQ_API_KEY is required to run the application")

config = Config()
