CATEGORIES = {
    "Financial": {
        "keywords": ["บาท", "โอนเงิน", "ชำระเงิน", "ค่าธรรมเนียม", "สลิป", "ธนาคาร", "ธ.", "บัญชี", "กสิกร", "SCB", "PromptPay", "สำเร็จ"],
        "intent": "Transaction Confirmation"
    },
    "Documents": {
        "keywords": ["invoice", "ใบแจ้งหนี้", "สัญญา", "เอกสาร", "รายงาน", "ใบเสร็จ", "tax"],
        "intent": "Official Document"
    },
    "Chat": {
        "keywords": ["ส่งข้อความ", "ตอบกลับ", "แชท", "LINE", "พิมพ์", "อ่านแล้ว", "seen", "อ่าน", "ข้อความ", "chat", "conversation","reply", "message","555", "hahaha", "lol"],
        "intent": "Conversation"
    },
    "General": {
        "keywords": [],
        "intent": "General Information"
    }
}
# On Mac, Homebrew puts it in the PATH automatically, so None is perfect.
TESSERACT_PATH = None