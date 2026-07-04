(function(){
  'use strict';
  var svcSection=document.querySelector('.svc-scroll');
  if(!svcSection)return;

  var N=4;
  var panels=svcSection.querySelectorAll('.svc-panel');
  var imgs=svcSection.querySelectorAll('.svc-img');
  var badgeGroups=svcSection.querySelectorAll('.svc-badges');
  var iconChips=svcSection.querySelectorAll('.svc-icon-chip');
  var navItems=svcSection.querySelectorAll('.svc-dot');
  var bar=document.getElementById('svc-bar');
  var svcContent=document.getElementById('svc-content');
  var svcText=svcSection.querySelector('.svc-text');
  var iconRow=document.getElementById('svc-icon-row');
  var imgWrap=svcSection.querySelector('.svc-img-wrap');

  var lastIdx=-1;
  var enabled=false;
  function cl(v){return v<0?0:v>1?1:v;}

  // Anchor the icon row to STABLE references only (the media card and the content/text
  // rects, which don't move while the section is pinned) — never to the title, which
  // slides during the panel crossfades and would make the row jump on scroll.
  // Bottom edge sits on the card's base; right edge aligns to the text column; clamped
  // so the left edge never crosses the gutter.
  function placeIconRow(){
    if(!iconRow||!svcContent||!imgWrap)return;
    var contentRect=svcContent.getBoundingClientRect();
    var cardRect=imgWrap.getBoundingClientRect();
    iconRow.style.height='';
    iconRow.style.right='auto';
    var box=iconRow.getBoundingClientRect();
    // left edge stays aligned to the text column (left:0 in CSS); only the vertical
    // position is computed — its base sits on the card's bottom edge (a stable reference)
    iconRow.style.top=(cardRect.bottom-contentRect.top-box.height)+'px';
  }

  function updateSvc(){
    if(!enabled)return;
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

    function fadeGroup(el,j){
      var op=0;
      if(j===idx){op=t<0.6?1:1-cl((t-0.6)/0.2);}
      if(j===idx+1&&t>0.8){op=cl((t-0.8)/0.2);}
      if(j<idx){op=0;}
      el.style.opacity=cl(op);
      el.classList.toggle('active',op>0.5);
    }
    badgeGroups.forEach(fadeGroup);

    // MEM/BESS/PV/Ultimate stack up as each service appears and all stay visible —
    // by the last slide all four sit together in the row.
    iconChips.forEach(function(chip){
      var k=parseInt(chip.dataset.appear,10);
      chip.classList.toggle('visible',idx>=k);
      chip.classList.toggle('current',idx===k);
    });

    if(idx!==lastIdx){
      lastIdx=idx;
      navItems.forEach(function(n,j){n.classList.toggle('active',j===idx);});
      placeIconRow();
    }
  }
  function checkMode(){
    var on=window.matchMedia('(min-width: 901px)').matches;
    if(on&&!enabled){enabled=true;updateSvc();placeIconRow();}
    else if(!on&&enabled){enabled=false;}
  }
  checkMode();
  requestAnimationFrame(function(){ if(enabled) placeIconRow(); });
  window.addEventListener('load',function(){ if(enabled) placeIconRow(); });
  window.addEventListener('scroll',updateSvc,{passive:true});
  window.addEventListener('resize',function(){checkMode();if(enabled)placeIconRow();});
  navItems.forEach(function(btn){btn.addEventListener('click',function(){
    var i=parseInt(btn.dataset.slide);
    if(!enabled){
      // mobile/tablet: no scroll-jacking — dots just swap which panel/image is shown
      panels.forEach(function(p,j){p.classList.toggle('active',j===i);});
      imgs.forEach(function(im,j){im.classList.toggle('active',j===i);});
      navItems.forEach(function(n,j){n.classList.toggle('active',j===i);});
      return;
    }
    var sH=svcSection.offsetHeight;var vH=window.innerHeight;
    window.scrollTo({top:svcSection.offsetTop+(sH-vH)*(i/(N-1+0.6))+1,behavior:'smooth'});
  });});
})();
