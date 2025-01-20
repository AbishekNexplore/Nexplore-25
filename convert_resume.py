from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.units import inch
import re

def clean_text(text):
    # Replace problematic characters
    text = text.replace('•', '-')  # Replace bullet points
    text = text.replace('"', '"').replace('"', '"')  # Replace smart quotes
    text = text.replace(''', "'").replace(''', "'")  # Replace smart apostrophes
    # Remove any other non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    return text

def create_pdf(input_file, output_file):
    doc = SimpleDocTemplate(output_file, pagesize=letter)
    story = []
    
    # Read with UTF-8 encoding
    with open(input_file, 'r', encoding='utf-8') as file:
        content = clean_text(file.read())
    
    # Split content into sections
    sections = content.split('\n\n')
    
    for section in sections:
        lines = section.strip().split('\n')
        for line in lines:
            if line.strip():
                if line.isupper():
                    # Section headers
                    style = ParagraphStyle(
                        'Header',
                        fontSize=12,
                        spaceAfter=12,
                        spaceBefore=12,
                        fontName='Helvetica-Bold'
                    )
                elif lines.index(line) == 0 and section == sections[0]:
                    # Name
                    style = ParagraphStyle(
                        'Name',
                        fontSize=16,
                        spaceAfter=12,
                        fontName='Helvetica-Bold'
                    )
                else:
                    # Regular text
                    style = ParagraphStyle(
                        'Normal',
                        fontSize=10,
                        spaceAfter=6,
                        fontName='Helvetica'
                    )
                    if line.startswith('-'):
                        line = '    ' + line  # Add indentation for bullet points
                
                # Escape special characters for ReportLab
                line = line.replace('&', '&amp;')
                line = line.replace('<', '&lt;')
                line = line.replace('>', '&gt;')
                
                p = Paragraph(line, style)
                story.append(p)
        
        # Add space between sections
        story.append(Spacer(1, 12))
    
    doc.build(story)

# Convert both resumes
create_pdf('test_resume.txt', 'test_resume.pdf')
create_pdf('test_resume2.txt', 'test_resume2.pdf')
print("Conversion completed successfully!")
