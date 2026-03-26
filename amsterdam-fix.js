/* Amsterdam fix v9 - MutationObserver za counter */
(function(){
  var s=document.createElement('style');
  s.textContent=[
    '#amsterdam-pages{display:flex!important;flex-direction:row!important;min-height:800px!important;overflow:hidden!important;align-items:stretch!important;}',
    '#amsterdam-pages .book-page-slide{flex:0 0 50%!important;width:50%!important;min-height:800px!important;overflow:visible!important;padding:3rem 3.8rem 5.5rem!important;box-sizing:border-box!important;display:none!important;opacity:1!important;animation:none!important;}',
    '#amsterdam-pages .book-page-slide.active{display:block!important;opacity:1!important;animation:none!important;}',
    '#amsterdam-pages .book-page-slide.right-visible{display:block!important;opacity:1!important;animation:none!important;}',
    '#amsterdam-counter-outer{text-align:center;font-size:0.85rem;color:rgba(200,169,110,0.8);letter-spacing:0.15em;padding:0.6rem 0 0.2rem;font-family:Lora,Georgia,serif;}',
    '#page-nocno-nebo .book-nav .book-counter{display:none!important;}',
    '@media(max-width:767px){#amsterdam-pages{display:block!important;min-height:unset!important;overflow:visible!important;}',
    '#amsterdam-pages .book-page-slide{width:100%!important;flex:none!important;min-height:unset!important;padding:1.5rem 1.2rem 3rem!important;}',
    '#amsterdam-pages .book-page-slide.right-visible{display:none!important;}}'
  ].join('');
  document.head.appendChild(s);

  window.amstCharsPerPage=function(){return window.innerWidth>=768?1100:500;};

  /* Override amstUpdateCounter to also fill counter-outer */
  function patchCounter(){
    window.amstUpdateCounter=function(){
      var sl=Array.from(document.querySelectorAll('#amsterdam-pages .book-page-slide'));
      var tot=sl.length;if(!tot)return;
      var cur=sl.findIndex(function(s){return s.classList.contains('active');});
      var txt=(cur+1)+' / '+tot;
      var c=document.getElementById('amsterdam-counter');if(c)c.textContent=txt;
      var co=document.getElementById('amsterdam-counter-outer');if(co)co.textContent=txt;
    };
  }

  /* Patch immediately and also when Amsterdam page becomes active */
  patchCounter();
  var obs=new MutationObserver(function(){
    var page=document.getElementById('page-nocno-nebo');
    if(page&&page.classList.contains('active')){
      patchCounter();
      setTimeout(function(){
        var sl=document.querySelectorAll('#amsterdam-pages .book-page-slide');
        if(sl.length>0)window.amstUpdateCounter();
      },100);
    }
  });
  obs.observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
})();

/* Kuba fix v1 - Fix navigacija knjige: sledeca/prethodna pomera za 2 strane (spread) */
(function(){
    function fixKubaNav(){
          var slides=document.querySelectorAll('#kuba-pages .book-page-slide');
          if(!slides||!slides.length)return;
          function showSpread(dir){
                  var sl=Array.from(slides);
                  var ai=sl.findIndex(function(s){return s.classList.contains('active');});
                  if(ai<0)ai=0;
                  var ni=ai+dir*2;
                  if(ni<0)ni=0;
                  if(ni>=sl.length)return;
                  sl.forEach(function(s){s.classList.remove('active','right-visible');});
                  sl[ni].classList.add('active');
                  if(ni+1<sl.length)sl[ni+1].classList.add('right-visible');
                  var sp=Math.floor(ni/2)+1;
                  var tot=Math.ceil(sl.length/2);
                  var co=document.getElementById('kuba-counter-outer');if(co)co.textContent=sp+' / '+tot;
                  var ci=document.getElementById('kuba-counter');if(ci)ci.textContent=sp+' / '+tot;
                  if(window.kubaBookPage!==undefined)window.kubaBookPage=ni;
          }
          window.kubaNext=function(){showSpread(1);};
          window.kubaPrev=function(){showSpread(-1);};
    }
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fixKubaNav);}
    else{fixKubaNav();}
    var obs2=new MutationObserver(function(){
          var kp=document.getElementById('page-kuba');
          if(kp&&kp.classList.contains('active'))fixKubaNav();
    });
    obs2.observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
})();

