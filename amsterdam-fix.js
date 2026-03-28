—šć—žčžč—šđ—čššččćč—ćč—čž—šččŽžččž—ćčžščšćć———ššš—čžč—ššššćšš—žšš—ššžščššš—čšžščžžčžšššžšščšćčščš—ščć——ćčšččšššž—š—ššč—čššđž—ššćčšđččšžžšš—čščšćž—ž—čš—žćžščš—žč—/* Amsterdam fix v9 - MutationObserver za counter */
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
          window.kubaNext=function(){showSpread(2);};
          window.kubaPrev=function(){showSpread(-2);};
    }
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fixKubaNav);}
    else{fixKubaNav();}
    var obs2=new MutationObserver(function(){
          var kp=document.getElementById('page-kuba');
          if(kp&&kp.classList.contains('active'))fixKubaNav();
    });
    obs2.observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
})();


/* Egipat fix - dinamicka navigacija knjige */
(function(){
  var PARAS=["Egipat — vitamin D i pasoš","Putopis iz oktobra 2021.","I. Deficit","Korona je 2021. bila u punom zamahu, a ja sam bio u punom deficitu vitamina D.","Sećamo se svi onog perioda — zatvaranje, ne izlaženje, onaj čudni tihi tok života u kom je odlazak do prodavnice izgledao kao mali podvig. Putovanje je bila misaona imenica. Teško se putovalo unutar zemlje, a kamoli negde gde je potreban pašoš. Svi su bili željni da izađu ispred zgrade, da prošetaju naseljem, da vide neko lice koje nije isto lice što viđaju svaki dan. A onda je nebo otvorilo granice i svi su nekako stidljivo počeli da putuju — kao što se izlazi iz zatvora posle duge kazne, ne sasvim siguran šta te čeka napolju, ali voljan da rizikuješ.","Te godine sam trebao da putujem u Tivat. Familija, rođaci, drugari. A onda sam propustio let u poslednjem trenutku.","Moje telo je reagovalo odmah. Ne dramatično — nego onako podmuklo, tiho. Počelo je da vapi. Vitamin D. More. Sunce. Bilo šta što nije Beograd u oktobru, kad nebo ima onu sivu boju koja ne odlučuje ni da bude oblačno ni da bude vedro.","Egipat mi nikad nije bio visoko na listi. Ipak, kada turistička agencija čiji je vlasnik Egipćanin počne da te bombarduje povoljnim ponudama — deset noćenja, all inclusive, hotel četiri ili pet zvezdica, negde između petsto i šesto evra — deficit vitamina D počne sam da donosi odluke umesto tebe.","Oktobar. Drugar. Paket aranžman. I jedan mali problem — nisam vakcinisan, što je značilo PCR test. Koji je koštao sedamdeset evra. Za komad vate na štapiću koji ti guraju do mozga.","A onda je univerzum ubacio jedan telefonski poziv u priču. Dalji rodak. Radi na Torlaku. Živi na Ceraku, pet minuta vožnje od mog stana.","Dogovor je bio jednostavan, a scena vredna kratke priče. Ujutro me sačekao na parkingu. Obuven, ali u pidžami od pojasa na gore. Jednom rukom termos kafe, drugom vrećica sa svom laboratorijskom aparaturom. Komšija sa trećeg sprata gleda sa prozora. Mi pretvaramo kapak gepeka u improvizovani laboratorijski sto.","Test je bio negativan. Pečat je dobio svežijeg datuma od stvarnog. Nije baš po knjizi. Ali rodja se potrudio. I sunce me je čekalo.","Košava je produvala Beograd taj dan. U glavi samo jedna misao: za par sati će sve to izaći iz mene, negde nad Mediteranom.","II. Sletanje — Hurghada","Let do Hurgade — tri sata. Sletanje — dva pokušaja. Košava nas je pratila iz Beograda. Drugi pokušaj uspešan. Aplauz koji je usledio nije bio onaj ritualni — bio je od srca. Pravi, iskreni aplauz čoveka koji je pre trideset sekundi preispitivao sve svoje životne odluke.","U Hurgadi isti onaj vetar, samo je prekidač okrenut na toplo. Vazduh koji ti udari u lice čim se otvore vrata aviona — miriše na malo soli, malo peska i na nešto što zoveš toplina jer drugog imena nema.","Sa jedne strane palme i zelena trava. A onda okrenete pogled i vidite nepreglednu pustinju, kamenjar, kuće bez prozora. Glamur i beda na razmaku od deset metara. Nigde na svetu nisam video taj kontrast tako oštar.","Ulazimo u velelepni hol sa ogromnom centralnom fontanom. Sobe još nisu spremne. Crvena narukvica oko ruke. All inclusive se otvara.","III. Teritorija — Strategija ležaljke","Pronašli smo mesto blizu šanka — strateška odluka posle prvog iskustva s toplim pivom. I tu smo ostali do kraja letovanja. Kao lasta kad izgradi gnezdo — znalo se da su to naše ležaljke iako nigde nije pisalo.","Na šanku nas je čekao naš novi prijatelj. Za koji dolar bakšiša — velika čaša, hladno pivo i nasmejano lice. Na tom delu plaže počeli smo da prepoznajemo poznate jezike. Makedonski. Crnogorski. Hrvatski. Srpski. Jugoslavija na dvadesetak ležaljki u Egiptu.","IV. Doktor sa šanka","Posle par dana stomak je odlučio da se oglasi. Možda bakterije, možda začini, možda voda. Naravno da sam pio probiotik nedeljama pre polaska. Naravno da nije pomoglo.","Tog jutra nisam otišao na doručak. Prošao pored šanka. Naš prijatelj nas je pogledao onim pogledom koji ne traži objašnjenje. Nisam znao da imam lekara na šanku.","Sipa mi u malu čašu neko providno piće. U drugu čašu kiselu vodu. Moram da eksiram obe. Cimnuo sam, zatvorio oči — i kad sam ih otvorio, još jedna tura i uzvik: Van mor tajm. Stomak je u momentu prestao da me muči.","To piće zove se arak — anis. Biljka koja se vekovima koristi za stomak. Radi bolje od svakog probiotika. Sutradan kontrola. Od tog trenutka — bila je to terapija.","U nekom ćutanju začuo sam zapomaganje. Nikola. Zrenjaninac. Ista muka. Pozivam ga u ordinaciju na šanku i otkrivam čudotvorni lek. Medicina se deli.","V. Dno mora","Ronjenje za upola manje od hotelske cene. Dolazi nasumičan lik u Mitsubishi Lanceru 2005. godište. Obilazimo još jedan hotel, kupimo još jedan par iz Mladenovca.","Sat i po vožnje — filozofija. Tamo voze kao da su signalizacija i propisi više predlog nego obaveza. Svirne jednom za desno, dva puta za levo — kao Morzeova azbuka: skloni se.","Na brodu usmena obuka. Red na mene. Sve poznato prvih par metara. A onda pritisak u ušima. Instruktor me vukao dublje. Istrgnuo sam se i izronio. Kakvo olakšanje.","I onda se desilo ono zbog čega se sve isplatilo. Ogroman morski greben kao dvorac — stvorenja svih boja i veličina. Tišina ispunjena bojama. Nešto između sna i dokumentarnog filma.","Primetio sam da zaposleni dižu boce sa kiseonikom kao da su od pera. Glava me je bolela. Doneo odluku: ne zaranjam. Vremeniti arapin preuzeo moju opremu. Posle — nije bio delfin. Bio je arapin koji je potrošio kiseonik iz moje boce. Glava me je bolela u pravo vreme.","VI. Sto za šestoro","Srećem Nikolu. Priključuje se još jedan par iz Novog Sada. Ta medicina se prenosi s kolena na koleno. Upoznao sam ljude s kojima sam ostao u kontaktu do danas i s kojima sam posle proputovao još puno destinacija.","Pojavio se Lala. Vojvođanin, razvlači reči. Devojka ga ostavila tri dana pre polaska. U Egiptu upoznaje Ukrajinku i zaljubljuje se. Bio je PCR pozitivan u karantinu. Za par desetina dolara dobio slobodu. Potražio utočište i pronašao, ekspresno, ženu svog života.","VII. Kvadovi i pogrešna utakmica","Naleteo na odbojkašku utakmicu Srbija – Poljska. Pet setova, izgubili. Saznali da se taj meč odigrao mesecima unazad. Izašli smo kao gubitnici zbog nečeg što se već odavno zaboravilo.","Vožnja kvadovima po pustinji. Svi prodavci su me zvali Serbian boss. Zalazak sunca u pustinji: nebo u dvadesetak nijansi narandžaste bez imena — ceo svet izgleda kao da ga je neko slikao temperom.","VIII. Povratak","Na aerodromu nasumično birali putnike. Svi prošli — sem Ladislava iz Novog Sada koji je odležao dve nedelje kući. Poslednja žrtva.","Nije bila ono što sam očekivao. Bila je manje — bez lakirovanog sjaja. I bila je više — zbog parking-laboratorijuma u pidžami, zbog anisa koji leči bez dijagnoze, zbog Lancera iz 2005, zbog prazne boce kiseonika, zbog utakmice izgubljene mesecima pre nego što si je gledao.","Vitamin D na maksimumu. Novi drugari. Jedno novo bogatstvo.","— Hurghada / Beograd, oktobar 2021."];

  var CPP=900;
  function buildPages(pp){var pages=[],cur='';for(var i=0;i<pp.length;i++){var p=pp[i];if(cur.length>0&&cur.length+p.length+2>CPP){pages.push(cur);cur='';}cur=cur.length>0?cur+'\n\n'+p:p;}if(cur.length>0)pages.push(cur);return pages;}

  function setupEgipat(){
    var c=document.getElementById('egipat-pages');
    if(!c)return;
    var pages=buildPages(PARAS);
    c.innerHTML='';
    for(var i=0;i<pages.length;i++){
      var slide=document.createElement('div');
      slide.className='book-page-slide'+(i===0?' active':'');
      pages[i].split('\n\n').forEach(function(t){var p=document.createElement('p');p.className='book-page-text';p.textContent=t;slide.appendChild(p);});
      c.appendChild(slide);
    }
    var total=c.children.length,cur=0;
    var counter=document.getElementById('egipat-counter');
    var prev=document.getElementById('egipat-prev');
    var next=document.getElementById('egipat-next');
    function show(n){
      cur=n;
      Array.from(c.children).forEach(function(s,i){s.classList.toggle('active',i===n);s.classList.toggle('right-visible',i===n+1);});
      c.style.transform='translateX(-'+(n*100)+'%)';
      if(counter)counter.textContent=(n+1)+' / '+total;
      if(prev)prev.disabled=(n===0);
      if(next)next.disabled=(n>=total-1);
    }
    window.egipatNext=function(){if(cur<total-1)show(cur+1);};
    window.egipatPrev=function(){if(cur>0)show(cur-1);};
    window.egipatSetup=setupEgipat;
    show(0);
  }

  // Add CSS for egipat identical to amsterdam
  var s=document.createElement('style');
  s.textContent=[
    '#egipat-pages{display:flex!important;flex-direction:row!important;min-height:800px!important;overflow:hidden!important;align-items:stretch!important;}',
    '#egipat-pages .book-page-slide{flex:0 0 50%!important;width:50%!important;min-height:800px!important;overflow:visible!important;padding:3rem 3.8rem 5.5rem!important;box-sizing:border-box!important;display:none!important;}',
    '#egipat-pages .book-page-slide.active{display:block!important;}',
    '#egipat-pages .book-page-slide.right-visible{display:block!important;}'
  ].join('');
  document.head.appendChild(s);

  window.egipatSetup=setupEgipat;
  window.egipatNext=function(){};
  window.egipatPrev=function(){};

  // Watch for egipat page becoming active
  var obs=new MutationObserver(function(){
    var ep=document.getElementById('page-egipat');
    if(ep&&ep.classList.contains('active')){
      var c=document.getElementById('egipat-pages');
      if(c&&c.children.length===0)setupEgipat();
      else if(c&&c.children[0]&&c.children[0].querySelector('p.book-page-text')===null)setupEgipat();
      else if(c&&c.getAttribute('data-built')!=='1'){c.setAttribute('data-built','1');setupEgipat();}
    }
  });
  obs.observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
})();
