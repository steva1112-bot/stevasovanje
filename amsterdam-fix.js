/* Amsterdam fix v7 - counter ispod knjige */
(function(){
  var s=document.createElement('style');
  s.textContent=[
    '#amsterdam-pages{display:flex!important;flex-direction:row!important;min-height:800px!important;overflow:hidden!important;align-items:stretch!important;}',
    '#amsterdam-pages .book-page-slide{flex:0 0 50%!important;width:50%!important;min-height:800px!important;overflow:visible!important;padding:3rem 3.8rem 5.5rem!important;box-sizing:border-box!important;display:none!important;opacity:1!important;animation:none!important;}',
    '#amsterdam-pages .book-page-slide.active{display:block!important;opacity:1!important;animation:none!important;}',
    '#amsterdam-pages .book-page-slide.right-visible{display:block!important;opacity:1!important;animation:none!important;}',
    '#amsterdam-counter-outer{text-align:center;font-size:0.85rem;color:rgba(200,169,110,0.8);letter-spacing:0.15em;padding:0.6rem 0 0.2rem;font-family:Lora,Georgia,serif;}',
    '.book-nav .book-counter{display:none!important;}',
    '@media(max-width:767px){',
      '#amsterdam-pages{display:block!important;min-height:unset!important;overflow:visible!important;}',
      '#amsterdam-pages .book-page-slide{width:100%!important;flex:none!important;min-height:unset!important;padding:1.5rem 1.2rem 3rem!important;}',
      '#amsterdam-pages .book-page-slide.right-visible{display:none!important;}',
    '}'
  ].join('');
  document.head.appendChild(s);
  window.amstCharsPerPage=function(){return window.innerWidth>=768?1100:500;};
})();