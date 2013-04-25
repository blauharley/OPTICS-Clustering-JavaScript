// calculate max distance between two points within a dataset
var calculateMaxEpsilon = function(dataset,usedDist){
  
  var maxDist = 0;
  
  dataset.forEach(function(currentPoint,index){
    
    dataset.forEach(function(point,index){
      
      var calculatedDist = usedDist(currentPoint, point);
      
      if( currentPoint !== point && calculatedDist > maxDist )
        maxDist = calculatedDist;
      
    });
    
    
  });
  
  return maxDist;
};