import os
from groq import Groq
from typing import Dict, List, Optional
import json

class AIService:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is required")
        # Initialize Groq client with minimal configuration
        self.client = Groq(api_key=self.api_key)
        self.model = "mixtral-8x7b-32768"

    def generate_flashcards(self, text: str) -> List[Dict[str, str]]:
        """Generate flashcards from input text."""
        try:
            prompt = f"""Create educational flashcards from this text:
            {text}
            
            Generate clear, concise questions and comprehensive answers.
            Format each flashcard exactly like this:
            Q: [question]
            A: [answer]
            
            Focus on key concepts and important details."""

            completion = self._get_completion(prompt)
            if not completion:
                raise ValueError("Failed to generate flashcards")

            flashcards = []
            lines = [line.strip() for line in completion.split('\n') if line.strip()]
            current_card = {}

            for line in lines:
                if line.startswith('Q:'):
                    if current_card.get('question'):  # Save previous card
                        flashcards.append(current_card)
                        current_card = {}
                    current_card['question'] = line[2:].strip()
                elif line.startswith('A:'):
                    current_card['answer'] = line[2:].strip()

            if current_card.get('question') and current_card.get('answer'):
                flashcards.append(current_card)

            return flashcards
        except Exception as e:
            print(f"Error generating flashcards: {str(e)}")
            raise

    def improve_flashcard(self, flashcard: Dict) -> Dict:
        """Improve a flashcard's content using AI."""
        try:
            prompt = f"""Improve this flashcard while maintaining its core concept:
            Question: {flashcard['question']}
            Answer: {flashcard['answer']}
            
            Make the question more clear and concise, and make the answer more comprehensive 
            and easier to understand. Format your response exactly like this:
            Question: [improved question]
            Answer: [improved answer]"""

            completion = self._get_completion(prompt)
            if not completion:
                raise ValueError("Failed to get AI response")

            # Parse the response
            lines = [line.strip() for line in completion.split('\n') if line.strip()]
            question = ""
            answer = ""
            
            for line in lines:
                if line.startswith('Question:'):
                    question = line.replace('Question:', '').strip()
                elif line.startswith('Answer:'):
                    answer = line.replace('Answer:', '').strip()

            if not question or not answer:
                raise ValueError("Failed to parse improved flashcard")

            return {
                'question': question,
                'answer': answer
            }
        except Exception as e:
            print(f"Error improving flashcard: {str(e)}")
            raise

    def translate_flashcard(self, flashcard: Dict, target_language: str) -> Dict:
        """Translate a flashcard to the target language."""
        try:
            prompt = f"""Translate this flashcard to {target_language}:
            Original Question: {flashcard['question']}
            Original Answer: {flashcard['answer']}
            
            Provide a natural and accurate translation. Format your response exactly like this:
            Question: [translated question]
            Answer: [translated answer]"""

            completion = self._get_completion(prompt)
            if not completion:
                raise ValueError("Failed to get AI response")

            # Parse the response
            lines = [line.strip() for line in completion.split('\n') if line.strip()]
            question = ""
            answer = ""
            
            for line in lines:
                if line.startswith('Question:'):
                    question = line.replace('Question:', '').strip()
                elif line.startswith('Answer:'):
                    answer = line.replace('Answer:', '').strip()

            if not question or not answer:
                raise ValueError("Failed to parse translated flashcard")

            return {
                'question': question,
                'answer': answer,
                'original_question': flashcard['question'],
                'original_answer': flashcard['answer']
            }
        except Exception as e:
            print(f"Error translating flashcard: {str(e)}")
            raise

    def _get_completion(self, prompt: str) -> Optional[str]:
        """Get completion from Groq API."""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error getting completion: {str(e)}")
            return None
