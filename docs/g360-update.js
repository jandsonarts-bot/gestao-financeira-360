(function(){
  function $(i){return document.getElementById(i);}
  function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  var S='font:inherit;padding:8px 10px;border-radius:8px;border:1px solid var(--bd,#999);background:var(--neu,#eee);color:var(--tx,#222);';
  var ver=null;
  function pegar(){return fetch('versao.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.json();});}
  function selo(v){
    var s=$('g360Ver');
    if(!s){s=mk('div');s.id='g360Ver';s.style.cssText='text-align:center;font:12px system-ui,sans-serif;color:var(--tx2,#789);padding:14px 0 24px';document.body.appendChild(s);}
    s.textContent='Gestão 360 · Atualização '+v;
  }
  function aviso(v){
    if($('g360Upd'))return;
    var b=mk('div');b.id='g360Upd';
    b.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99998;background:#2f7bff;color:#fff;padding:12px 14px;text-align:center;font:600 14px system-ui,sans-serif;display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap';
    b.appendChild(mk('span',null,'Nova atualização '+v+' disponível.'));
    var bt=mk('button',null,'Atualizar agora');bt.type='button';bt.style.cssText='font:inherit;padding:6px 12px;border-radius:8px;border:0;background:#fff;color:#0b1630;cursor:pointer';
    bt.onclick=function(){location.reload();};b.appendChild(bt);document.body.appendChild(b);
  }
  function checar(){
    pegar().then(function(j){
      if(ver===null){ver=j.versao;selo(ver);return;}
      if(j.versao!==ver)aviso(j.versao);
    }).catch(function(){});
  }
  checar();
  setInterval(checar,60000);
  var oculto=false;
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){oculto=true;return;}
    if(oculto){oculto=false;pegar().then(function(j){if(ver!==null&&j.versao!==ver)location.reload();}).catch(function(){});}
  });

  // salvar valores do simulador e adicionar valor por categoria
  var cfgDoc=null,aplicado=false;
  var _split=window.splitAll;
  window.splitAll=function(all){
    _split(all);
    cfgDoc=all.filter(function(x){return x&&x.id==='p1';})[0]||null;
    if(cfgDoc&&!aplicado){aplicado=true;setTimeout(aplicar,0);}
  };
  function aplicar(){
    try{
      var d=cfgDoc;if(!d)return;
      if(d.renda!=null)$('renda').value=d.renda;
      if(d.taxa!=null)$('taxa').value=d.taxa;
      if(d.meta!=null)$('meta').value=d.meta;
      if(d.meses!=null){$('meses').value=d.meses;}
      (d.cats||[]).forEach(function(v,i){var e=$('v'+i);if(e)e.value=v;});
      calc();
    }catch(e){}
  }
  var cats2=$('cats2');if(!cats2)return;
  var box=mk('div');box.style.cssText='border-top:1px solid var(--bd);margin-top:12px;padding-top:12px';
  box.appendChild(mk('div','note','Adicionar valor a uma categoria')).style.margin='0 0 6px';
  var r=mk('div');r.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:center';
  var sel=mk('select');sel.style.cssText=S;CATN.forEach(function(c,i){var o=mk('option',null,c);o.value=i;sel.appendChild(o);});
  var val=mk('input');val.type='number';val.min='0';val.step='10';val.placeholder='Valor (R$)';val.style.cssText=S+'width:120px';
  var ad=mk('button','btn sec','Adicionar valor');ad.type='button';
  r.appendChild(sel);r.appendChild(val);r.appendChild(ad);box.appendChild(r);
  var r2=mk('div');r2.style.cssText='display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px';
  var sv=mk('button','btn','Salvar valores');sv.type='button';var m=mk('span','msg');
  r2.appendChild(sv);r2.appendChild(m);box.appendChild(r2);
  cats2.parentNode.insertBefore(box,cats2.nextSibling);
  ad.onclick=function(){
    var v=+val.value;if(!(v>0)){m.className='msg err';m.textContent='Informe o valor a adicionar.';return;}
    var e=$('v'+sel.value);e.value=Math.round(((+e.value||0)+v)*100)/100;e.dispatchEvent(new Event('input'));
    val.value='';m.className='msg';m.textContent='Adicionado em '+CATN[sel.value]+'. Toque em Salvar valores para guardar.';
  };
  sv.onclick=async function(){
    var o={id:'p1',renda:+$('renda').value||0,taxa:+$('taxa').value||0,meta:+$('meta').value||0,meses:+$('meses').value||0,cats:CATN.map(function(c,i){return +$('v'+i).value||0;}),atualizado:new Date().toISOString()};
    try{await saveDoc(o);m.className='msg';m.textContent='Valores salvos.';}catch(e){m.className='msg err';m.textContent='Não consegui salvar. Tente de novo.';}
  };
})();
