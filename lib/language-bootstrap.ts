/** Runs in the head, before any editor text can be painted. */
export const LANGUAGE_BOOTSTRAP = `(function(){
  var language=(navigator.language||'').toLowerCase();
  var lang=language.indexOf('zh')===0?'zh':language.indexOf('ko')===0?'ko':language.indexOf('ja')===0?'ja':'en';
  try {
    var ui=JSON.parse(localStorage.getItem('m3e:ui')||'null');
    if(ui&&['ja','en','zh','ko'].indexOf(ui.lang)!==-1)lang=ui.lang;
  } catch(e) {}
  document.documentElement.lang=lang;
  function localize(node){
    if(node.nodeType!==1)return;
    if(node.hasAttribute('data-ui-placeholder')){
      var labels=JSON.parse(node.getAttribute('data-ui-placeholder'));
      node.setAttribute('placeholder',labels[lang]||'');
    }
    var fields=node.querySelectorAll('[data-ui-placeholder]');
    for(var i=0;i<fields.length;i++)localize(fields[i]);
  }
  // Attribute markers are available as soon as a complete input tag is parsed.
  // Observe only additions, so our placeholder updates cannot trigger a loop.
  var observer=new MutationObserver(function(records){
    for(var i=0;i<records.length;i++){
      for(var j=0;j<records[i].addedNodes.length;j++)localize(records[i].addedNodes[j]);
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',function(){observer.disconnect();},{once:true});
})();`;
