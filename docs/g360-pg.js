(function(){
  function $(i){return document.getElementById(i);}
  // renomeia a aba
  document.querySelectorAll('button,a,[role=tab]').forEach(function(b){
    if(b.children.length===0&&b.textContent.trim()==='Simulador')b.textContent='Registro de PG';
  });
  window.comprovantes=[];
  var _split=window.splitAll;
  window.splitAll=function(all){_split(all);window.comprovantes=all.filter(function(x){return String(x.id||'').charAt(0)==='q';});};
  var tab=$('tab-sim');if(!tab)return;
  var first=tab.querySelector('.card');
  var card=document.createElement('div');card.className='card';card.id='cardPG';
  card.innerHTML='<h2>Registro de PG</h2>'
   +'<div class="note" style="margin:0 0 10px">Registre um pagamento e anexe o comprovante (foto ou imagem).</div>'
   +'<div class="form" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">'
   +'<label>Descrição<input type="text" id="pgDesc" maxlength="40" placeholder="Ex.: Conta de luz"></label>'
   +'<label>Valor (R$)<input type="number" id="pgValor" min="0" step="0.01"></label>'
   +'<label>Data<input type="date" id="pgData"></label>'
   +'<label>Comprovante<input type="file" id="pgFoto" accept="image/*"></label></div>'
   +'<div id="pgPrev" style="margin:8px 0"></div>'
   +'<button class="btn" id="btPg" type="button">Salvar registro</button><span class="msg" id="pgMsg"></span>'
   +'<div id="pgLista" style="margin-top:12px"></div>';
  if(first)first.parentNode.insertBefore(card,first);else tab.appendChild(card);
  var hoje=new Date();$('pgData').value=hoje.getFullYear()+'-'+('0'+(hoje.getMonth()+1)).slice(-2)+'-'+('0'+hoje.getDate()).slice(-2);
  var img='';
  function reduzir(file){
    return new Promise(function(ok,err){
      var fr=new FileReader();
      fr.onerror=function(){err();};
      fr.onload=function(){
        var im=new Image();
        im.onerror=function(){err();};
        im.onload=function(){
          var max=1000,w=im.width,h=im.height,k=Math.min(1,max/Math.max(w,h));
          var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
          c.getContext('2d').drawImage(im,0,0,c.width,c.height);
          var q=0.7,d=c.toDataURL('image/jpeg',q);
          while(d.length>600000&&q>0.3){q-=0.1;d=c.toDataURL('image/jpeg',q);}
          ok(d);
        };
        im.src=fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  $('pgFoto').addEventListener('change',async function(){
    var f=this.files&&this.files[0];img='';$('pgPrev').innerHTML='';
    if(!f)return;
    try{
      img=await reduzir(f);
      var t=document.createElement('img');t.src=img;t.alt='Prévia do comprovante';t.style.cssText='max-width:120px;max-height:120px;border-radius:10px;border:1px solid #dfe6fb';
      $('pgPrev').appendChild(t);
    }catch(e){$('pgMsg').className='msg err';$('pgMsg').textContent='Não consegui ler essa imagem.';}
  });
  function brl(x){return brl2(x);}
  function dbr(s){var p=String(s||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:s;}
  function desenhar(){
    var L=$('pgLista');if(!L)return;L.innerHTML='';
    window.comprovantes.slice().sort(function(a,b){return String(b.data).localeCompare(String(a.data));}).forEach(function(r){
      var row=document.createElement('div');row.className='item';
      if(r.foto){
        var im=document.createElement('img');im.src=r.foto;im.alt='Comprovante';im.style.cssText='width:44px;height:44px;object-fit:cover;border-radius:8px;cursor:pointer';
        im.onclick=function(){var w=window.open();if(w){w.document.write('<img style="max-width:100%" src="'+r.foto+'">');}};
        row.appendChild(im);
      }
      var a=document.createElement('span');a.textContent=r.desc+' · '+dbr(r.data);
      var b=document.createElement('span');b.textContent=brl(r.valor);
      var x=document.createElement('button');x.className='x';x.type='button';x.textContent='✕';x.setAttribute('aria-label','Excluir '+r.desc);x.onclick=function(){delDoc(r.id);};
      row.appendChild(a);row.appendChild(b);row.appendChild(x);L.appendChild(row);
    });
  }
  $('btPg').onclick=async function(){
    var m=$('pgMsg'),d=$('pgDesc').value.trim(),v=+$('pgValor').value,dt=$('pgData').value;
    if(!d||!(v>0)||!dt){m.className='msg err';m.textContent='Informe descrição, valor e data.';return;}
    try{
      var o={id:'q'+Date.now(),desc:d.slice(0,40),valor:r2(v),data:dt};
      if(img)o.foto=img;
      await saveDoc(o);
      m.className='msg';m.textContent='Registro salvo.';
      $('pgDesc').value='';$('pgValor').value='';$('pgFoto').value='';$('pgPrev').innerHTML='';img='';
    }catch(e){m.className='msg err';m.textContent='Não consegui salvar. Tente de novo.';}
  };
  var _rt=window.renderTudo;
  window.renderTudo=function(){_rt();try{desenhar();}catch(e){}};
  window.renderTudo();
})();
