#!/usr/bin/env python3
"""Render the Tre Canne menu from assets/table-menu/menu.json (standard library only)."""
from pathlib import Path
from html import escape
import json
ROOT=Path(__file__).resolve().parents[1]
menu=json.loads((ROOT/'assets/table-menu/menu.json').read_text())
def attrs(words):return ' '.join('data-'+lang+'="'+escape(text,quote=True)+'"' for lang,text in words.items())
def tr(en,ru,sr):return {'en':en,'ru':ru,'sr':sr}
def text(tag,words,extra=''):return f'<{tag} {extra} {attrs(words)}>{words["en"]}</{tag}>'
chips=[];sections=[]
for cat in menu['categories']:
 cid=cat['id'];words=cat['name']
 chips.append(text('a',words,f'class="chip" href="#{cid}"'))
 section=f'<section class="menu" id="{cid}" aria-labelledby="{cid}-title">\n'+text('h2',words,f'id="{cid}-title"')+'\n'
 if cat['show_sizes']:section+=text('p',tr('Where two prices are shown: S / L','Две цены: маленький / большой','Dvije cijene: mali / veliki'),'class="legend"')+'\n'
 section+='<ul class="items">\n'
 for key in cat['items']:
  item=menu['items'][key]
  name=text('span',item['name'])
  if item.get('note'):name+=' '+text('span',item['note'],'class="item-note"')
  section+=f'<li data-item-id="{key}"><span class="item-name">{name}</span><span class="item-dots" aria-hidden="true"></span><span class="item-price">{escape(item["price"])}</span></li>\n'
 section+='</ul>\n</section>';sections.append(section)
html='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#F7F3EC">
<title>WaxBrew Tre Canne — Menu</title>
<meta name="description" content="WaxBrew Tre Canne menu in Budva: specialty coffee, breakfast, food and desserts. Prices in EUR. English, Serbian and Russian.">
<link rel="canonical" href="https://waxbrew.com/tre-canne/menu/">
<meta property="og:type" content="website">
<meta property="og:title" content="WaxBrew Tre Canne — Menu">
<meta property="og:description" content="Coffee, food & desserts · EN / SR / RU">
<meta property="og:url" content="https://waxbrew.com/tre-canne/menu/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/table-menu/menu.css">
<script src="/assets/analytics.js"></script>
</head>
<body>
'''
html+=text('a',tr('Skip to menu','Перейти к меню','Pređite na meni'),'class="skip-link" href="#popular"')
html+='''
<header class="topbar">
  <div class="topbar-inner">
    <div class="brand">
      <a class="brand-name" href="#top">Wax<span>Brew</span></a>
      <span class="brand-note">Tre Canne</span>
    </div>
    <div class="utility-row">
'''+text('span',tr('Coffee · Food','Кофе · Еда','Kafa · Hrana'),'class="brand-note"')+'''
      <div class="lang-switch" role="group" aria-label="Language / Jezik / Язык">
        <button class="lang-btn" type="button" data-lang="en" lang="en" aria-pressed="true">EN</button>
        <button class="lang-btn" type="button" data-lang="sr" lang="sr" aria-pressed="false">SR</button>
        <button class="lang-btn" type="button" data-lang="ru" lang="ru" aria-pressed="false">RU</button>
      </div>
    </div>
  </div>
  <nav class="chips" aria-label="Menu categories">'''+''.join(chips)+'''</nav>
</header>
<main class="wrap" id="top">
  <div class="hero">
'''+text('h1',tr('The<br><em>Menu</em>','Наше<br><em>Меню</em>','Naš<br><em>Meni</em>'),'class="display"')+text('p',tr('Specialty coffee, seasonal drinks and all-day food. All prices in EUR.','Спешелти кофе, сезонные напитки и еда весь день. Все цены в евро.','Specialty kafa, sezonski napici i hrana tokom cijelog dana. Sve cijene su u eurima.'))+'''
  </div>
  <section class="breakfast" aria-label="Breakfast / Doručak / Завтрак">
'''+text('h2',tr('Breakfast<br>All Inclusive','Завтрак<br>Всё включено','Doručak<br>Sve uključeno'))+f'<div class="price-tag">{escape(menu["breakfast_price"])} €</div>'+text('p',tr('One main of your choice — granola with yogurt, milk porridge with pear, syrniki with sour cream or Nutella, crepes with ham &amp; cheese — plus a croissant, espresso / americano or small cappuccino, and fresh orange juice 250&nbsp;ml.','Основное блюдо на выбор — гранола с йогуртом, молочная каша с грушей, сырники со сметаной или Nutella, блины с ветчиной и сыром — плюс круассан, эспрессо / американо или малый капучино и апельсиновый фреш 250&nbsp;мл.','Glavno jelo po izboru — granola sa jogurtom, mliječna kaša sa kruškom, sirniki sa kiselom pavlakom ili Nutellom, palačinke sa šunkom i sirom — uz kroasan, espreso / amerikano ili mali kapućino i svježe cijeđeni sok od narandže 250&nbsp;ml.'))+text('div',tr('Served all day · from 7:30','Весь день · с 7:30','Cijelog dana · od 7:30'),'class="when"')+text('a',tr('See breakfast options →','Посмотреть завтраки →','Pogledajte doručak →'),'class="breakfast-link" href="/all-day-breakfast/" data-menu-link="breakfast"')+'''
  </section>
'''+ '\n'.join(sections)+'''
</main>
<footer>
  <div class="wrap">
    <div class="foot-brand">Wax<span>Brew</span> · Tre Canne</div>
    <p>'''+text('a',tr('How to find us inside','Как найти нас внутри','Kako nas naći unutra'),'href="/tre-canne#how-to-find" data-menu-link="directions"')+'''</p>
    <p><a href="/" data-menu-link="home">waxbrew.com</a></p>
  </div>
</footer>
<script src="/assets/i18n.js"></script>
<script src="/assets/table-menu/menu.js"></script>
</body>
</html>
'''
out=ROOT/'tre-canne/menu/index.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html)
print('Rendered',out)
