// sub-webworker that works up a start, end-epsilon step

importScripts('optics.js','help_methods.js');

onmessage = function(event){
  
  var data = event.data;
  
  var clusteringAlgo = new OPTICS(data.dataset);
  var results = [];
  
  var step = data.sub_worker_step/10;
  
  for(var epsilon=data.start; epsilon < data.end; epsilon += step){
  
    for(var minPts=data.startMinPts; minPts < data.endMinPts; minPts++){
      
      var result = clusteringAlgo.start(epsilon, minPts);
      
      if(data.indexNumber === 'lowest_reachability'){
        
        var reachability_count = countPointsWidthinReachabilityThreshold(result); // an index-number methode
        results.push({ e: epsilon, minPts: minPts, count: reachability_count });
        //postMessage({ test: 'test', e: epsilon, minPts: minPts, count: reachability_count, result:result});
      }
      else{
      
        var symmetric_count = countValleys(result); // an index-number methode
        results.push({ e: epsilon, minPts: minPts, count: symmetric_count });
        //postMessage({ test: 'test', e: epsilon, minPts: minPts, count: symmetric_count, result:result});
        
      }
      
    }
    
  }
  
  var best_result = getBestResult(results); // compare results and return result that has got hightest count
  
  postMessage(best_result); // sub-webworker finish point
  
};