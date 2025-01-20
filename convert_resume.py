from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.units import inch

def create_pdf(input_file, output_file):
    doc = SimpleDocTemplate(output_file, pagesize=letter)
    story = []
    
    with open(input_file, 'r') as file:
        content = file.read()
    
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
                        line = '    • ' + line[1:].strip()
                
                p = Paragraph(line, style)
                story.append(p)
        
        # Add space between sections
        story.append(Spacer(1, 12))
    
    doc.build(story)

# Convert the resume
create_pdf('test_resume.txt', 'test_resume.pdf')
