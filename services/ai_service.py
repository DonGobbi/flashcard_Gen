from groq import Groq
from typing import List, Dict, Optional
from config import config
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        logger.debug("Initializing AIService")
        api_key = config.GROQ_API_KEY
        logger.debug(f"API Key present: {bool(api_key)}")
        self.client = Groq(api_key=api_key)
        self.model = "mixtral-8x7b-32768"  # Using Mixtral for its strong performance and context length
        logger.debug(f"AIService initialized with model: {self.model}")

    async def generate_flashcards(self, content: str, num_cards: int = 5, subject: Optional[str] = None) -> List[Dict[str, str]]:
        """Generate flashcards from content using AI."""
        logger.debug(f"Generating {num_cards} flashcards for subject: {subject}")
        prompt = self._create_flashcard_prompt(content, num_cards, subject)
        
        try:
            if not content.strip():
                logger.error("Empty content provided")
                raise ValueError("No content provided to generate flashcards from")

            logger.debug("Making API call to Groq")
            try:
                completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": "You are an expert educator specializing in creating effective flashcards for learning. Create clear, concise, and educational flashcards that follow best practices for learning and retention."},
                        {"role": "user", "content": prompt}
                    ],
                    model=self.model,
                    temperature=0.7,
                    max_tokens=2048
                )
            except Exception as api_error:
                logger.error(f"Groq API error: {str(api_error)}")
                if "api_key" in str(api_error).lower():
                    raise ValueError("Invalid or missing Groq API key. Please check your configuration.")
                raise ValueError(f"Error calling Groq API: {str(api_error)}")
            
            logger.debug("Successfully received response from Groq")
            flashcards = self._parse_ai_response(completion.choices[0].message.content)
            logger.debug(f"Generated {len(flashcards)} flashcards")
            
            if not flashcards:
                raise ValueError("No flashcards were generated from the content")
                
            return flashcards
            
        except Exception as e:
            logger.error(f"Error generating flashcards: {str(e)}")
            raise ValueError(str(e))

    async def improve_flashcard(self, question: str, answer: str) -> Dict[str, str]:
        """Improve a single flashcard using AI."""
        logger.debug(f"Improving flashcard - Question: {question[:50]}...")
        prompt = f"""Improve this flashcard while maintaining its educational value:
Question: {question}
Answer: {answer}

Make the question more precise and the answer more comprehensive yet concise.
Return the improved version in this format:
Question: [improved question]
Answer: [improved answer]"""

        try:
            logger.debug("Making API call to Groq for improvement")
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are an expert in educational content improvement."},
                    {"role": "user", "content": prompt}
                ],
                model=self.model,
                temperature=0.7
            )
            
            logger.debug("Successfully received improvement response")
            return self._parse_single_flashcard(completion.choices[0].message.content)
        except Exception as e:
            logger.error(f"Error improving flashcard: {str(e)}")
            return {"question": question, "answer": answer}

    async def translate_flashcard(self, question: str, answer: str, target_language: str) -> Dict[str, str]:
        """Translate a flashcard to the target language."""
        logger.debug(f"Translating flashcard to {target_language}")
        prompt = f"""Translate this flashcard to {target_language}:
Question: {question}
Answer: {answer}

Ensure the translation maintains the educational value and context.
Return the translated version in this format:
Question: [translated question]
Answer: [translated answer]"""

        try:
            logger.debug("Making API call to Groq for translation")
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": f"You are an expert translator to {target_language}."},
                    {"role": "user", "content": prompt}
                ],
                model=self.model,
                temperature=0.7
            )
            
            logger.debug("Successfully received translation response")
            return self._parse_single_flashcard(completion.choices[0].message.content)
        except Exception as e:
            logger.error(f"Error translating flashcard: {str(e)}")
            return {"question": question, "answer": answer}

    def _create_flashcard_prompt(self, content: str, num_cards: int, subject: Optional[str] = None) -> str:
        """Create a prompt for flashcard generation."""
        subject_context = f" about {subject}" if subject else ""
        return f"""Create {num_cards} educational flashcards{subject_context} from the following content:

{content}

Follow these guidelines:
1. Questions should be clear and specific
2. Answers should be concise but comprehensive
3. Focus on key concepts and important details
4. Use appropriate terminology for the subject matter
5. Ensure questions promote understanding, not just memorization

Return the flashcards in this format:
Question: [question]
Answer: [answer]

[Repeat for each flashcard]"""

    def _parse_ai_response(self, response: str) -> List[Dict[str, str]]:
        """Parse AI response into a list of flashcards."""
        logger.debug("Parsing AI response into flashcards")
        flashcards = []
        current_card = {}
        
        for line in response.split('\n'):
            line = line.strip()
            if line.startswith('Question:'):
                if current_card and 'question' in current_card and 'answer' in current_card:
                    flashcards.append(current_card)
                current_card = {'question': line[9:].strip()}
            elif line.startswith('Answer:'):
                if 'question' in current_card:
                    current_card['answer'] = line[7:].strip()
        
        if current_card and 'question' in current_card and 'answer' in current_card:
            flashcards.append(current_card)
        
        logger.debug(f"Parsed {len(flashcards)} flashcards from response")
        return flashcards

    def _parse_single_flashcard(self, response: str) -> Dict[str, str]:
        """Parse AI response for a single flashcard."""
        logger.debug("Parsing single flashcard response")
        lines = response.split('\n')
        card = {}
        
        for line in lines:
            line = line.strip()
            if line.startswith('Question:'):
                card['question'] = line[9:].strip()
            elif line.startswith('Answer:'):
                card['answer'] = line[7:].strip()
        
        logger.debug(f"Parsed flashcard: {bool(card)}")
        return card if card else {"question": "", "answer": ""}
