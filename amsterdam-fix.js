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
