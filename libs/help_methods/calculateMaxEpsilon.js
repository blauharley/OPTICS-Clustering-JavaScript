// calculate max distance between two points within a dataset
var calculateMaxEpsilon = function(dataset){

  // TODO: implement an algorithm with O(n) to find an upper bound for Epsilon
  
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

// Pythagoras distance
// pointA -> { a: Number, b:Number... or x: Number, y:Number... }

// TODO: more efficient implementation of distance function  http://jsperf.com/distance-formula/4
// TODO: inject distance function!

var dist = function(pointA, pointB){ // pytharoras

  // ist das eine gute implementierung der distanz-funktion?
  // da diese funktion in der "innerste schleife" des algorithmus
  // ist, also sehr, sehr oft aufgerufen wird zahlt es 
  // sich hier aus performance-messungen zu machen und zu optimieren!
  // siehe http://jsperf.com/distance-formula/4
  // 
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
