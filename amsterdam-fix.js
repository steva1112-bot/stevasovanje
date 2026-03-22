/* Amsterdam fix */
(function(){
  var s=document.createElement('style');
  s.textContent='#amsterdam-pages{display:flex!important;flex-direction:row!important;height:800px!important;max-height:800px!important;overflow:hidden!important;min-height:unset!important;}#amsterdam-pages .book-page-slide{flex:0 0 50%!important;width:50%!important;max-width:50%!important;height:800px!important;max-height:800px!important;overflow:hidden!important;padding:3rem 3.8rem 5.5rem!important;box-sizing:border-box!important;min-height:unset!important;display:none!important;}#amsterdam-pages .book-page-slide.active,#amsterdam-pages .book-page-slide.right-visible{display:block!important;}@media(max-width:767px){#amsterdam-pages{height:auto!important;max-height:unset!important;min-height:400px!important;overflow:hidden!important;display:block!important;}#amsterdam-pages .book-page-slide{height:auto!important;max-height:unset!important;overflow:hidden!important;width:100%!important;max-width:100%!important;}}';
  document.head.appendChild(s);
  window.amstCharsPerPage=function(){return window.innerWidth>=768?500:400;};
})();