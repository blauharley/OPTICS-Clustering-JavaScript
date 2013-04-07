
/* first index-number */
// symmetry-index-number to determine optimal parameter settings
var countValleys = function(dataset){
  
  var high_tolerance = (getHighestReachability(dataset)/100)*2.5;
  var start_point_pos = 0;
  var count = 0;
  
  // all points that have got infinity or undefined reachability-distances get a reachability-distance of 10000
  for(var p=0; p < dataset.length; p++){
    if( dataset[p].reachability_distance === undefined )
      dataset[p].reachability_distance = 10000;
  }
  
  var bar_height = dataset[0].reachability_distance;
  
  for(var p=1; p < dataset.length; p++){
    
    // if true, reachability-distances lie within tolerance
    if( isWithinToleranceHeight(bar_height, dataset[p].reachability_distance, high_tolerance) ){
    
      count++;
      count += p - start_point_pos - 1;
      start_point_pos++;
      p = start_point_pos;
      bar_height = dataset[p].reachability_distance;
      
    }
    
    // if true, points have got higher reachability-distances as the tolerance grants
    // or, when there are still points that must be analysed
    else if( isOutOfToleranceHeight(bar_height, dataset[p].reachability_distance, high_tolerance) || areThereNotAnalysedPoints(start_point_pos, p, dataset) ){
      start_point_pos++;
      p = start_point_pos;
      bar_height = dataset[p].reachability_distance;
    }
    
  }
  
  return count;
  
};

var getHighestReachability = function(dataset){
  
  var highest = 0;
  
  dataset.forEach(function(point,index){
    
    if(point.reachability_distance > highest){
      highest = point.reachability_distance;
    }
    
  });
  
  return highest;
};

var isWithinToleranceHeight = function(norm_height, point_height, tolerance){
  return point_height >= norm_height && point_height <= (norm_height+tolerance);
};

// 
var isOutOfToleranceHeight = function(norm_height, point_height, tolerance){
  return point_height >= norm_height && !isWithinToleranceHeight(norm_height, point_height, tolerance);
};

var areThereNotAnalysedPoints = function(start_point_pos, current_pos, dataset){
  return current_pos === (dataset.length-1) && start_point_pos < current_pos;
};


/* ----------------------------------------------------------------------------------------------------------------------- */


/* second index-number */
// reachability-index-number to determine optimal parameter settings
var countPointsWidthinReachabilityThreshold = function(dataset){
  
  var count = 0;
  var lowestReachabilityAtPosition = 0; // start at point with lowest value
  var reachabilityThreshold = getPointWithLowestReachability( dataset, lowestReachabilityAtPosition );
  reachabilityThreshold *= 1.5;
  
  dataset.forEach(function(point,index){
    
    if(point.reachability_distance < reachabilityThreshold){
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

/* third index-number */
// raising-index-number to determine optimal parameter settings
var countRaisings = function(dataset){
  
  var count = 0;
  
  for(var p=0; p < dataset.length-1; p++){
      
    if( dataset[p].reachability_distance < dataset[p+1].reachability_distance ){
      count++;
    }
    
  }
  
  return count;
};
