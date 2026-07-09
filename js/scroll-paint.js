(function(){
  'use strict';
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');});
    return;
  }

  var io=new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:0.12});
  document.querySelectorAll('.rv').forEach(function(el){var d=el.getAttribute('data-delay');if(d)el.style.transitionDelay=(parseInt(d,10)*0.15)+'s';io.observe(el);});

  var allPaintTitles=document.querySelectorAll('.shimmer-title');
  allPaintTitles.forEach(function(el){
    if(el.querySelector('.paint-char'))return;
    var html=el.innerHTML;
    var result='';
    var inTag=false;
    for(var i=0;i<html.length;i++){
      var c=html[i];
      if(c==='<')inTag=true;
      if(inTag){result+=c;if(c==='>')inTag=false;continue;}
      if(c===' '){result+=' ';}
      else{result+='<span class="paint-char">'+c+'</span>';}
    }
    el.innerHTML=result;
    el._chars=el.querySelectorAll('.paint-char');
  });

  function paintChars(chars,litCount){
    for(var j=0;j<chars.length;j++){
      var ch=chars[j];
      if(j<litCount){if(!ch.classList.contains('lit')){ch.classList.add('lit');ch.classList.remove('glow');}}
      else if(j===litCount&&litCount<chars.length){if(!ch.classList.contains('glow')){ch.classList.add('glow');ch.classList.remove('lit');}}
      else{ch.classList.remove('lit','glow');}
    }
  }

  var svcPaintData=[];
  document.querySelectorAll('.svc-panel .shimmer-title').forEach(function(el){
    var chars=el.querySelectorAll('.paint-char');
    svcPaintData.push({el:el,chars:chars,panel:el.closest('.svc-panel'),startTime:null});
  });

  var regularPaintData=[];
  document.querySelectorAll('.shimmer-title:not(.svc-panel .shimmer-title)').forEach(function(el){
    var chars=el.querySelectorAll('.paint-char');
    regularPaintData.push({el:el,chars:chars});
  });

  function updatePaint(){
    var vH=window.innerHeight;
    regularPaintData.forEach(function(d){
      if(!d.chars.length)return;
      var r=d.el.getBoundingClientRect();
      var progress=(vH*1.0-r.top)/(vH*0.4);
      progress=progress<0?0:progress>1?1:progress;
      paintChars(d.chars,Math.floor(progress*d.chars.length));
    });
    svcPaintData.forEach(function(d){
      if(!d.chars.length)return;
      var isActive=d.panel.classList.contains('active');
      var op=parseFloat(d.panel.style.opacity);
      if(isNaN(op))op=isActive?1:0;
      if(isActive&&op>0.3){
        if(!d.startTime)d.startTime=performance.now();
        var elapsed=(performance.now()-d.startTime)/35;
        paintChars(d.chars,Math.min(d.chars.length,Math.floor(elapsed)));
      } else {
        d.startTime=null;
        paintChars(d.chars,0);
      }
    });
  }
  window.addEventListener('scroll',updatePaint,{passive:true});
  // The regular titles paint on scroll; the Ultimate (svc) titles paint over time, so they
  // need a ticker even when you stop scrolling — but only while that section is on screen.
  var svcSection=document.getElementById('ultimate');
  if(svcSection&&('IntersectionObserver' in window)){
    var ticker=null;
    new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ if(!ticker){ ticker=setInterval(updatePaint,30); } }
        else if(ticker){ clearInterval(ticker); ticker=null; }
      });
    },{threshold:0}).observe(svcSection);
  } else {
    setInterval(updatePaint,30);
  }
  updatePaint();
})();
