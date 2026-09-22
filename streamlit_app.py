import streamlit as st
from PIL import Image
# Adjust import paths based on your folder structure (e.g., from backend.ocr_engine...)
from backend.ocr_engine import extract_text # example function name
from backend.nlp_processor import process_text # example function name

st.set_page_config(page_title="Smart Screenshot Organizer", layout="centered")

st.title("📸 Smart Screenshot Organizer")
st.write("Upload a screenshot to extract text and organize it.")

uploaded_file = st.file_uploader("Choose a screenshot...", type=["png", "jpg", "jpeg"])

if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Screenshot", use_column_width=True)
    
    with st.spinner("Processing image with AI..."):
        # 1. OCR Extraction
        raw_text = extract_text(image)
        
        # 2. NLP Processing
        results = process_text(raw_text)
        
    st.success("Done!")
    st.subheader("Extracted Text & Categories")
    st.write(results)
