from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.cell(30, 10, 'Maintenance Report', 0, 0, 'C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

pdf = PDF()
pdf.add_page()
pdf.set_font('Arial', '', 12)
pdf.cell(0, 10, 'Equipment Tag: P-101', 0, 1)
pdf.cell(0, 10, 'Date of Maintenance: 2023-10-12', 0, 1)
pdf.cell(0, 10, 'Description: Replaced the main bearing on pump P-101 due to excessive vibration.', 0, 1)
pdf.cell(0, 10, 'Inspector: John Doe', 0, 1)
pdf.ln(10)
pdf.cell(0, 10, 'Equipment Tag: V-2005', 0, 1)
pdf.cell(0, 10, 'Date of Maintenance: 2023-11-05', 0, 1)
pdf.cell(0, 10, 'Description: Pressure vessel V-2005 inspected. No anomalies found.', 0, 1)

pdf.output('sample_maintenance_report.pdf', 'F')
