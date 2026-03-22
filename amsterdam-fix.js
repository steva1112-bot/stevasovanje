/* Amsterdam fix v3 - mirrors Kuba CSS */
(function(){
  var s=document.createElement('style');
  s.textContent=[
    '#amsterdam-pages{',
      'display:flex!important;',
      'flex-direction:row!important;',
      'min-height:800px!important;',
      'overflow:hidden!important;',
      'align-items:stretch!important;',
    '}',
    '#amsterdam-pages .book-page-slide{',
      'flex:0 0 50%!important;',
      'width:50%!important;',
      'min-height:800px!important;',
      'overflow:visible!important;',
      'padding:3rem 3.8rem 5.5rem!important;',
      'box-sizing:border-box!important;',
      'display:none!important;',
    '}',
    '#amsterdam-pages .book-page-slide.active{display:block!important;}',
    '#amsterdam-pages .book-page-slide.right-visible{display:block!important;}',
    '@media(max-width:767px){',
      '#amsterdam-pages{display:block!important;min-height:400px!important;}',
      '#amsterdam-pages .book-page-slide{width:100%!important;flex:none!important;min-height:400px!important;}',
    '}'
  ].join('');
  document.head.appendChild(s);
  window.amstCharsPerPage=function(){return window.innerWidth>=768?500:400;};
})();