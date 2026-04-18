import re
from pythainlp.tokenize import word_tokenize
from pythainlp.corpus.common import thai_stopwords

STOPWORDS = thai_stopwords()

PATTERNS = {
    "amount": r"([\d,]+\.\d{2})\s*[บU]าท",
    "date": r"(\d{1,2}\s+(?:ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s*\d{2,4}|\d{1,2}/\d{1,2}/\d{4})",
    "time": r"([0-2]?\d:[0-5]\d(?::[0-5]\d)?|[0-2]?\d\.[0-5]\d\s*น\.)",
    "bank": r"(กสิกรไทย|กรุงไทย|ไทยพาณิชย์|SCB|KBank|PromptPay|พร้อมเพย์)",
    "person": r"(?:น\.\s*ส\.|นางสาว|นาย|นาง|คุณ|เด็กหญิง|เด็กชาย)(?!\s*(?:ได้|คือ|จะ|โปรด|กรุณา|รับ|ทำ|สำเร็จ|ของ))\s*([ก-๙a-zA-Z]{2,}(?:\s+[ก-๙a-zA-Z]{2,})?)",
    "document_no": r"(?:เลขที่|Invoice No|Receipt No)[\s\.:]*([A-Za-z0-9-]+)",
    "tax_id": r"(?:ผู้เสียภาษี|Tax ID)[\s\.:]*(\d{13}|\d{1}-\d{4}-\d{5}-\d{2}-\d{1})",
    "phone": r"(0[689]\d{1}-?\d{3,4}-?\d{4})",
    "email": r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"
}

def process_text(raw_text: str) -> dict:
    tokens = word_tokenize(raw_text, engine="newmm")
    clean_tokens = [t for t in tokens if t.strip() and t not in STOPWORDS]
    
    entities = {}
    for entity_type, pattern in PATTERNS.items():
        matches = re.findall(pattern, raw_text)
        if matches:
            entities[entity_type] = [m.strip() for m in matches]
            
    return {"tokens": clean_tokens, "entities": entities}