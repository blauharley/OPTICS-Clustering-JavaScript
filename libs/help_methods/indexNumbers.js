

/* first index-number */
// reachability-index-number to determine optimal parameter settings
var countLowReachabilities = function(dataset){
  
  var count = 0;
  var lowestReachabilityAtPosition = 0; // take point with lowest value
  var reachabilityThreshold = getPointWithLowestReachability( dataset, lowestReachabilityAtPosition );
  reachabilityThreshold *= 1.5;
  
  dataset.forEach(function(point,index){
    
    if(point.reachability_distance < reachabilityThreshold){
      count += 2;
    }
    
    if(!point.reachability_distance){
      count++;
    }
    
  });
  
  return count;
};


var getPointWithLowestReachability = function(dataset,lowestReachability){
  
  var low = 100000;
  var lowestReachabilities = [];
  
  dataset.forEach(function(point,index){
      
    if( point.reachability_distance < low ){
      low = point.reachability_distance;
      lowestReachabilities.push(point.reachability_distance);
    }
    
  });
  
  return lowestReachabilities[lowestReachabilities.length-1-lowestReachability];
};


/* ----------------------------------------------------------------------------------------------------------------------- */

/* second index-number */
// raising-index-number to determine optimal parameter settings
var countGradients = function(dataset){
  
  var count = 0;
  
  for(var p=0; p < dataset.length-1; p++){
    
    if( dataset[p].reachability_distance < dataset[p+1].reachability_distance ){
      count += 2;
    }
    
    if(!dataset[p].reachability_distance){
      count *= 2;
    }
    
  }
  
  return count;
};
