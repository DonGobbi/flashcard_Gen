import os
import json
import logging
from typing import List, Dict, Optional
from groq import Groq
from config import config

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        """Initialize the AI service with API key."""
        self.api_key = config.GROQ_API_KEY
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is required")
        self.client = Groq(api_key=self.api_key)
        self.model = "mixtral-8x7b-32768"

    async def generate_flashcards(self, text: str, num_cards: int = 5, subject: str = "") -> List[Dict[str, str]]:
        """Generate flashcards from text using AI."""
        try:
            # Prepare the prompt
            subject_context = f" about {subject}" if subject else ""
            prompt = f"""Generate {num_cards} high-quality flashcards{subject_context} from the following text. 
            Each flashcard should have a question and answer that tests understanding of key concepts.
            Format your response as a JSON array of objects with 'question' and 'answer' fields.

            Text: {text}

            Response format:
            [
                {{"question": "...", "answer": "..."}},
                {{"question": "...", "answer": "..."}}
            ]
            """

            # Get completion from API
            completion = self._get_completion(prompt)
            if not completion:
                raise ValueError("Failed to generate flashcards")

            # Parse flashcards from completion
            flashcards = self._parse_flashcard_list(completion)
            if not flashcards:
                raise ValueError("Failed to parse flashcards from API response")

            return flashcards

        except Exception as e:
            logger.error(f"Error generating flashcards: {str(e)}")
            raise

    async def improve_flashcard(self, question: str, answer: str) -> Dict[str, str]:
        """Improve a flashcard's content using AI."""
        try:
            prompt = f"""Improve this flashcard by making the question more specific and the answer more comprehensive.
            Current flashcard:
            Question: {question}
            Answer: {answer}

            Format your response as a JSON object with 'question' and 'answer' fields.
            Response format:
            {{"question": "...", "answer": "..."}}
            """

            completion = self._get_completion(prompt)
            if not completion:
                raise ValueError("Failed to improve flashcard")

            card = self._parse_flashcard(completion)
            if not card or 'question' not in card or 'answer' not in card:
                raise ValueError("Failed to parse improved flashcard")

            return card

        except Exception as e:
            logger.error(f"Error improving flashcard: {str(e)}")
            raise

    async def translate_flashcard(self, question: str, answer: str, target_language: str) -> Dict[str, str]:
        """Translate a flashcard to the target language."""
        try:
            prompt = f"""Translate this flashcard to {target_language}.
            Original flashcard:
            Question: {question}
            Answer: {answer}

            Format your response as a JSON object with 'question' and 'answer' fields.
            Response format:
            {{"question": "...", "answer": "..."}}
            """

            completion = self._get_completion(prompt)
            if not completion:
                raise ValueError("Failed to translate flashcard")

            card = self._parse_flashcard(completion)
            if not card or 'question' not in card or 'answer' not in card:
                raise ValueError("Failed to parse translated flashcard")

            return card

        except Exception as e:
            logger.error(f"Error translating flashcard: {str(e)}")
            raise

    def _get_completion(self, prompt: str) -> Optional[str]:
        """Get completion from the AI model."""
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI that generates high-quality educational flashcards."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1024,
            )

            return completion.choices[0].message.content

        except Exception as e:
            logger.error(f"Error getting completion from API: {str(e)}")
            raise

    def _parse_flashcard_list(self, text: str) -> List[Dict[str, str]]:
        """Parse a list of flashcards from JSON text."""
        try:
            # Find the JSON array in the text
            start = text.find('[')
            end = text.rfind(']') + 1
            if start == -1 or end == 0:
                raise ValueError("No JSON array found in response")

            json_str = text[start:end]
            flashcards = json.loads(json_str)

            # Validate flashcards
            if not isinstance(flashcards, list):
                raise ValueError("Response is not a list")

            for card in flashcards:
                if not isinstance(card, dict) or 'question' not in card or 'answer' not in card:
                    raise ValueError("Invalid flashcard format")

            return flashcards

        except json.JSONDecodeError as e:
            logger.error(f"Error parsing flashcard list: {str(e)}")
            raise ValueError("Failed to parse flashcards from response")

    def _parse_flashcard(self, text: str) -> Optional[Dict[str, str]]:
        """Parse a single flashcard from JSON text."""
        try:
            # Find the JSON object in the text
            start = text.find('{')
            end = text.rfind('}') + 1
            if start == -1 or end == 0:
                raise ValueError("No JSON object found in response")

            json_str = text[start:end]
            card = json.loads(json_str)

            # Validate card
            if not isinstance(card, dict) or 'question' not in card or 'answer' not in card:
                raise ValueError("Invalid flashcard format")

            return card

        except json.JSONDecodeError as e:
            logger.error(f"Error parsing flashcard: {str(e)}")
            raise ValueError("Failed to parse flashcard from response")
