// evaluates results of index-number
var getBestResults = function(results){
  
  var highestCount = 0;
  var bestResults = [];
  
  /* search for highest-count */
  highestCount = getHighestCount(results);
  
  /* search for all results that have got the highest-count */
  for(var h=0; h < results.length; h++){
    if( results[h].count === highestCount ){
      bestResults.push( { e: results[h].e, minPts: results[h].minPts, count: highestCount } );
    }
  }
  
  return bestResults;
};

/* use highest-count to search for results that have got the same count */
var getHighestCount = function(results){
  var count = 0;
  for(var r=0; r < results.length; r++){
    
    if( results[r].count > count ){
        count = results[r].count;
    }
    
  }
  return count;
};