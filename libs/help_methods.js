
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

// calculate density of a cluster in a dataset
var calculateClusterDensity = function(dataset){
  
  var formed_dataset = [];
  
  dataset.forEach(function(point,index){
    formed_dataset.push( point.attribute )
  });
  
  var max_e_of_cluster = calculateMaxEpsilon(formed_dataset); // calculate diameter of circle
  var rough_area_of_cluster = calculateCircalArea(max_e_of_cluster)
  
  return formed_dataset.length/rough_area_of_cluster;
};

// returns a cluster by searching for a color
var getClusterbyColor = function(cluster_color,dataset){
     
  var cluster = [];
  var last_element_color = '';
  
  for(var data_item=0; data_item < dataset.length; data_item++){
  
    if( dataset[data_item].color === last_element_color && cluster_color === last_element_color ){
      cluster.push(dataset[data_item]);
    }
    else{
      
      if( cluster.length > 1 )
        break;
        
      cluster = [];
      cluster.push(dataset[data_item]);
    }
    
    last_element_color = dataset[data_item].color;
  }
  
  return cluster;
  
};

// first metric to determine optimal parameter settings
var getRatioNotUndefinedToUndefined = function(dataset){

  var num_of_undefined_elements = 0;
  
  for(var ele=0; ele < dataset.length; ele++)
    if( dataset[ele].reachability_distance === undefined )
      num_of_undefined_elements++;
  
  if(num_of_undefined_elements)
    return dataset.length / num_of_undefined_elements;
  else
    return dataset.length;
    
};

// second metric to determine optimal parameter settings
var countValleys = function(dataset){
  
  // all points that have got infinity or undefined reachability-distances get a certain reachability-distance of 1000
  for(var p=0; p < dataset.length; p++){
    if( dataset[p].reachability_distance === undefined )
      dataset[p].reachability_distance = 1000;
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

// not used metric to determine optimal parameter settings
var getRatioClusterDensityAverage = function(dataset){
        
  var cluster_densities = [];
  var ele_color = '';
  
  for(var ele=0; ele < dataset.length; ele++){
  
    if( ele_color === dataset[ele].color ){ // next element has got same color so it is a cluster
      
      var cluster = getClusterbyColor( ele_color, dataset );
     
      var ratio_density = calculateClusterDensity(cluster);
      
      cluster_densities.push(ratio_density);
      
      ele += cluster.length;
    }
    
    if( !dataset[ele] )
      break;
      
    ele_color = dataset[ele].color;
  }
  
  var highest_density = 0;
  cluster_densities.forEach(function(val, index){
    highest_density += val;
  });
  
  return highest_density/cluster_densities.length;
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

// diameter of a circle
var calculateCircalArea = function(diameter){
  return ((diameter*diameter)*Math.PI)/4;
};


// evaluates results of metric
var getBestResult = function(results){
  
  var highest_symentric_count = 0;
  var best_result = null;
  
  for(var r=0; r < results.length; r++){
    
    if( results[r].symmetric_count > highest_symentric_count ){ // first priority the less infinity data-items there are the better it is
      
        highest_symentric_count = results[r].symmetric_count;
        
        best_result = { e: results[r].e, minPts: results[r].minPts, symmetric_count: highest_symentric_count };
      
    }
    
  }
  
  return best_result;
};

