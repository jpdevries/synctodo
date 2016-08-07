module.exports.serverSideRendering = (function(){
  try {
    return !(document !== undefined)
  } catch(e) {
    return true;
  }
})();
