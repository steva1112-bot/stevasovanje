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


/* ===== GLOBALNI DODACI: poglavlja, scroll, headings ===== */
(function(){

// CSS za naslove poglavlja
var cs=document.createElement('style');
cs.textContent=
  '.book-chapter-heading{color:rgba(200,169,110,0.95)!important;font-family:Cinzel,Lora,Georgia,serif!important;font-size:0.73rem!important;letter-spacing:0.2em!important;text-transform:uppercase!important;margin-top:1.5rem!important;margin-bottom:0.15rem!important;font-weight:700!important;}'+
  '.book-chapter-heading:first-child{margin-top:0!important;}';
document.head.appendChild(cs);

// Globalna funkcija za detekciju poglavlja
window.isChapterHeading=function(t){
  return /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\./.test(t)||
         /^Poglavlje\s/.test(t)||
         /^★/.test(t)||
         /^[─━―]{3,}/.test(t)||
         /^[A-ZŠŽĆČĐ][A-ZŠŽĆČĐ\.\s]{2,}$/.test(t);
};

// Scroll na vrh stranice pri otvaranju novog poglavlja
window.scrollBookTop=function(pageId){
  setTimeout(function(){
    var p=document.getElementById('page-'+pageId);
    if(!p)return;
    // Scroll to top of dest-header (hero image area)
    var target=p.querySelector('.dest-header')||p.querySelector('.book-reader')||p;
    target.scrollIntoView({behavior:'smooth',block:'start'});
  },200);
};

// Dodaj heading klase - pametno splitovanje poglavlje + tekst
window.applyBookHeadings=function(containerId){
  var ps=document.querySelectorAll('#'+containerId+' .book-page-text');
  ps.forEach(function(p){
    var text=p.textContent.trim();
    var isChapter=/^[─━―]{3,}/.test(text)||window.isChapterHeading(text);
    if(isChapter)p.classList.add('book-chapter-heading');
    else p.classList.remove('book-chapter-heading');
  });
}

// Patch amstShowPage za scroll
var _origAmstShow=window.amstShowPage;
if(typeof _origAmstShow==='function'){
  window.amstShowPage=function(n){_origAmstShow(n);window.scrollBookTop('nocno-nebo');};
}

// Patch kuba navigaciju za scroll + headings
var _oKN=window.kubaNext,_oKP=window.kubaPrev;
if(typeof _oKN==='function'){
  window.kubaNext=function(){_oKN();window.scrollBookTop('kuba');};
  window.kubaPrev=function(){_oKP();window.scrollBookTop('kuba');};
}

// Observer za dodavanje headings kad se stranice ucitaju
new MutationObserver(function(){
  // headings applied once via MutationObserver above
}).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});

// Patch openPage za scroll na mobilnom
var _oOP=window.openPage;
if(typeof _oOP==='function'){
  window.openPage=function(id){
    _oOP(id);
    window.scrollBookTop(id);
  };
}

})();

