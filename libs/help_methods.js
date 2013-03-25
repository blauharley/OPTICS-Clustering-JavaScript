
// calculate max distance between two points within a cluster
var calculateMaxEpsilon = function(dataset){
  
  var max_eps = 0;
  
  dataset.forEach(function(point,index){
    
    var current_point = point;
    dataset.forEach(function(point,index){
      
      if( current_point !== point && dist(current_point, point) > max_eps )
        max_eps = dist(current_point, point);
      
    });
    
    
  });
  
  return max_eps;
};


/* first index-number */
// symmetry-index-number to determine optimal parameter settings
var countValleys = function(dataset){
  
  // all points that have got infinity or undefined reachability-distances get a certain reachability-distance of 1000
  for(var p=0; p < dataset.length; p++){
    if( dataset[p].reachability_distance === undefined )
      dataset[p].reachability_distance = 10000;
  }
  
  var high_tolerance = (dataset[0].reachability_distance/100)*5;
  
  var bar_height = dataset[0].reachability_distance;
  var start_point_pos = 0;
  var count = 0;
  
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


/* second index-number */
// reachability-index-number to determine optimal parameter settings
var countPointsWidthinReachabilityThreshold = function(dataset){
  
  var count = 0;
  var lowestReachabilityAtPosition = 0; // start at point with lowest value
  var reachabilityThreshold = getPointWithLowestReachability( dataset, lowestReachabilityAtPosition );
  reachabilityThreshold *= 2;
  
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




// Pythagoras distance
// pointA -> { a: Number, b:Number... or x: Number, y:Number... }
var dist = function(pointA, pointB){ // pytharoras
    
  var multiplied_axises = [];
  for(var axis in pointA){
    if( !isNaN( Number(pointA[axis]) ) ) // axis must have got metric value in order to be processed
      multiplied_axises.push( ((pointA[axis] - pointB[axis]) * (pointA[axis] - pointB[axis])) );
  }
  
  var sum = 0;
  multiplied_axises.forEach(function(val,index){
    sum += val;
  });
  
  return Math.sqrt(sum);
};



// evaluates results of metric
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

