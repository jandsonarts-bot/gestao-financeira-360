(function(){
  function $(i){return document.getElementById(i);}
  var pronto=false,t=null,cortesAplicados=false;
  setTimeout(function(){pronto=true;},3000);
  var _split=window.splitAll;
  window.splitAll=function(all){
    _split(all);
    var d=all.filter(function(x){return x&&x.id==='p1';})[0];
    if(d&&d.cortes&&!cortesAplicados){
      cortesAplicados=true;
      setTimeout(function(){
        try{d.cortes.forEach(function(v,i){var e=$('s'+i);if(e)e.value=v;});if(window.calc)calc();}catch(e){}
      },50);
    }
  };
  function guardar(){
    var o={id:'p1',renda:+$('renda').value||0,taxa:+$('taxa').value||0,meta:+$('meta').value||0,meses:+$('meses').value||0,
      cats:CATN.map(function(c,i){return +$('v'+i).value||0;}),
      cortes:CATN.map(function(c,i){var e=$('s'+i);return e?+e.value||0:0;}),
      atualizado:new Date().toISOString()};
    Promise.resolve().then(function(){return saveDoc(o);}).then(function(){mostrar('Salvo automaticamente');}).catch(function(){mostrar('Não consegui salvar');});
  }
  var tt=null;
  function mostrar(x){
    var e=$('g360AutoMsg');
    if(!e){e=document.createElement('div');e.id='g360AutoMsg';e.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:70;background:var(--card,#fff);color:var(--tx2,#678);border:1px solid var(--bd,#ccc);border-radius:999px;padding:6px 14px;font:600 12px system-ui,sans-serif;transition:opacity .3s';document.body.appendChild(e);}
    e.textContent=x;e.style.opacity='1';clearTimeout(tt);tt=setTimeout(function(){e.style.opacity='0';},1800);
  }
  document.addEventListener('input',function(ev){
    var id=ev.target&&ev.target.id;
    if(!id||!/^(renda|taxa|meta|meses|v\d+|s\d+)$/.test(id))return;
    if(!pronto)return;
    clearTimeout(t);t=setTimeout(guardar,1200);
  });
  var todas=false;
  function filtrar(){
    var H=$('hmCats');if(!H)return;
    var vazias=0;
    Array.prototype.forEach.call(H.children,function(ct){
      if(!ct._num)return;
      var z=!(+ct._num.value>0);if(z)vazias++;
      ct.style.display=(z&&!todas&&!ct.classList.contains('open'))?'none':'';
    });
    var b=$('hmToggle');
    if(!b){b=document.createElement('button');b.id='hmToggle';b.type='button';b.className='btn sec';b.style.cssText='margin-top:10px;width:100%';
      b.onclick=function(){todas=!todas;filtrar();};H.parentNode.insertBefore(b,H.nextSibling);}
    b.style.display=(vazias||todas)?'':'none';
    b.textContent=todas?'Ocultar categorias sem valor':'Mostrar categorias sem valor ('+vazias+')';
  }
  setInterval(filtrar,600);
})();
