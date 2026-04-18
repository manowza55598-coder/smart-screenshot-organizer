from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

# Import your engines
from ocr_engine import extract_text
from nlp_processor import process_text

app = FastAPI()

# Allow Next.js to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Real-World Upgraded Categorization (Syntax Fixed)
def classify(text: str) -> str:
    # 1. Empty Text Check: Send blank images straight to General
    if not text or len(text.strip()) == 0:
        return "General"
        
    text_lower = text.lower()
    
    # DEFINE ALL DICTIONARIES FIRST (This fixes the syntax error)
    document_keywords = [
        "ใบเสร็จ", "invoice", "tax id", "เลขที่", "เอกสาร", "สัญญา", 
        "ใบกำกับภาษี", "ใบเสนอราคา", "ใบสั่งซื้อ", "ใบส่งสินค้า", "receipt",
        "เลขประจำตัวผู้เสียภาษี", "รวมทั้งสิ้น", "ภาษีมูลค่าเพิ่ม", "vat",
        "เงื่อนไขการชำระเงิน", "ลายมือชื่อ", "ผู้รับเงิน", "customer"
    ]
    
    financial_keywords = [
        "บาท", "scb", "kbank", "promptpay", "พร้อมเพย์", "โอนเงิน", "สลิป",
        "โอนเงินสำเร็จ", "รายการสำเร็จ", "รหัสอ้างอิง", "ref.", "บัญชีผู้รับ", 
        "บัญชีผู้โอน", "ktb", "bbl", "ttb", "bay", "gsb", "truemoney", 
        "ทรูมันนี่", "shopeepay", "ยอดเงิน", "ค่าธรรมเนียม", "ผู้โอน"
    ]
    
    chat_keywords = [
        "แชท", "line", "พิมพ์", "อ่านแล้ว", "seen", "ข้อความ", "chat", "message", 
        "555", "hahaha", "lol", "กำลังพิมพ์", "ส่งสติกเกอร์", "ส่งรูปภาพ", 
        "ยกเลิกข้อความ", "ตอบกลับ", "สายเรียกเข้า", "โทร", "โอเค", "จร้า", "ครับผม", "ค่าา"
    ]

    # NOW RUN THE LOGIC CHAIN
    if any(word in text_lower for word in document_keywords):
        return "Document"
    elif any(word in text_lower for word in financial_keywords):
        return "Financial Slip"
    elif any(word in text_lower for word in chat_keywords):
        return "Chat"
        
    # True Default: If it has text but doesn't match any category
    return "General"


@app.post("/api/v1/analyze")
async def analyze_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 1. OCR Extraction
        ocr_result = extract_text(temp_path)
        
        # 2. NLP Processing (Strictly Entities)
        nlp_result = process_text(ocr_result["text"])
        
        # 3. Categorize
        category = classify(ocr_result["text"])
        
        os.remove(temp_path)
        
        # 4. Clean Return Payload
        return {
            "category": category,
            "raw_text": ocr_result["text"],
            "entities": nlp_result["entities"]
        }
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return {"error": str(e)}