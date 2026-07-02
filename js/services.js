(function(){
  'use strict';
  var svcSection=document.querySelector('.svc-scroll');
  if(!svcSection)return;

  var N=4;
  var panels=svcSection.querySelectorAll('.svc-panel');
  var imgs=svcSection.querySelectorAll('.svc-img');
  var badgeGroups=svcSection.querySelectorAll('.svc-badges');
  var navItems=svcSection.querySelectorAll('.svc-dot');
  var bar=document.getElementById('svc-bar');

  var lastIdx=-1;
  function cl(v){return v<0?0:v>1?1:v;}

  function updateSvc(){
    var rect=svcSection.getBoundingClientRect();
    var sH=svcSection.offsetHeight;
    var vH=window.innerHeight;
    var progress=cl(-rect.top/(sH-vH));
    if(bar)bar.style.width=(progress*100)+'%';

    var raw=progress*(N-1+0.6);
    var idx=Math.min(N-1,Math.floor(raw));
    var t=raw-idx;

    panels.forEach(function(p,j){
      var op=0,ty=30;
      if(j===idx){if(t<0.6){op=1;ty=0;}else{var f=cl((t-0.6)/0.2);op=1-f;ty=Math.round(-25*f);}}
      if(j===idx+1&&t>0.8){var f=cl((t-0.8)/0.2);op=f;ty=Math.round(25*(1-f));}
      if(j<idx){op=0;ty=-25;}
      p.style.opacity=cl(op);
      p.style.transform='translateY('+ty+'px)';
      p.classList.toggle('active',op>0.5);
    });

    imgs.forEach(function(im,j){
      var op=0,sc=1.03;
      if(j===idx){if(t<0.6){op=1;sc=1;}else{var f=cl((t-0.6)/0.2);op=1-f;sc=1;}}
      if(j===idx+1&&t>0.8){var f=cl((t-0.8)/0.2);op=f;sc=1+0.03*(1-f);}
      if(j<idx){op=0;sc=1;}
      im.style.opacity=cl(op);
      im.style.transform='scale('+sc+')';
    });

    badgeGroups.forEach(function(bg,j){
      var op=0;
      if(j===idx){op=t<0.6?1:1-cl((t-0.6)/0.2);}
      if(j===idx+1&&t>0.8){op=cl((t-0.8)/0.2);}
      if(j<idx){op=0;}
      bg.style.opacity=cl(op);
      bg.classList.toggle('active',op>0.5);
    });

    if(idx!==lastIdx){
      lastIdx=idx;
      navItems.forEach(function(n,j){n.classList.toggle('active',j===idx);});
    }
  }
  updateSvc();
  window.addEventListener('scroll',updateSvc,{passive:true});
  navItems.forEach(function(btn){btn.addEventListener('click',function(){
    var i=parseInt(btn.dataset.slide);
    var sH=svcSection.offsetHeight;var vH=window.innerHeight;
    window.scrollTo({top:svcSection.offsetTop+(sH-vH)*(i/(N-1+0.6))+1,behavior:'smooth'});
  });});
})();
