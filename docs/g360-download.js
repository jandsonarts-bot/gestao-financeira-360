(function(){
  function $(i){return document.getElementById(i);}
  function logo(c,x,y,s){
    var g=c.createLinearGradient(x,y,x+s,y+s);g.addColorStop(0,'#00d4ff');g.addColorStop(1,'#2f7bff');
    c.fillStyle=g;c.beginPath();
    if(c.roundRect)c.roundRect(x,y,s,s,s*0.26);else c.rect(x,y,s,s);
    c.fill();c.fillStyle='#ffffff';c.textAlign='center';c.textBaseline='middle';
    c.font='800 '+Math.round(s*0.42)+'px system-ui,Arial,sans-serif';c.fillText('360',x+s/2,y+s/2+1);
    c.textBaseline='alphabetic';
  }
  function reais(v){return 'R$ '+(+v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});}
  async function baixar(){
    var m=$('dlMsg');
    try{
      var mes=$('gMes')?$('gMes').value:'';
      var todas=entradas(true).filter(function(e){return !mes||e.data.slice(0,7)===mes;});
      var total=0,cart=0,pc={};
      todas.forEach(function(e){total+=e.valor;if(e.tipo==='k')cart+=e.valor;pc[e.cat]=(pc[e.cat]||0)+e.valor;});
      var cats=Object.keys(pc).sort(function(a,b){return pc[b]-pc[a];}).slice(0,10);
      var W=900,H=360+cats.length*52+90,cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');
      c.fillStyle='#ffffff';c.fillRect(0,0,W,H);
      c.fillStyle='#0b1630';c.fillRect(0,0,W,130);
      logo(c,40,25,80);
      c.fillStyle='#ffffff';c.textAlign='left';c.font='700 36px system-ui,Arial,sans-serif';c.fillText('360 Financeiro',140,68);
      c.fillStyle='#8fa6c9';c.font='400 20px system-ui,Arial,sans-serif';c.fillText('Relatório de gastos · '+(mes?mesLabel(mes):'todos os meses'),140,100);
      c.fillStyle='#0b1630';c.font='600 22px system-ui,Arial,sans-serif';
      c.fillText('Total gasto',40,190);c.fillText('No cartão',340,190);c.fillText('À vista',640,190);
      c.font='700 32px system-ui,Arial,sans-serif';
      c.fillText(reais(total),40,232);c.fillText(reais(cart),340,232);c.fillText(reais(total-cart),640,232);
      c.font='600 22px system-ui,Arial,sans-serif';c.fillStyle='#0b1630';c.fillText('Por categoria',40,300);
      var mx=Math.max.apply(null,cats.map(function(k){return pc[k];}).concat([1])),y=330;
      cats.forEach(function(k){
        c.fillStyle='#0b1630';c.font='400 20px system-ui,Arial,sans-serif';c.textAlign='left';c.fillText(k,40,y+22);
        c.fillStyle='#e6edf9';c.fillRect(220,y+6,440,22);
        c.fillStyle='#2f7bff';c.fillRect(220,y+6,Math.max(4,440*pc[k]/mx),22);
        c.fillStyle='#0b1630';c.textAlign='right';c.fillText(reais(pc[k]),860,y+22);y+=52;
      });
      if(!cats.length){c.fillStyle='#5a6b8c';c.textAlign='left';c.font='400 20px system-ui,Arial,sans-serif';c.fillText('Sem gastos neste período.',40,y+22);}
      c.textAlign='center';c.fillStyle='#8fa6c9';c.font='400 16px system-ui,Arial,sans-serif';
      c.fillText('Gerado em '+new Date().toLocaleDateString('pt-BR')+' · 360 Financeiro',W/2,H-24);
      var blob=await new Promise(function(r){cv.toBlob(r,'image/png');});
      var nome='360-financeiro-'+(mes||'todos')+'.png';
      var dl=window.claude&&claude.use?await claude.use('downloads'):null;
      if(dl)await dl.save({filename:nome,data:blob});
      else{var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nome;document.body.appendChild(a);a.click();a.remove();}
      m.className='msg';m.textContent='Relatório baixado.';
    }catch(e){m.className='msg err';m.textContent=(e&&e.code==='declined')?'Download cancelado.':'Não consegui baixar o relatório.';}
  }
  var ref=$('btBackup');if(!ref)return;
  var box=ref.parentNode,b=document.createElement('button');
  b.className='btn';b.id='btRelPng';b.type='button';b.textContent='Baixar relatório com logo (PNG)';b.onclick=baixar;
  box.insertBefore(b,ref);
  var m=document.createElement('div');m.className='msg';m.id='dlMsg';box.parentNode.insertBefore(m,box.nextSibling);
})();
