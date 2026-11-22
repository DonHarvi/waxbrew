"""Build campaign landing variants from the maintained breakfast pages."""
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
TEXT={
 'sr':dict(base='dorucak',route='dorucak/poklon',title='Doručak za 10 € + desert na poklon | WaxBrew Tre Canne',gift='+ Desert na poklon',lead='Uz kupon: brauni, kolač od limuna ili čizkejk na poklon — izaberite jedan.',claim='Preuzmi kupon',coupon='Vaš poklon uz doručak',loading='Učitavamo ponudu…',noscript='Za otvaranje kupona uključite JavaScript i otvorite link iz objave blogera.',heading='Desert na poklon',subtitle='Uz naručeni doručak u WaxBrew Tre Canne.',demo='DEMO · Primjer kupona, ne važi za preuzimanje',terms='Jedan desert po gostu, samo uz naručeni doručak. Važi u WaxBrew Tre Canne do 31.12.2026. uključivo.',copy='Kopiraj kod',screenshot='Napravite snimak ekrana ovog kupona i pokažite ga baristi pri naručivanju doručka.',how='Kako preuzeti poklon',steps=['Otvorite kupon preko linka vašeg blogera.','Sačuvajte snimak ekrana kupona.','Pokažite kupon baristi i naručite doručak.'],loyalty='Svaka šesta kafa je poklon.',loyaltylink='Upoznajte naš WhatsApp program lojalnosti',inside='Kako nas naći unutra',directions='Pronađi put'),
 'ru':dict(base='zavtrak',route='zavtrak/podarok',title='Завтрак за 10 € + десерт в подарок | WaxBrew Tre Canne',gift='+ Десерт в подарок',lead='По купону — брауни, лимонный кекс или чизкейк в подарок. Выберите один.',claim='Забрать купон',coupon='Ваш подарок к завтраку',loading='Загружаем предложение…',noscript='Чтобы открыть купон, включите JavaScript и перейдите по ссылке из публикации блогера.',heading='Десерт в подарок',subtitle='При заказе завтрака в WaxBrew Tre Canne.',demo='ДЕМО · Образец купона, не для получения подарка',terms='Один десерт на гостя, только при заказе завтрака. Действует в WaxBrew Tre Canne до 31.12.2026 включительно.',copy='Скопировать код',screenshot='Сделайте скриншот этого купона и покажите бариста при заказе завтрака.',how='Как получить подарок',steps=['Откройте купон по ссылке вашего блогера.','Сохраните скриншот купона.','Покажите купон бариста и закажите завтрак.'],loyalty='Каждая шестая чашка кофе — в подарок.',loyaltylink='Подробнее о программе лояльности в WhatsApp',inside='Как найти нас внутри',directions='Проложить маршрут'),
 'en':dict(base='all-day-breakfast',route='all-day-breakfast/gift',title='€10 breakfast + a free dessert | WaxBrew Tre Canne',gift='+ A free dessert',lead='Choose a complimentary brownie, lemon cake or cheesecake with your creator’s coupon.',claim='Get your coupon',coupon='Your breakfast gift',loading='Loading the offer…',noscript='Enable JavaScript and open your creator’s link to access the coupon.',heading='A complimentary dessert',subtitle='With a breakfast order at WaxBrew Tre Canne.',demo='DEMO · Sample coupon, not valid for redemption',terms='One dessert per guest, with a breakfast order only. Valid at WaxBrew Tre Canne through 31 December 2026 inclusive.',copy='Copy code',screenshot='Take a screenshot of this coupon and show it to the barista when ordering breakfast.',how='How to get your gift',steps=['Open your coupon using your creator’s link.','Save a screenshot of the coupon.','Show it to the barista and order breakfast.'],loyalty='Every sixth coffee is a gift.',loyaltylink='Explore our WhatsApp loyalty programme',inside='How to find us inside',directions='Get directions')
}
for lang,t in TEXT.items():
 html=(ROOT/t['base']/'index.html').read_text()
 html=re.sub(r'<title>.*?</title>',f'<title>{t["title"]}</title>',html)
 html=re.sub(r'<meta name="description" content="[^"]*">',f'<meta name="description" content="{t["lead"]}">\n<meta name="robots" content="noindex,follow">',html)
 for other in TEXT.values():
  html=html.replace(f'/{other["base"]}/',f'/{other["route"]}/')
 html=html.replace('<body>','<body class="offer-page">')
 html=html.replace('</head>','<link rel="stylesheet" href="/assets/breakfast/offer.css">\n</head>')
 html=html.replace('    <div class="hero-intro">','    <div class="hero-intro">\n      <div class="gift-kicker" data-gift-kicker>'+t['gift']+'</div>')
 html=re.sub(r'(<h1 id="breakfast-title">.*?</h1>\s*)<p>.*?</p>',lambda m:m[1]+f'<p>{t["lead"]}</p>',html,flags=re.S)
 # Keep direction links semantic so coupon actions never count as route clicks.
 html=re.sub(r'<a class="cta"[^>]*>.*?</a>',f'<button class="cta gift-button" type="button" data-open-coupon disabled>{t["claim"]}</button>',html,count=1)
 html=html.replace('<div class="inside-cta">',f'<div class="inside-cta"><a class="inside-link" href="https://maps.app.goo.gl/RknVLk8suPuqHojz6" target="_blank" rel="noopener" data-offer-directions>{t["directions"]}</a></div>\n      <div class="inside-cta">',1)
 block=f'''<section class="coupon-section" id="gift" aria-labelledby="gift-title">
  <h2 id="gift-title">{t['coupon']}</h2>
  <p class="offer-status" role="status" data-offer-status>{t['loading']}</p>
  <noscript><p>{t['noscript']}</p></noscript>
  <article class="coupon" id="breakfast-coupon" tabindex="-1" aria-labelledby="coupon-title" hidden>
    <div class="coupon-top"><span class="coupon-brand">WAXBREW</span><span class="coupon-location">Tre Canne · Budva</span></div>
    <p class="demo-label" data-demo-label hidden>{t['demo']}</p>
    <h3 id="coupon-title">{t['heading']}</h3>
    <p>{t['subtitle']}</p>
    <p data-eligible-desserts></p>
    <code class="coupon-code" data-coupon-code></code>
    <p data-creator-name></p>
    <p class="coupon-terms">{t['terms']}</p>
  </article>
  <div data-coupon-tools hidden>
    <p class="coupon-help">{t['screenshot']}</p>
    <button class="coupon-copy" type="button" data-copy-coupon>{t['copy']}</button>
    <p class="coupon-help" role="status" data-copy-status></p>
  </div>
  <div class="offer-how"><h3>{t['how']}</h3><ol>{''.join('<li>'+step+'</li>' for step in t['steps'])}</ol></div>
  <p class="offer-loyalty">{t['loyalty']} <a href="/loyalty/?lang={lang}" data-offer-loyalty>{t['loyaltylink']}</a></p>
</section>'''
 end=html.index('</section>',html.index('<section class="hero"'))+len('</section>')
 html=html[:end]+'\n\n'+block+html[end:]
 html=re.sub(r'(<div class="sticky">\s*)<a class="primary"[^>]*>.*?</a>',lambda m:m[1]+f'<button class="primary gift-button" type="button" data-open-coupon disabled>{t["claim"]}</button>',html)
 html=html.replace('<script src="/assets/breakfast-events.js"></script>','<script src="/assets/breakfast/offer.js"></script>')
 out=ROOT/t['route']/'index.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html)
 print('Built',out.relative_to(ROOT))
