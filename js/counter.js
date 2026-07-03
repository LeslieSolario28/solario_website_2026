(function(){
  'use strict';
  if(!('IntersectionObserver' in window))return;
  function animate(el){
    var b=el.querySelector('b');
    b.style.opacity='1';
    var t=parseFloat(el.dataset.target),pre=el.dataset.prefix||'',suf=el.dataset.suffix||'',dur=2000,st=performance.now();
    var plus=pre.charAt(0)==='+'?'+':'',rest=pre.charAt(0)==='+'?pre.substring(1):pre;
    (function tick(now){var p=Math.min((now-st)/dur,1),e2=1-Math.pow(1-p,3);
      b.innerHTML='<i>'+plus+'</i>'+rest+Math.round(t*e2)+'<i>'+suf+'</i>';
      if(p<1)requestAnimationFrame(tick);})(performance.now());
  }
  // Each counter animates on its own as soon as it scrolls into view, so groups in
  // different sections (About, Resultados) all fire independently the moment you reach them.
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ io.unobserve(en.target); animate(en.target); } });
  },{threshold:0, rootMargin:'0px 0px 12% 0px'});
  document.querySelectorAll('.stat[data-target]').forEach(function(el){
    var b=el.querySelector('b');
    if(b){ b.style.opacity='0'; b.style.transition='opacity .35s ease'; }  // hidden until it starts counting
    io.observe(el);
  });
})();
