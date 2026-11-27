(function(){
  function $(i){return document.getElementById(i);}
  window.receitas=[];
  var _split=window.splitAll;
  window.splitAll=function(all){_split(all);window.receitas=all.filter(function(x){return String(x.id||'').charAt(0)==='r';});};
  function mesSel(){var g=$('gMes');var v=g?g.value:'';return v||hojeMes();}
  function doMes(m){return window.receitas.filter(function(r){return r.rec==='m'?r.mes<=m:r.mes===m;});}
  window.extraRenda=function(){var t=0;doMes(mesSel()).forEach(function(r){t+=+r.valor||0;});return t;};
  var ref=$('renda');if(!ref)return;
  var base=ref.closest('.card');
  var card=document.createElement('div');card.className='card';card.id='cardReceitas';
  card.innerHTML='<h2>Receitas extras</h2>'
   +'<div class="note" style="margin:0 0 10px">Entradas além da renda fixa, como aluguel, férias, 13º ou bônus. Elas entram no cálculo da sobra do mês.</div>'
   +'<div class="form" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">'
   +'<label>Descrição<input type="text" id="rcDesc" maxlength="40" placeholder="Ex.: Aluguel, Férias"></label>'
   +'<label>Valor (R$)<input type="number" id="rcValor" min="0" step="10"></label>'
   +'<label>Tipo<select id="rcRec"><option value="m">Todo mês (a partir do mês)</option><option value="u">Só uma vez</option></select></label>'
   +'<label>Mês<input type="month" id="rcMes"></label></div>'
   +'<button class="btn" id="btRc" type="button">Adicionar receita</button><span class="msg" id="rcMsg"></span>'
   +'<div id="rcLista" style="margin-top:12px"></div><div id="rcTotal" class="note" style="margin-top:8px"></div>';
  base.parentNode.insertBefore(card,base.nextSibling);
  $('rcMes').value=hojeMes();
  function brl(x){return brl2(x);}
  function mlabel(m){return mesLabel(m);}
  function desenhar(){
    var L=$('rcLista');if(!L)return;L.innerHTML='';var m=mesSel(),lista=doMes(m),t=0;
    lista.sort(function(a,b){return String(a.mes).localeCompare(String(b.mes));}).forEach(function(r){
      t+=+r.valor||0;
      var row=document.createElement('div');row.className='item';
      var a=document.createElement('span');a.textContent=r.desc+' · '+(r.rec==='m'?'todo mês desde '+mlabel(r.mes):'única em '+mlabel(r.mes));
      var b=document.createElement('span');b.textContent='+ '+brl(r.valor);b.style.color='var(--pos)';
      var x=document.createElement('button');x.className='x';x.type='button';x.textContent='✕';x.setAttribute('aria-label','Excluir '+r.desc);x.onclick=function(){delDoc(r.id);};
      row.appendChild(a);row.appendChild(b);row.appendChild(x);L.appendChild(row);
    });
    var fixa=+$('renda').value||0;
    $('rcTotal').textContent=lista.length?('Em '+mlabel(m)+': renda fixa '+brl(fixa)+' + extras '+brl(t)+' = '+brl(fixa+t)+'.'):('Nenhuma receita extra em '+mlabel(m)+'.');
  }
  $('btRc').onclick=async function(){
    var msg=$('rcMsg'),d=$('rcDesc').value.trim(),v=+$('rcValor').value,mes=$('rcMes').value;
    if(!d||!(v>0)||!mes){msg.className='msg err';msg.textContent='Informe descrição, valor e mês.';return;}
    try{await saveDoc({id:'r'+Date.now(),desc:d.slice(0,40),valor:r2(v),rec:$('rcRec').value,mes:mes});
      msg.className='msg';msg.textContent='Receita adicionada.';$('rcDesc').value='';$('rcValor').value='';
    }catch(e){msg.className='msg err';msg.textContent='Não consegui salvar. Tente de novo.';}
  };
  var _rt=window.renderTudo;
  window.renderTudo=function(){_rt();try{desenhar();}catch(e){}try{calc();}catch(e){}};
  $('renda').addEventListener('input',desenhar);
  window.renderTudo();
})();
