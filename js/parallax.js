(function(){
  'use strict';
  // Respect users who prefer reduced motion — no parallax for them.
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Each target moves its background-image layer (a ::before that reads the CSS var)
  // as it scrolls through the viewport. Buffer on the ::before is ±230px.
  var targets = [
    { el: document.getElementById('break-frase'), varName: '--break-parallax',   factor: 0.38, max: 210 },
    { el: document.getElementById('resultados'),  varName: '--results-parallax', factor: 0.28, max: 210 }
  ].filter(function(t){ return t.el; });
  if(!targets.length) return;

  var ticking = false;
  function update(){
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    targets.forEach(function(t){
      var rect = t.el.getBoundingClientRect();
      if(rect.bottom < -260 || rect.top > vh + 260) return;   // skip when far off-screen
      var offset = (rect.top + rect.height / 2) - vh / 2;
      var py = offset * -t.factor;
      if(py > t.max) py = t.max; else if(py < -t.max) py = -t.max;
      t.el.style.setProperty(t.varName, py.toFixed(1) + 'px');
    });
  }

  function onScroll(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  update();
})();
