// sub-webworker that works up a start, end-epsilon step

importScripts('optics.js','help_methods/indexNumbers.js','help_methods/getBestResult.js');

onmessage = function(event){
  
  var data = event.data;
  
  var clusteringAlgo = new OPTICS(data.dataset);
  var results = [];
  var step = data.subWorkerStep/10;
  
  for(var epsilon=data.start; epsilon < data.end; epsilon += step){
  
    for(var minPts=data.startMinPts; minPts < data.endMinPts; minPts++){
      
      var result = clusteringAlgo.start(epsilon, minPts);
      
      if(data.indexNumber === 'density'){
        
        var densityCount = countLowReachabilities(result); // an index-number methode
        results.push({ e: epsilon, minPts: minPts, count: densityCount });
        
      }
      else if(data.indexNumber === 'gradient'){
      
        var gradientsCount = countGradients(result); // an index-number methode
        results.push({ e: epsilon, minPts: minPts, count: gradientsCount });
        
      }
      
    }
    
  }
  
  var bestResults = getBestResults(results); // compare results and return results that have got hightest-count
  
  postMessage(bestResults); // sub-webworker finished
  
};