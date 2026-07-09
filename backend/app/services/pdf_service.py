from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Flowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

class PDFService:
    @staticmethod
    def generate_contract_pdf(title: str, content: str) -> bytes:
        """Generates a high-quality PDF from contract content using ReportLab."""
        buffer = BytesIO()
        
        # Standard Letter size document with 1 inch (72 points) margins
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=letter, 
            rightMargin=72, 
            leftMargin=72, 
            topMargin=72, 
            bottomMargin=72
        )
        
        story: list[Flowable] = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            name='ContractTitle',
            parent=styles['Heading1'],
            alignment=TA_CENTER,
            spaceAfter=20,
            fontSize=16,
            leading=20
        )
        
        body_style = ParagraphStyle(
            name='ContractBody',
            parent=styles['Normal'],
            alignment=TA_JUSTIFY,
            fontSize=10,
            leading=14,
            spaceAfter=8
        )
        
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 12))
        
        paragraphs = content.split('\n')
        for p in paragraphs:
            p_text = p.strip()
            if p_text:
                story.append(Paragraph(p_text, body_style))
            else:
                story.append(Spacer(1, 6))
                
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
