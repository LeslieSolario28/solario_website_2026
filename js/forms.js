(function(){
  'use strict';

  /* popup form */
  var popup=document.getElementById("popup-form");
  if(popup){
    function openPopup(){
      popup.classList.add("active");
      document.body.style.overflow="hidden";
      var first=popup.querySelector("input:not([type=hidden]), select");
      if(first)setTimeout(function(){first.focus();},60);
    }
    function closePopup(){
      popup.classList.remove("active");
      document.body.style.overflow="";
    }
    document.addEventListener("click",function(e){
      var trigger=e.target.closest(".popup-trigger");
      if(trigger){e.preventDefault();e.stopPropagation();openPopup();}
      if(e.target===popup)closePopup();
    });
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&popup.classList.contains("active"))closePopup();});
    var closeBtn=popup.querySelector(".popup-close");
    if(closeBtn){closeBtn.setAttribute("type","button");closeBtn.addEventListener("click",closePopup);}
  }

  /* file upload label */
  var fileInput=document.getElementById('cf-file');
  var fileLabel=document.getElementById('file-label');
  if(fileInput&&fileLabel){
    fileInput.addEventListener('change',function(){
      fileLabel.textContent=fileInput.files.length?fileInput.files[0].name:'Adjuntar recibo de luz (opcional)';
    });
  }

  /* popup file upload label */
  var pFileInput=document.getElementById('pf-file');
  var pFileLabel=document.getElementById('pf-file-label');
  if(pFileInput&&pFileLabel){
    pFileInput.addEventListener('change',function(){
      pFileLabel.textContent=pFileInput.files.length?pFileInput.files[0].name:'Adjuntar recibo de luz (opcional)';
    });
  }

  /* form submit feedback — applies to the section form and the popup form */
  var forms=document.querySelectorAll('#contact-form, .popup-formfields');
  forms.forEach(function(form){
    var next=form.querySelector('input[name="_next"]');
    if(next)next.value=window.location.href;
    form.addEventListener('submit',function(){
      var btn=form.querySelector('.btn-submit');
      if(btn){btn.textContent='Enviando...';btn.disabled=true;btn.style.opacity='.6';}
    });
  });

  /* flag fields in red once the user leaves an invalid/empty required field */
  document.querySelectorAll('.contact-form input:not([type=hidden]), .contact-form textarea, .contact-form select').forEach(function(el){
    el.addEventListener('blur',function(){
      el.classList.toggle('field-invalid', !el.checkValidity());
    });
    el.addEventListener('input',function(){
      if(el.classList.contains('field-invalid') && el.checkValidity()) el.classList.remove('field-invalid');
    });
    el.addEventListener('change',function(){
      if(el.classList.contains('field-invalid') && el.checkValidity()) el.classList.remove('field-invalid');
    });
  });

  /* popup submit stays gray/disabled until every required field is valid */
  var pForm=document.querySelector('.popup-formfields');
  if(pForm){
    var pBtn=pForm.querySelector('.btn-submit');
    function refreshPopupBtn(){
      var ok=pForm.checkValidity();
      pForm.classList.toggle('is-valid',ok);
      if(pBtn)pBtn.disabled=!ok;
    }
    pForm.addEventListener('input',refreshPopupBtn);
    pForm.addEventListener('change',refreshPopupBtn);
    refreshPopupBtn();
  }
})();
