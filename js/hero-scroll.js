(function(){
  'use strict';
  var scroll=document.querySelector('.hero-scroll');
  if(!scroll)return;
  var sticky=scroll.querySelector('.hero-sticky');
  if(!sticky)return;

  var enabled=false;
  function cl(v){return v<0?0:v>1?1:v;}
  function ease(t){return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;} // easeInOutQuad

  // sequential phases (each starts once the previous one finishes):
  // 1) nav hides  2) title fades  3) video shrinks (+ goes light)  4) text rises + cluster fans out
  function apply(p,pastHero){
    var navop=1-ease(cl(p/0.12));                    // nav slides up & out 0..12%
    var fade=1-ease(cl((p-0.12)/0.16));               // title fade 12..28%
    var vid=ease(cl((p-0.28)/0.40));                  // video shrink 28..68%
    var scrim=1-ease(cl((p-0.30)/0.38));              // filter dissolves gradually w/ the shrink 30..68%
    var textrise=ease(cl((p-0.66)/0.22));             // placeholder text rises in 66..88%
    var cards=ease(cl((p-0.72)/0.28));                // cluster fans out 72..100%
    sticky.style.setProperty('--vid',vid);
    sticky.style.setProperty('--fade',fade);
    sticky.style.setProperty('--scrim',scrim);
    sticky.style.setProperty('--cards',cards);
    sticky.style.setProperty('--textrise',textrise);
    document.body.classList.toggle('hero-light',p>0.60);
    var topbar=document.querySelector('nav.topbar');
    if(topbar){
      var op=pastHero?1:navop;
      var ty=pastHero?0:(navop-1)*100;                // 0 = in place, -100% = slid up out of view
      topbar.style.opacity=op;
      topbar.style.transform='translateY('+ty+'%)';
      topbar.style.pointerEvents=op<0.05?'none':'auto';
    }
  }

  function reset(){
    sticky.style.setProperty('--vid',0);
    sticky.style.setProperty('--fade',1);
    sticky.style.setProperty('--scrim',1);
    sticky.style.setProperty('--cards',0);
    sticky.style.setProperty('--textrise',0);
    document.body.classList.remove('hero-light');
    var topbar=document.querySelector('nav.topbar');
    if(topbar){ topbar.style.opacity=''; topbar.style.transform=''; topbar.style.pointerEvents=''; }
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
