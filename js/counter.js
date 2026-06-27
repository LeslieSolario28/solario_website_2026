(function(){
  'use strict';
  var done=false,statsEl=document.getElementById('resultados');
  if(statsEl&&'IntersectionObserver' in window){
    var cio=new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting&&!done){done=true;cio.unobserve(en.target);
    document.querySelectorAll('.stat[data-target]').forEach(function(el){var t=parseFloat(el.dataset.target),pre=el.dataset.prefix||'',suf=el.dataset.suffix||'',dur=2000,st=performance.now();
    (function tick(now){var p=Math.min((now-st)/dur,1),e2=1-Math.pow(1-p,3);var plus=pre.charAt(0)==='+'?'+':'';var rest=pre.charAt(0)==='+'?pre.substring(1):pre;el.querySelector('b').innerHTML='<i>'+plus+'</i>'+rest+Math.round(t*e2)+'<i>'+suf+'</i>';if(p<1)requestAnimationFrame(tick);})(performance.now());});}});},{threshold:0.3});
    cio.observe(statsEl);
  }
})();
