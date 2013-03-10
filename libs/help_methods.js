
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

// first ration to determine optimal parameter settings
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

// second ration to determine optimal parameter settings
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

// the higher bith ratios are the better is a result
// results -> [{ e: Number, minPts: Number, ratio_undefined: Number, ratio_density: Number },...]
var getBestResultByHighestRatios = function(results, num_of_data_items){
  
  var ratio_density = 0;
  var best_result = null;
  
  for(var r=0; r < results.length; r++){
    
    if( results[r] && results[r].ratio_undefined >= (num_of_data_items/10) && results[r].ratio_undefined < (num_of_data_items/10)*2 ){ // first priority the less infinity data-items there are the better it is
      if( results[r].ratio_density > ratio_density ){ // second priority the more dense the clusters are in a dataset the better it is
        
        ratio_density = results[r].ratio_density;
        
        best_result = { e: results[r].e, minPts: results[r].minPts, ratio_undefined: results[r].ratio_undefined, ratio_density: results[r].ratio_density };
      }
    }
    
  }
  
  return best_result;
};

