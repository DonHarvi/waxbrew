#!/usr/bin/env python3
"""Build a direct-link QR and print-ready A6/A4 cards. Requires reportlab and Pillow."""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.graphics.barcode.qrencoder import QRCode, QRErrorCorrectLevel
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor,white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image,ImageDraw

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf';OUT.mkdir(parents=True,exist_ok=True)
ASSETS=ROOT/'assets/table-menu'
URL='https://waxbrew.com/tre-canne/menu/?from=table'
qr=QRCode(None,QRErrorCorrectLevel.M);qr.addData(URL);qr.make()
QUIET=4;N=qr.moduleCount+2*QUIET
matrix=qr.modules
INK='#211B14';PAPER='#F7F3EC';ORANGE='#E05A14';MUTED='#6E6557'
# True vector SVG and integer-module PNG, both with a four-module white quiet zone.
rects=[]
for row,values in enumerate(matrix):
 for col,dark in enumerate(values):
  if dark:rects.append(f'M{col+QUIET},{row+QUIET}h1v1h-1z')
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {N} {N}" width="{N*30}" height="{N*30}"><title>WaxBrew Tre Canne menu</title><desc>{escape(URL)}</desc><rect width="{N}" height="{N}" fill="white"/><path d="'+''.join(rects)+f'" fill="{INK}"/></svg>\n'
(ASSETS/'menu-qr.svg').write_text(svg)
scale=30;im=Image.new('RGB',(N*scale,N*scale),'white');draw=ImageDraw.Draw(im)
for row,values in enumerate(matrix):
 for col,dark in enumerate(values):
  if dark:draw.rectangle(((col+QUIET)*scale,(row+QUIET)*scale,(col+QUIET+1)*scale-1,(row+QUIET+1)*scale-1),fill=INK)
im.save(ASSETS/'menu-qr.png',dpi=(600,600))
font_dir=Path('/System/Library/Fonts/Supplemental')
for name,file in [('Brand','Arial Black.ttf'),('Body','Arial.ttf'),('BodyBold','Arial Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,str(font_dir/file)))
W,H=105*mm,148*mm

def centered(c,txt,top,font='Body',size=10,color=INK):
 c.setFillColor(HexColor(color));c.setFont(font,size);c.drawCentredString(W/2,H-top*mm,txt)

def draw_qr(c,x,y,side):
 c.setFillColor(white);c.rect(x,y,side,side,fill=1,stroke=0)
 unit=side/N;c.setFillColor(HexColor(INK))
 # Paint contiguous modules as row runs to avoid rendering seams.
 for row,values in enumerate(matrix):
  col=0
  while col<len(values):
   if not values[col]:col+=1;continue
   start=col
   while col<len(values) and values[col]:col+=1
   c.rect(x+(QUIET+start)*unit,y+(N-QUIET-row-1)*unit,(col-start)*unit,unit,fill=1,stroke=0)

def card(c,x=0,y=0):
 c.saveState();c.translate(x,y)
 c.setFillColor(HexColor(PAPER));c.roundRect(5*mm,5*mm,95*mm,138*mm,3*mm,stroke=0,fill=1)
 centered(c,'WAXBREW',18,'Brand',17)
 centered(c,'TRE CANNE · BUDVA',26,'BodyBold',8.5,MUTED)
 c.setStrokeColor(HexColor(ORANGE));c.setLineWidth(1.5);c.line(41*mm,H-32*mm,64*mm,H-32*mm)
 centered(c,'MENU',50,'Brand',42,ORANGE)
 centered(c,'MENI · МЕНЮ',58,'BodyBold',11)
 centered(c,'SCAN · SKENIRAJTE · СКАНИРУЙТЕ',66,'BodyBold',7.4)
 draw_qr(c,(W-55*mm)/2,H-125*mm,55*mm)
 centered(c,'waxbrew.com/tre-canne/menu',134,'Body',8.5)
 centered(c,'EN / SR / RU',140,'BodyBold',7,MUTED)
 c.restoreState()

single=OUT/'waxbrew-tre-canne-menu-a6.pdf'
c=canvas.Canvas(str(single),pagesize=(W,H),pageCompression=1);c.setTitle('WaxBrew Tre Canne — Table menu QR — A6');c.setAuthor('WaxBrew');card(c);c.showPage();c.save()
sheet=OUT/'waxbrew-tre-canne-menu-a4.pdf'
aw,ah=210*mm,297*mm;c=canvas.Canvas(str(sheet),pagesize=(aw,ah),pageCompression=1);c.setTitle('WaxBrew Tre Canne — Four A6 menu cards on A4');c.setAuthor('WaxBrew')
for x in (0,W):
 for y in (.5*mm,148.5*mm):card(c,x,y)
c.setStrokeColor(HexColor('#BBB4A9'));c.setLineWidth(.25);c.setDash(2,3)
c.line(W,4*mm,W,ah-4*mm);c.line(4*mm,148.5*mm,aw-4*mm,148.5*mm)
c.showPage();c.save()
print('QR URL:',URL,'; QR modules:',qr.moduleCount,'; quiet zone:',QUIET)
print(single);print(sheet)
