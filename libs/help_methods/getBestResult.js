// evaluates results of index-number
var getBestResult = function(results){
  
  var highest_count = 0;
  var best_result = null;
  
  for(var r=0; r < results.length; r++){
    
    if( results[r].count > highest_count ){ // first priority the less infinity data-items there are the better it is
      
        highest_count = results[r].count;
        
        best_result = { e: results[r].e, minPts: results[r].minPts, count: highest_count };
      
    }
    
  }
  
  return best_result;
};