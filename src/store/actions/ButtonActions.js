const ButtonActions = {
  click: function(color){
    return({
      type: 'CLICK',
      color
    });
  }
};

module.exports = ButtonActions;
