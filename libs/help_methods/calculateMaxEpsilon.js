// calculate max distance between two points within a dataset
var calculateMaxEpsilon = function(dataset){
  
  var maxDist = 0;
  
  dataset.forEach(function(point,index){
    
    var currentPoint = point;
    dataset.forEach(function(point,index){
      
      var calculatedDist = dist(currentPoint, point);
      
      if( currentPoint !== point && calculatedDist > maxDist )
        maxDist = calculatedDist;
      
    });
    
    
  });
  
  return maxDist;
};

// Pythagoras distance
// pointA -> { a: Number, b:Number... or x: Number, y:Number... }
var dist = function(pointA, pointB){ // pytharoras
  return Math.sqrt((pointA.x - pointB.x) * (pointA.x - pointB.x) + (pointA.y - pointB.y) * (pointA.y - pointB.y));
};