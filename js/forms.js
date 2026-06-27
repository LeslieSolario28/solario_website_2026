(function(){
  'use strict';

  /* popup form */
  var popup=document.getElementById("popup-form");
  if(popup){
    document.addEventListener("click",function(e){
      var trigger=e.target.closest(".popup-trigger");
      if(trigger){e.preventDefault();e.stopPropagation();popup.classList.add("active");}
      if(e.target===popup)popup.classList.remove("active");
    });
    document.addEventListener("keydown",function(e){if(e.key==="Escape")popup.classList.remove("active");});
    var closeBtn=popup.querySelector(".popup-close");
    if(closeBtn)closeBtn.addEventListener("click",function(){popup.classList.remove("active");});
  }

  /* file upload label */
  var fileInput=document.getElementById('cf-file');
  var fileLabel=document.getElementById('file-label');
  if(fileInput&&fileLabel){
    fileInput.addEventListener('change',function(){
      fileLabel.textContent=fileInput.files.length?fileInput.files[0].name:'Adjuntar recibo de luz (opcional)';
    });
  }

  /* form submit */
  var form=document.getElementById('contact-form');
  if(form){
    form.querySelector('input[name="_next"]').value=window.location.href;
    form.addEventListener('submit',function(){
      var btn=form.querySelector('.btn-submit');
      btn.textContent='Enviando...';btn.disabled=true;btn.style.opacity='.6';
    });
  }
})();