/* ===== EGIPAT FIX ===== */
(function(){
var PARAS=["Egipat — vitamin D i pasoš","Putopis iz oktobra 2021.","I. Deficit • Beograd, oktobar 2021.","Korona je 2021. bila u punom zamahu, a ja sam bio u punom deficitu vitamina D.","Sećamo se svi onog perioda — zatvaranje, ne izlaženje, onaj čudni tihi tok života u kom je odlazak do prodavnice izgledao kao mali podvig. Putovanje je bila misaona imenica. Teško se putovalo unutar zemlje, a kamoli negde gde je potreban pašoš. Svi su bili željni da izađu ispred zgrade, da prošetaju naseljem, da vide neko lice koje nije isto lice što viđaju svaki dan. A onda je nebo otvorilo granice i svi su nekako stidljivo počeli da putuju — kao što se izlazi iz zatvora posle duge kazne, ne sasvim siguran šta te čeka napolju, ali voljan da rizikuješ.","Te godine sam trebao da putujem u Tivat. Tivat je grad koji poznajem jako dugo — familija, rođaci, drugari. Sve tu, sve poznato, sve predvidivo na onaj dobar način. A onda sam, iz razloga koje znam, ali koje ne bih posebno objašnjavao, propustio let u poslednjem trenutku.","Moje telo je reagovalo odmah. Ne dramatično, ne sa nekom velikom porukom — nego onako podmuklo, tiho. Počelo je da vapi. Vitamin D. More. Sunce. Nešto. Bilo šta što nije Beograd u oktobru, kad dan traje koliko traje, a nebo ima onu sivu boju koja ne odlučuje ni da bude oblačno ni da bude vedro — nego ostaje negde između, kao loša vest koja se najavila ali još nije stigla.","Egipat mi nikad nije bio visoko na listi. Tunis isto. Delovali su previše turistički — sterilno, predvidivo. Afrika me oduvek privlačila, ali ne ona iz foldera agencija, sa belim hotelima iza ograde i animatorima koji te svakog jutra dočekuju sa osmehom koji su vežbali u ogledalu. Ipak, kada turistička agencija čiji je vlasnik Egipćanin počne da te bombarduje povoljnim ponudama — deset noćenja, all inclusive, hotel četiri ili pet zvezdica, negde između petsto i šesto evra — deficit vitamina D počne sam da donosi odluke umesto tebe.","Oktobar. Drugar. Paket aranžman. I jedan mali administrativni problem — nisam vakcinisan, što je u to vreme značilo PCR test. Koji je tada kod nas koštao sedamdeset evra. Za komad vate na štapiću koji ti guraju do mozga.","A onda je univerzum — onako kako to univerzum zna da uradi kad hoće da vas nekuda gura — ubacio jedan telefonski poziv u priču. Dalji rodak. Radi na Torlaku. Pravi PCR testove. Živi na Ceraku, pet minuta vožnje od mog stana.","Dogovor je bio jednostavan, a scena vredna kratke priče. Ujutro, pre nego što krene na posao, sačekao me je na parkingu ispred svoje zgrade. Obuven, ali u pidžami od pojasa na gore. Jednom rukom drži termos kafe, drugom vrećicu sa svom laboratorijskom aparaturom. Komšija sa trećeg sprata gleda sa prozora šta se dešava u šest ujutro. Mi pretvaramo kapak gepeka kao improvizovani laboratorijski sto, on vadi štapiće, maske, rukavice — sve ono što inače vidite iza staklenih pregrada bolnica, sad na parkingu između dva auta.","Test je bio negativan. Pečat je dobio svežijeg datuma od stvarnog, kako bi bio validan za put. Nije baš po knjizi. Ali rodja se potrudio. I sunce me je čekalo.","Košava je produvala Beograd taj dan — ona oktobarska, ona koja se uvuče u kosti i ostane tamo kao nezvani gost. U glavi samo jedna misao: za par sati će sve to izaći iz mene, negde nad Mediteranom, negde gde temperatura ima tri cifre.","II. Sletanje • Hurghada, tri sata kasnije","Let do Hurgade — tri sata. Sletanje — dva pokušaja. Košava nas je očigledno pratila iz Beograda i nije dala pilotu da mirno prizemlji avion. Zaljuljao nas je pod nekim uglom da sam kroz prozor video samo pesak — u jednom trenutku sam bio siguran da ćemo krilom zakačiti dinu u pustinji. Drugi pokušaj je bio uspešan. Aplauz koji je usledio nije bio onaj ritualni — ovaj je bio od srca. Pravi, iskreni aplauz čoveka koji je pre trideset sekundi preispitivao sve svoje životne odluke.","U Hurgadi isti onaj vetar iz Beograda, samo je prekidač okrenut na crveno. Na toplo. Vazduh koji ti udari u lice čim se otvore vrata aviona — onaj koji miriše na malo soli, malo peska i na nešto neidentifikovano što zoveš „toplina“ jer drugog imena nema.","Prizori na koje sam možda već i navikao od slika po internetu — ali koji nikad nisu sasvim isti kad ih gledaš kroz prozor kombija posle trosatnog leta. Sa jedne strane cvetaju palme, cveće, trava zelena kao da neko plaća da bude zelena. A onda okrenete pogled na drugu stranu i vidite nepreglednu pustinju, kamenjar, kuće koje izbijaju iz peska — bez prozora, bez vrata, sa žicom i rasirenim vešom. Glamur i beda na razmaku od deset metara. Nigde na svetu nisam video taj kontrast tako oštar.","Posle četrdesetak minuta vožnje, tu smo. Ulazimo u velelepni hol sa ogromnom centralnom fontanom. Sobe još nisu spremne. Dobijamo uputstvo da se raskomotimo, popijemo nešto, ubijemo vreme. Crvena narukvica oko ruke. All inclusive se otvara.","Zamišljao sam to tokom celog leta avionom — one kapljice zaleđene čaše velikog piva, hlad koji krene od dlanova ka gore. Odlazim na šank. Prvo rzočarenje. Limenke piva stoje na šanku — van frižidera. Sobne temperature. I to isto pivo sipaju u male plastične čaše, onako kako se sipa bezalkoholno piće na rođendanskim proslavama za decu. Pivo toplo, puno pene, u najmanjim čašama u kojima sam ikad video da neko servira pivo.","Prelazim na varijantu dva. Kokteli. Ali Mojito — nema. Cuba Libre — nema. Aperol — nema. Imaju viski-kolu, djus-votku, bambus — isti asortiman pića kao na žurkama za osamnaesti rođendan. A i to samo do ponoći, jer posle nestane. Rzočarenje broj dva stiglo je brže nego što sam planirao.","Dobijamo ključ od sobe. Napokon raspakivanje, papuče na noge, plaža. I tu, između mora, sunca i one tople slatke vode u plastičnoj čašici, shvatiš da si ipak napravio pravu odluku. Deficit vitamina D počinje polako da se puni.","III. Teritorija • Strategija ležaljke","Pronašli smo mesto na plaži relativno brzo. Blizu šanka — što nije bila slučajnost, nego strateška odluka doneta posle prvog iskustva s toplim pivom. I tu smo ostali. Do kraja letovanja. Kao lasta kad izgradi gnezdo pre selidbe — znalo se da su to naše ležaljke iako nigde nije pisalo. Postoji nešto na plaži što podseti na feudalni sistem vlasništva. Niko ništa ne poseduje, ali svi znaju ko šta drži.","Na šanku nas je čekao naš novi prijatelj. Čovek koji je brzo shvatio teoremu srpskog turiste: za koji dolar bakšiša — velika čaša, hladno pivo i nasmejano lice kao da si mu najdražiji gost od kad radi. Na tom delu plaže počeli smo polako da prepoznajemo poznate jezike. Makedonski. Crnogorski. Hrvatski. Srpski. Jugoslavija na dvadesetak ležaljki, u Egiptu, na Crvenom moru, u oktobru.","IV. Doktor sa šanka • Narodna medicina Crvenog mora","Posle par dana boravljenja, stomak je odlučio da se oglasi. Uzrok? Mnogobrojan, ali nikad precizan. Možda bakterije. Možda začine. Možda voda kojom perete zube. Možda ono što si jeo u ručku a nisi trebao. U suštini nebitno. Problem je tu, redak u svakom smislu reči i neprevazidjen.","Naravno da sam pio probiotik nedeljama pre polaska. Naravno da nije pomoglo — naši probiotici nisu ono što nam treba tamo. Treba nam nešto što je naviklo na sve to. Što je odraslo uz tu vodu, tu hranu, te začine.","Tog jutra nisam otišao na doručak. Nisam jeo ništa. U nekom trenutku, negde oko užine, instinktivno sam reagovao — ne iz gladi, nego iz one svesti da bi ipak nešto moralo da se unese u telo ako planiraš da se krećeš. Restoran koji je radio u to vreme bio je na totalno drugom kraju plaže. Ali smo krenuli.","Naš prijatelj nas je pogledao onim pogledom koji ne traži objašnjenje — samo je video da nešto nije kako treba. Drugar naručuje pivo. Ja odbijam i iznosim mu problem. Nije ni trepnuo. Nisam znao da imam lekara na šanku.","Za koji trenutak, sipa mi u malu čašu neko providno piće. U drugu čašu kiselu vodu. Objašnjava mi da treba da popijem. Deluje kao loza. Alkohol, ali onaj koji miriše na nešto poznato. Gledao sam tu malu čašu kao da mi je neko dao zadatak.","Povisenim tonom me upozori — moram da eksiram, i odmah posle da eksiram i kiselu vodu. Toplo-hladno, kao kad gasiš vatru naglim zalivanjem. Cimnuo sam obe čaše, zatvorio oči — i kad sam ih otvorio, sačekala me je još jedna tura i njegov uzvik: „Van mor tajm. Van mor tajm.“ Ponovio sam ritual. I stomak je u momentu prestao da me muči.","Sad su me mučile noge — jer su dve pune čaše te rakije iskrivile stazu kojom se ide do hotela. Hodao sam kao čovek koji pokušava da izgleda trezan na mestu gde ga svi poznaju. To piće se kod njih zove arak. Mi smo ga zvali anis — po biljci od koje se pravi, onoj istoj koja se vekovima koristi za stomak, varenje, sve one tegobe koje čovek stekne kad jede ono što ne bi trebalo. I koja, ispostavilo se, radi bolje od svakog probiotika kupljenog u beogradskoj apoteci.","Sutradan — kontrola. Ponovo kod mog doktora na šanku. Dve čaše, ista procedura, isti uzvik. Od tog trenutka, za mene to više nije bilo piće. Bila je to terapija. Propisana, dozirana i konzumirana sa punim uverenjem u njenu lekovitost.","U nekom ćutanju između dve terapije, začuo sam zapomaganje. Ista muka, isti simptomi, isti pogled čoveka koji ne zna kako je to počelo ali zna da želi da prestane. Nikola. Zrenjaninac, sa devojkom iz Novog Sada. Malo rasteže reči, kao što svi Vojvođani rastežu, i priča istu priču koju sam ja pričao dan ranije. Kao tek diplomirani doktor sa novostečenim samopouzdanjem, pozivam ga u ordinaciju na šanku i otkrivam čudotvorni lek. Nisam mu naplaćivao uslugu. Medicina se deli.","V. Dno mora • Jedan instruktor, prazna boca i čudna intuicija","Ronjenje je bilo logičan sledeći korak. Agencija unutar hotela prodavala je ovaj izlet, ali na način koji mi nije ostavljao prostora za cenkanje — kao kad ti neko kaže cenu i gleda te u oči bez trunke sumnje da ćeš je prihvatiti. Nisam bio taj tip turiste. Imao sam broj još iz Beograda — Egipćanin koji je studirao u Beogradu, vodi razne ture po Egiptu za sve Balkance i zna šta hoće sa njima. Dogovorili smo izlet za upola manje od hotelske cene.","Sutradan sam očekivao minibus, kombi, nešto što liči na organizovanu stvar. Umesto toga, dolazi nasumičan lik u Mitsubishi Lanceru, rekao bih 2005. godište — auto na koji sam se svojevremeno lozio, pa sam odmah znao da cenim čoveka na pravom nivou. Malo čudan osećaj kad vas privatni vozač vodi na izlet koji ste kupili telefonom od nekoga koga niste videli. Ali ajde. Obilazimo još jedan hotel, kupimo još jedan par — iz Mladenovca. I oni su razmišljali kao ja, i oni su skupili kontakt ko zna gde u Srbiji.","Posle sat i po vožnje koja se može opisati jedino rečju „filozofija“ — tamo stvarno voze kao da su signalizacija i saobraćajni propisi više predlog nego obaveza. Migavci se ne pale. Svirne jednom za desno, dva puta za levo, kratko-kratko-dugo za ablendovanje — kao Morzeova azbuka, samo što poruka uvek znači isto: skloni se.","Stižemo do broda gde se, izgleda, svi instruktori ronjenja sastaju kao na nekom jutarnjem brifingu. Svaki ronilac sa sobom vodi grupu. Vožnja brodom do prvog grebena — skoro ceo sat. Na brodu upoznajemo ljude uglavnom s naših prostora i vrši se usmena obuka. Na tom brodu bili smo kao neki paralelni svet u kom ne postoji korona. Delimo opremu sa neznancima. Disaľke se diskretno dezinfikuju jakim smrdljivim sredstvom koje je, pretpostavljam, ubijalo sve — i bakterije i volju za ronjenjem.","Napokon red na mene. Sve deluje poznato prvih par metara. A onda — pritisak u ušima. Onaj koji ne možeš da izjednačiš bez obzira na sve što su te učili na brodu. Davao sam znakove instruktoru pod vodom da ne mogu da izjednačim pritisak. On me vukao dublje. Kao da je moj znak za „stani“ preveo kao „nastavi“. U jednom trenutku sam se istrgnuo i izronio na površinu. Kakvo olakšanje. Plavo nebo, vazduh, zvuk talasa.","Posle sam sam, postepeno, zaranjao i izjednačavao pritisak. I onda se desilo ono zbog čega se sve isplatilo. Ispred mene se pojavio ogroman morski greben koji je stajao kao dvorac — i iz njega su defilovala stvorenja svih boja i veličina, kao da je neko organizovao simpozijum za koga sam samo ja dobio pozivnicu. Ipak ću pokušati: to je bila tišina ispunjena bojama. Nešto između sna i dokumentarnog filma.","Vraćamo se na brod i krećemo ka drugoj lokaciji. Malo dublje ronjenje, sedam do deset metara. Tu sam krajičkom oka primetio nešto što mi nije prijalo — zaposleni na brodu proveravali su boce sa kiseonikom i dizali ih kao da su od pera. Prazne boce imaju tu osobinu da budu lake. Pune ne. Glava me je bolela od prethodnog zarona. Uši isto. U svojoj glavi sam već doneo odluku. Ne zaranjam.","Instruktor me poziva. Objašnjavam mu da imam problem s bolom u ušima i da slobodno neko drugi preuzme opremu. Vremeniti arapin iz naše grupe se oprema i skače bez pogovora. Posle nekog vremena — nije bio delfin. Bio je arapin koji je potrošio kiseonik iz one iste boce koja je bila namenjena meni. Vukli su ga po vodi, dok je on, iskolačenih očiju, izbacivao vodu iz sebe kao ona fontana u holu hotela. Samo bez elegancije i ambijentalne muzike. Nekim čudnim instinktom sam sačuvao sebe. Ili jednostavno — glava me je bolela u pravo vreme. Ručak na brodu i razne priče o ovom iskustvu. Kome je kako bilo. Meni je, ispostavilo se, bilo dovoljno.","VI. Sto za šestoro • Kako se gradi stalna adresa za nepunih deset dana","Pao je mrak. A kad padne mrak u hotelu, pali se pozornica — i svako veče nova tačka, ispred stolovi i stolice poređani kao u nekom ogromnom kafiću na otvorenom. Jedva sam čekao da popijem jednu dozu terapije posle uzbudljivog dana. I naravno — koga srećem. Nikolu, svog pacijenta, sa devojkom. Poziva nas da im se priključimo.","Posle duže priče i opširnijeg upoznavanja, priključuje nam se još jedan par iz Novog Sada — koje je Nikola izlečio istim onim medikamentom doktora sa šanka. Ta medicina se prenosi, izgleda, s kolena na koleno. U našem slučaju — sa stolice na stolicu. Konzumirajući toliko medikamenata te večeri, nisam ni slutio da sam upravo upoznao drage ljude s kojima sam ostao u kontaktu do danas. Ljude s kojima sam posle proputovao još puno destinacija.","Sutradan, a ispostavilo se i svih narednih dana do kraja letovanja, taj sto je dobio status koji se ne piše nigde ali svi razumeju. Šestoro nas, numerisana mesta, nepisano pravilo. Ekipa se širila, sužavala, odlazila, dolazila — ali naša mesta su ostajala naša. Kao one ležaljke na plaži od prvog dana.","Sutradan ujutru, puna terasa, čaše se nižu, nižu se razgovori između medikamenata. U jednom trenutku priča se prekinula — pojavio se novi lik. Lala. Vojvođanin, razgali se, razvlači reči, doskočice iz prvog reda. Kod nas se kaže da se svoj svome raduje, i to je tačno — ali Vojvodina je te večeri bila u prednosti u odnosu na celu Jugoslaviju za stolom.","Došao je sa drugom. Sasvim slučajno — devojka ga ostavila tri dana pre polaska, pa kako mu ne bi propao aranžman, pozvao drugara da krene s njim. Totalni luđaci, od onih koji ti se sviđaju odmah. A onda — posle samo par dana u Egiptu — upoznaje Ukrajinku sa detetom, zaljubljuje se, nama je predstavlja kao svoju buduću ženu i stvari je već prebacio kod nje u apartman. Znam da postoji ona faza posle velikog rzočarenja, kad se čovek uhvati za prvu slamku i brzopleto gradi nešto što se inače gradi godinama. Ali leto je, sunce udara, možda su i naši lekovi imali nekih sporednih efekata — podržali smo ga u svemu tome.","Ispostavilo se da je Lala radio PCR test na aerodromu, bio pozitivan, i smestili su ga u daleki deo hotela koji je služio kao karantin. Zatvoren u sobu, hrana i piće na vrata. A kao što to u Egiptu uvek biva — za par desetina dolara dobio slobodu. Nije smeo da se vraća u svoju sobu jer su imali evidenciju na recepciji. Pa je potražio utočište i pronašao — ekspresno — ženu svog života. Obezbeđenje ga je stalno tražilo, tako da je u društvu bio onaj zec koji se pojavi pa nestane. A mi smo mislili da je zaljubive prirode. Ko bi rekao.","Za stolom smo upoznali i devojku koja je došla sa majkom. Bivša misica, starleta — šta god da jeste. Video sam je kasnije u jednom rijaliti programu na našim televizijama. Nisam bio iznenađen. Konglomerat svega i svečega za jednim stolom u Egiptu, u oktobru 2021, za vreme korone.","VII. Kvadovi, piramide i pogrešna utakmica • Dani koji prolaze prebrzo","Povučen iskustvom sa Kube — gde sam internet koristio na kašičicu i gde sam mozak odmorio od svih informacija — sa drugarom smo se dogovorili da ne kupujemo internet pakete. Koristimo ga samo tamo gde ga ima. A to je bilo u holu hotela. Kad želiš da se javiš, pošlješ poruku, pročitaš novine — svratiš do hola, popiješ onaj čudni koktelčić i obavljaš sve što treba.","Posle svakog ručka odlazili smo u sobu da malo odremanemo i pripremimo se za večernju predstavu. Tog predvečerja sam listao kanale na televizoru. Egipatske, jer drugih nije ni bilo. I naleteo na utakmicu. Odbojka — Srbija i Poljska. Vodimo prvi set. Utakmica je imala takav zaplet da smo popušili paklu cigareta, odigrala se u pet setova i na kraju — Srbija izašla kao gubitnik. Izašli smo i mi kao gubitnici. Jer smo naknadno saznali da se taj meč odigrao mesecima unazad.","No, iako nije bilo razloga za slavlje zbog izgubljene utakmice koja se već odavno zaboravila — u našem domu zdravlja čekala je ekipa. Nikolin rođendan, našeg novopečenog doktora. Te noći smo ostali do ranih jutarnjih sati. Iako se šank zatvara u ponoć, imali smo mi svog čoveka koji je otvorio apoteku samo za nas. Koštalo je. Ali je i vredelo.","Novi dan. Retko koga na plaži — deo ekipe otišao da poseti piramide, deo na paraglajding. A nama nije preostalo ništa drugo nego da prihvatimo ponudu dosadnih prodavača koji te svakog jutra vrebaju na plaži kao da je to njihov posao. Jer jeste. Vožnja kvadovima po pustinji. Na kraju su me svi ti prodavci svega i svečega na plaži zvali „Serbijan bos“. Nisam bio siguran da li je to kompliment ili strategija da me bolje ogule, ali sam prihvatio titulu.","Ovog puta dolazi pravi kombi, veća tura, ozbiljniji vodič. Posle sat i po vožnje stižemo — ni u šta. Pesak, peščane dine i jedan kamp sa velikim brojem kvadova. Obuka je kao i sve obuke na putovanju — levo, desno, gas, kočnice i pratite me, kaže vodič. Delovalo je lako u početku dok se krećemo u grupi nekom laganom brzinom. Ali kad kreneš malo da divljaš tim prostranstvom i kad naletiš na neravninu, osećaj je kao da voziš na dva desna točka — kao reklama za Kasko bombone.","Stižemo u egipatsko selo. Kuće od blata, vodiči kamila koji te vrebaju za koji dolar, gomila suvenira i domaćice koje prave tradicionalni egipatski hleb na vatri — onaj tanki, lepljiv, koji se jede topao i ne liči ni na šta što kod kuće zovemo hlebom. Kratko zadržavanje, pa dalje. Na povratku — zalazak sunca u pustinji. Prizor koji zaslužuje da stoji sam, bez komentara. Nebo se oboji u dvadesetak nijansi narandžaste koje nemaju ime, pesak uhvati taj isti ton i iznenada ceo svet izgleda kao da ga je neko slikao temperom. Zatišje koje ne pamtiš od ranije jer ga nikad nisi zaista doživeo.","Svraćamo do nove lokacije gde nam je organizovana večera i egipatski folklorni program — nacionalne nošnje, igre, kao naše kulturno-umetničko društvo. A onda se kulturno-umetničko društvo pretvorilo u cirkus — gutači vatre, svirači sa zmijama. Nekako nismo bili iznenađeni. Preživeli smo i taj dan. Mrtvi umorni, vraćamo se na terasu hotela gde je ekipa na okupu i svi pričaju svoje priče sa izleta, svako ubedjen da je njegova bila najluđa.","VIII. Povratak • Aerodrom i ona jedna igla na kojoj se sve drži","Bližio se povratak kući. Ekipa je bila u raskoraku sa vremenima dolaska i odlaska, pa smo se postepeno razilazili, ali jedina prava bojaznost bila je ona aerodromska — da nam test bude negativan na povratku. S obzirom u kakvim smo sve uslovima provodili vreme — deleći disaľke na brodu, boraveći sa karantin-pozitivnim Lalom za stolom, konzumirajući medikamente doktora sa šanka — verovatno smo svi bili pozitivni. Ali pun kapacitet vitamina D čini čuda. Osim na stomak.","Na aerodromu su nasumično birali putnike. Ovog puta smo svi imali sreće — sem Novosađanina Ladislava, koji je ipak morao da se upiše u knjigu kao pozitivan i da odleži naredne dve nedelje kod kuće. Poslednja žrtva.","Svi smo imali dovoljno vremena u avionu da razmislimo o ovoj zemlji — koju nisam doživeo na turistički način na koji mi je agencijski prospekt pisao. Nije bila ono što sam očekivao. Bila je manje. I bila je više.","Manje od fotografija u katalogu — bez onog lakirovanog sjaja, bez savršenih zalazaka sunca koji su uvek u tačno pravo vreme, bez uslužnog osoblja koje govori pet jezika i prepoznaje tvoje ime pre nego što ga kažeš.","Više od svega toga — zbog onog parking-laboratorijuma u pidžami, zbog anisa koji leči bez dijagnoze, zbog Lancera iz 2005. koji te vozi ka grebenima, zbog prazne boce kiseonika kojoj se zahvaljuješ što te nije ubila, zbog utakmice koja je izgubljena mesecima pre nego što si je gledao.","Vitamin D na maksimumu. Novi drugari. I jedna priča koja počinje od stomačnih tegoba, jednog Lancera iz 2005. i čoveka koji je znao šta radi sa anisom. Jedno novo bogatstvo.","— Hurghada / Beograd, oktobar 2021."];

window.egipatSetup=function(){
  var cont=document.getElementById('egipat-pages');if(!cont)return;
  var bookReader=cont.closest('.book-reader');
  var MAX_H=660;
  cont.innerHTML='';
  var ms=document.createElement('div');ms.className='book-page-slide active';
  ms.style.cssText='position:absolute;top:-9999px;left:0;visibility:hidden;pointer-events:none;width:50%;min-height:0!important;';
  bookReader.appendChild(ms);
  var pages=[],current=[];
  for(var i=0;i<PARAS.length;i++){
    var tp=document.createElement('p');tp.className='book-page-text';tp.textContent=PARAS[i];ms.appendChild(tp);
    if(ms.scrollHeight>MAX_H&&current.length>0){
      ms.removeChild(tp);pages.push(current.slice());current=[PARAS[i]];
      while(ms.firstChild)ms.removeChild(ms.firstChild);
      var tp2=document.createElement('p');tp2.className='book-page-text';tp2.textContent=PARAS[i];ms.appendChild(tp2);
    } else { current.push(PARAS[i]); }
  }
  if(current.length>0)pages.push(current);
  bookReader.removeChild(ms);
  for(var i=0;i<pages.length;i++){
    var sl=document.createElement('div');
    sl.className='book-page-slide'+(i===0?' active':'');
    if(i===1)sl.classList.add('right-visible');
    pages[i].forEach(function(t){
      var p=document.createElement('p');p.className='book-page-text';
      if(window.isChapterHeading&&window.isChapterHeading(t.trim()))p.classList.add('book-chapter-heading');
      p.textContent=t;sl.appendChild(p);
    });
    cont.appendChild(sl);
  }
  var tot=cont.children.length,n=0,pairTot=Math.ceil(tot/2);
  var co=document.getElementById('egipat-counter-outer');
  var pv=document.getElementById('egipat-prev'),nx=document.getElementById('egipat-next');
  function sh(i){n=i;Array.from(cont.children).forEach(function(s,j){s.classList.remove('active','right-visible');if(j===i)s.classList.add('active');if(j===i+1)s.classList.add('right-visible');});if(co)co.textContent=(Math.floor(i/2)+1)+' / '+pairTot;if(pv)pv.disabled=(i===0);if(nx)nx.disabled=(i+2>=tot);}
  window.egipatNext=function(){if(n+2<tot){sh(n+2);window.scrollBookTop('egipat');}};
  window.egipatPrev=function(){if(n>=2){sh(n-2);window.scrollBookTop('egipat');}};
  sh(0);
};
window.egipatNext=function(){};window.egipatPrev=function(){};
new MutationObserver(function(){var ep=document.getElementById('page-egipat');if(ep&&ep.classList.contains('active')&&!ep.getAttribute('data-eg-done')){ep.setAttribute('data-eg-done','1');window.egipatSetup();}}).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
})();