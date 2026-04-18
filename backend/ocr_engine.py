import pytesseract
from PIL import Image
import cv2
import numpy as np
import config

if config.TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = config.TESSERACT_PATH

def extract_text(image_path: str) -> dict:
    img_cv = cv2.imread(image_path)
    
    # 1. Scale the image up 2x (This is still the secret weapon for OCR)
    img_cv = cv2.resize(img_cv, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    
    # 2. Convert to Grayscale (Keep the shades of gray, don't delete them)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    
    # 3. Soft Contrast Boost (Instead of harsh black/white thresholding)
    # alpha = contrast control (1.2 is a 20% boost), beta = brightness control
    enhanced = cv2.convertScaleAbs(gray, alpha=1.2, beta=10)
    
    preprocessed = Image.fromarray(enhanced)
    
    try:
        # 4. Use --psm 3 (Fully automatic page segmentation) 
        # Removed the blacklist so it stops crashing on emojis/weird characters
        custom_config = r'--psm 3'
        
        raw_text = pytesseract.image_to_string(preprocessed, lang='tha+eng', config=custom_config)
        
        # Clean up the output using pure Python
        clean_lines = [line.strip() for line in raw_text.split('\n') if len(line.strip()) > 1]
        final_text = '\n'.join(clean_lines)
        
        return {"text": final_text, "confidence": "High", "lang": "tha+eng"}
        
    except Exception as e:
        print(f"OCR Error: {e}")
        return {"text": "", "confidence": "Low", "lang": "none"}