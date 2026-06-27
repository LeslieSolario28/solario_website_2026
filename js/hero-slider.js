(function(){
  'use strict';
  var hsTrack=document.getElementById('hs-track');
  var hsCards=document.querySelectorAll('.hs-card');
  var hsCurrent=document.getElementById('hs-current');
  var hsBarFill=document.getElementById('hs-bar-fill');
  var hsTotal=hsCards.length;
  hsCards.forEach(function(c){ var cl=c.cloneNode(true);cl.classList.remove('active');hsTrack.appendChild(cl); });
  var allHs=hsTrack.querySelectorAll('.hs-card');
  var hsIdx=0;
  var cardGap=16;
  function getCardW(){ return allHs[0].offsetWidth+cardGap; }
  function setHsSlide(i){
    hsIdx=i;
    var cw=getCardW();
    allHs.forEach(function(c,j){
      c.classList.remove('active','hs-next','hs-peek','hs-exit');
      var pos=j-hsIdx;
      if(pos===0){c.classList.add('active');}
      else if(pos===1){c.classList.add('hs-next');}
      else if(pos===2){c.classList.add('hs-peek');}
      else if(pos===-1){c.classList.add('hs-exit');}
      c.style.left=(pos*cw)+'px';
    });
    var di=hsIdx%hsTotal;
    if(hsCurrent)hsCurrent.textContent=('0'+(di+1)).slice(-2);
    if(hsBarFill)hsBarFill.style.width=((di+1)/hsTotal*100)+'%';
  }
  if(allHs.length){
    setHsSlide(0);
    setInterval(function(){
      hsIdx++;
      if(hsIdx>=hsTotal){
        setHsSlide(hsIdx);
        setTimeout(function(){
          allHs.forEach(function(c){c.style.transition='none';});
          hsIdx=0;
          setHsSlide(0);
          setTimeout(function(){allHs.forEach(function(c){c.style.transition='';});},50);
        },600);
      } else { setHsSlide(hsIdx); }
    },4000);
  }
})();
