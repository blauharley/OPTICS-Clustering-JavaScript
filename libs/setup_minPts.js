/* create options for start and endMinPts */
(function(){
  
  var startMinPts = document.getElementById('startMinPts');
  var endMinPts = document.getElementById('endMinPts');
  
  var resetMinPtsValues = document.getElementById('resetMinPtsValues');
  
  var setup = function(startAt, stopStartAt, endAt, stopEndAt){
    
    startMinPts.innerHTML = '';
    endMinPts.innerHTML = '';
    
    for(var num=startAt; num < stopStartAt; num++){
      startMinPts.innerHTML += '<option value="'+num+'">start at '+num+'-minPts</option>';
      
    }
    
    for(var num=endAt; num < stopEndAt; num++){
      endMinPts.innerHTML += '<option value="'+num+'">end at '+num+'-minPts</option>';
    }
    
  };
  
  setup(0,101, 0,101);
  
  startMinPts.onchange = function(){
    setup(this.value,101, Number(this.value)+1,101);
    startMinPtsValue = Number(this.value);
    endMinPtsValue = Number(this.value)+1;
  };
  
  endMinPts.onchange = function(){
    if( Number(this.value) < startMinPts.value )
      setup(0,Number(this.value)-1, 0,101);
    
    endMinPtsValue = Number(this.value);
  };
  
  resetMinPtsValues.onclick = function(){
    setup(0,101, 0,101);
  };
  
})();