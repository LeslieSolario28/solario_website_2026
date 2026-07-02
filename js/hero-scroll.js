(function(){
  'use strict';
  var scroll=document.querySelector('.hero-scroll');
  if(!scroll)return;
  var sticky=scroll.querySelector('.hero-sticky');
  if(!sticky)return;

  var enabled=false;
  function cl(v){return v<0?0:v>1?1:v;}
  function ease(t){return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;} // easeInOutQuad

  function apply(p,pastHero){
    var vid=ease(cl(p/0.55));                 // video shrink 0..55%
    var fade=cl(1-p/0.30);                     // title/scrim fade out by 30%
    var cards=ease(cl((p-0.45)/0.45));         // cluster fans out 45%..90%
    sticky.style.setProperty('--vid',vid);
    sticky.style.setProperty('--fade',fade);
    sticky.style.setProperty('--cards',cards);
    document.body.classList.toggle('hero-light',p>0.42);
    document.body.classList.toggle('hero-navcompact',p>0.42&&!pastHero);
  }

  function reset(){
    sticky.style.setProperty('--vid',0);
    sticky.style.setProperty('--fade',1);
    sticky.style.setProperty('--cards',0);
    document.body.classList.remove('hero-light');
    document.body.classList.remove('hero-navcompact');
  }

  function update(){
    if(!enabled)return;
    var rect=scroll.getBoundingClientRect();
    var sH=scroll.offsetHeight, vH=window.innerHeight;
    var p=cl(-rect.top/(sH-vH));
    var pastHero=rect.bottom<=60;
    apply(p,pastHero);
  }

  function checkMode(){
    var on=window.matchMedia('(min-width: 901px)').matches;
    if(on&&!enabled){enabled=true;update();}
    else if(!on&&enabled){enabled=false;reset();}
    else if(!on){reset();}
  }

  checkMode();
  update();
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',function(){checkMode();update();});

  // test hook: freeze at a given progress without scrolling
  window.__setHeroP=function(p,pastHero){ if(enabled) apply(cl(p),!!pastHero); };
})();