/* ===== EGIPAT FIX ===== */
(function(){
var P=["Egipat — vitamin D i pasoš","Putopis iz oktobra 2021.","I. Deficit","Korona je 2021. bila u punom zamahu, a ja sam bio u punom deficitu vitamina D.","Sećamo se svi onog perioda — zatvaranje, ne izlaženje, onaj čudni tihi tok života u kom je odlazak do prodavnice izgledao kao mali podvig. A onda je nebo otvorilo granice i svi su stidljivo počeli da putuju — kao što se izlazi iz zatvora posle duge kazne.","Te godine sam trebao da putujem u Tivat. A onda sam propustio let u poslednjem trenutku.","Moje telo je reagovalo odmah. Počelo je da vapi. Vitamin D. More. Sunce. Bilo šta što nije Beograd u oktobru.","Egipat mi nikad nije bio visoko na listi. Ipak, kada turistička agencija čiji je vlasnik Egipćanin počne da te bombarduje povoljnim ponudama — deset noćenja, all inclusive, hotel četiri ili pet zvezdica — deficit vitamina D počne sam da donosi odluke umesto tebe.","Oktobar. Drugar. Paket aranžman. PCR test od sedamdeset evra.","A onda je univerzum ubacio jedan telefonski poziv. Dalji rodak radi na Torlaku. Živi na Ceraku, pet minuta od mog stana.","Dogovor je bio jednostavan. Ujutro me sačekao na parkingu u pidžami — jednom rukom termos kafe, drugom vrećica sa laboratorijskom aparaturom. Mi pretvaramo kapak gepeka u improvizovani laboratorijski sto.","Test je bio negativan. Pečat je dobio svežijeg datuma. Nije baš po knjizi. Ali rodja se potrudio. I sunce me je čekalo.","Košava je produvala Beograd taj dan. Za par sati će sve to izaći iz mene, negde nad Mediteranom.","II. Sletanje — Hurghada","Let do Hurgade — tri sata. Sletanje — dva pokušaja. Drugi pokušaj uspešan. Aplauz koji je usledio bio je od srca.","Vazduh koji ti udari u lice čim se otvore vrata aviona — miriše na malo soli, malo peska i na toplinu.","Sa jedne strane palme i zelena trava. A onda okrenete pogled i vidite nepreglednu pustinju, kuće bez prozora. Glamur i beda na razmaku od deset metara.","Ulazimo u velelepni hol sa ogromnom centralnom fontanom. Crvena narukvica oko ruke. All inclusive se otvara.","III. Teritorija — Strategija ležaljke","Pronašli smo mesto blizu šanka — strateška odluka posle prvog iskustva s toplim pivom. I tu smo ostali do kraja letovanja.","Na šanku nas je čekao naš novi prijatelj. Za koji dolar bakšiša — velika čaša, hladno pivo i nasmejano lice. Jugoslavija na dvadesetak ležaljki u Egiptu.","IV. Doktor sa šanka","Posle par dana stomak je odlučio da se oglasi. Možda bakterije, možda začini, možda voda. Naravno da sam pio probiotik. Naravno da nije pomoglo.","Prošao pored šanka. Naš prijatelj pogledao onim pogledom koji ne traži objašnjenje. Nisam znao da imam lekara na šanku.","Sipa mi u malu čašu neko providno piće i kiselu vodu. Cimnuo sam obe čaše — i kad sam ih otvorio, još jedna tura: Van mor tajm. Stomak je prestao da me muči.","To piće zove se arak — anis. Radi bolje od svakog probiotika. Od tog trenutka — bila je to terapija.","U nekom ćutanju začuo sam zapomaganje. Nikola. Zrenjaninac. Pozivam ga u ordinaciju na šanku. Medicina se deli.","V. Dno mora","Ronjenje za upola manje od hotelske cene. Dolazi nasumičan lik u Mitsubishi Lanceru 2005. godište. Kupimo još jedan par iz Mladenovca.","Sat i po vožnje — filozofija. Tamo voze kao da su propisi više predlog nego obaveza. Svirne jednom za desno, dva puta za levo — skloni se.","Na brodu usmena obuka. A onda pritisak u ušima. Instruktor me vukao dublje. Istrgnuo sam se i izronio.","I onda se desilo ono zbog čega se sve isplatilo. Ogroman morski greben kao dvorac — stvorenja svih boja i veličina. Tišina ispunjena bojama.","Primetio sam da zaposleni dižu boce sa kiseonikom kao da su od pera. Glava me je bolela. Nije bio delfin — bio je arapin koji je potrošio kiseonik iz moje boce.","VI. Sto za šestoro","Srećem Nikolu. Priključuje se još jedan par iz Novog Sada. Ta medicina se prenosi s kolena na koleno. Upoznao sam ljude s kojima sam ostao u kontaktu do danas.","Pojavio se Lala. Vojvođanin, razvlači reči. Bio je PCR pozitivan u karantinu. Za par desetina dolara dobio slobodu. Pronašao, ekspresno, ženu svog života.","VII. Kvadovi i pogrešna utakmica","Naleteo na odbojkašku utakmicu Srbija — Poljska. Pet setova, izgubili. Saznali da se taj meč odigrao mesecima unazad.","Vožnja kvadovima po pustinji. Svi prodavci su me zvali Serbian boss. Zalazak sunca — nebo u dvadesetak nijansi narandžaste, pesak uhvati isti ton.","VIII. Povratak","Na aerodromu nasumično birali putnike. Svi prošli — sem Ladislava koji je odležao dve nedelje kući.","Nije bila ono što sam očekivao. Bila je manje. I bila je više — zbog parking-laboratorijuma u pidžami, zbog anisa koji leči bez dijagnoze, zbog Lancera iz 2005, zbog prazne boce kiseonika.","Vitamin D na maksimumu. Novi drugari. Jedno novo bogatstvo.","— Hurghada / Beograd, oktobar 2021."];
function bp(pp){var pages=[],c='';for(var i=0;i<pp.length;i++){var p=pp[i];if(c.length>0&&c.length+p.length+2>amstCharsPerPage()/2){pages.push(c);c='';}c=c.length>0?c+'\n\n'+p:p;}if(c.length>0)pages.push(c);return pages;}
window.egipatSetup=function(){
  var cont=document.getElementById('egipat-pages');
  if(!cont)return;
  cont.innerHTML='';
  var pages=bp(P);
  for(var i=0;i<pages.length;i++){
    var sl=document.createElement('div');
    sl.className='book-page-slide'+(i===0?' active':'');
    if(i===1)sl.classList.add('right-visible');
    pages[i].split('\n\n').forEach(function(t){
      var p=document.createElement('p');p.className='book-page-text';p.textContent=t;sl.appendChild(p);
    });
    cont.appendChild(sl);
  }
  var tot=cont.children.length,n=0,pairTot=Math.ceil(tot/2);
  var co=document.getElementById('egipat-counter-outer');
  var pv=document.getElementById('egipat-prev'),nx=document.getElementById('egipat-next');
  function sh(i){
    n=i;
    Array.from(cont.children).forEach(function(s,j){
      s.classList.remove('active','right-visible');
      if(j===i)s.classList.add('active');
      if(j===i+1)s.classList.add('right-visible');
    });
    if(co)co.textContent=(Math.floor(i/2)+1)+' / '+pairTot;
    if(pv)pv.disabled=(i===0);
    if(nx)nx.disabled=(i+2>=tot);
  }
  window.egipatNext=function(){if(n+2<tot)sh(n+2);};
  window.egipatPrev=function(){if(n>=2)sh(n-2);};
  sh(0);
};
window.egipatNext=function(){};
window.egipatPrev=function(){};
// Watch for egipat page becoming active
new MutationObserver(function(){
  var ep=document.getElementById('page-egipat');
  if(ep&&ep.classList.contains('active')&&!ep.getAttribute('data-eg-done')){
    ep.setAttribute('data-eg-done','1');
    window.egipatSetup();
  }
}).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
})();