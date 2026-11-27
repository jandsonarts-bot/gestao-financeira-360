/* Ponte entre o app e o Firebase: Login Google, Firestore, download e leitura por IA (opcional). */
(function(){
  var V='11.10.0',B='https://www.gstatic.com/firebasejs/'+V+'/';
  var cfg=window.G360_FIREBASE||{};
  var ok=cfg.apiKey&&cfg.apiKey!=='COLE_AQUI';
  var mods=null;
  function load(){
    if(!ok)return Promise.resolve(null);
    if(mods)return mods;
    mods=Promise.all([import(B+'firebase-app.js'),import(B+'firebase-auth.js'),import(B+'firebase-firestore.js')]).then(function(m){
      var app=m[0].initializeApp(cfg),auth=m[1].getAuth(app),fs=m[2].getFirestore(app);
      var pronto=new Promise(function(res){var off=m[1].onAuthStateChanged(auth,function(u){off();res(u);});});
      return {app:app,A:m[1],F:m[2],auth:auth,fs:fs,pronto:pronto};
    });
    return mods;
  }
  var user={id:async function(){var M=await load();if(!M)throw new Error('sem firebase');var u=await M.pronto;if(!u)throw new Error('sem login');return u.uid;}};
  var db={collection:function(path){
    var segs=path.split('/');
    function C(M){return M.F.collection.apply(null,[M.fs].concat(segs));}
    return {
      doc:function(id){return {
        set:async function(o){var M=await load();return M.F.setDoc(M.F.doc.apply(null,[M.fs].concat(segs,[id])),o);},
        delete:async function(){var M=await load();return M.F.deleteDoc(M.F.doc.apply(null,[M.fs].concat(segs,[id])));}
      };},
      onSnapshot:function(cb,eb){load().then(function(M){M.F.onSnapshot(C(M),cb,eb);},eb);}
    };
  }};
  var downloads={save:async function(o){
    var a=document.createElement('a'),u=URL.createObjectURL(o.data);a.href=u;a.download=o.filename;document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(u);a.remove();},1000);
  }};
  function b64(blob){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1]);};r.onerror=rej;r.readAsDataURL(blob);});}
  var sample=null;
  if(window.G360_AI&&ok){
    sample=async function(prompt,opt){
      var M=await load();
      var ai=await import(B+'firebase-ai.js');
      var model=ai.getGenerativeModel(ai.getAI(M.app,{backend:new ai.GoogleAIBackend()}),{model:'gemini-2.5-flash'});
      var parts=[{text:prompt}];
      for(var i=0;i<((opt&&opt.images)||[]).length;i++){var bl=opt.images[i];parts.push({inlineData:{mimeType:bl.type||'image/jpeg',data:await b64(bl)}});}
      var r=await model.generateContent(parts);
      return {text:r.response.text()};
    };
    sample.limits=async function(){return {images:true};};
  }
  window.claude={use:async function(n){
    if(n==='db')return (await load())?db:null;
    if(n==='user')return (await load())?user:null;
    if(n==='downloads')return downloads;
    if(n==='sample')return sample;
    return null;
  }};
  document.addEventListener('DOMContentLoaded',function(){
    var q=document.getElementById('qrLink');if(q&&!q.value)q.value=location.origin+location.pathname;
    var bar=document.createElement('div');
    bar.style.cssText='display:flex;gap:10px;align-items:center;justify-content:flex-end;padding:8px 14px;font:13px system-ui,sans-serif;color:var(--tx,#222);flex-wrap:wrap';
    var t=document.createElement('span'),b=document.createElement('button');
    b.style.cssText='font:inherit;padding:6px 12px;border-radius:8px;border:1px solid var(--bd,#999);background:var(--neu,#eee);color:inherit;cursor:pointer';
    bar.appendChild(t);bar.appendChild(b);document.body.insertBefore(bar,document.body.firstChild);
    if(!ok){t.textContent='Modo local: configure o Firebase em firebase-config.js para entrar com Google.';b.style.display='none';return;}
    load().then(function(M){
      M.A.onAuthStateChanged(M.auth,function(u){
        if(u){t.textContent='Conectado: '+(u.displayName||u.email);b.textContent='Sair';b.onclick=function(){M.A.signOut(M.auth).then(function(){location.reload();});};}
        else{t.textContent='Seus dados estão só neste navegador.';b.textContent='Entrar com Google';b.onclick=function(){M.A.signInWithPopup(M.auth,new M.A.GoogleAuthProvider()).then(function(){location.reload();}).catch(function(){t.textContent='Não foi possível entrar. Tente de novo.';});};}
      });
    });
  });
})();
