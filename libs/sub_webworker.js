// sub-webworker that works up a start, end-epsilon step

importScripts('optics.js','help_methods.js');

onmessage = function(event){
  
  var data = event.data;
  
  var clusteringAlgo = new OPTICS(data.dataset);
  var results = [];
  
  var step = data.sub_worker_step/10;
  
  for(var epsilon=data.start; epsilon < data.end; epsilon += step){
  
    for(var minPts=3; minPts < 11; minPts++){
      
      var result = clusteringAlgo.start(epsilon, minPts);
      
      var symmetric_count = countValleys(result); // quality-metric of a result
      
      results.push({ e: epsilon, minPts: minPts, symmetric_count: symmetric_count })
    }
    
  }
  
  var best_result = getBestResult(results); // compare results and return result that has got hightest ratios
  
  postMessage(best_result); // sub-webworker finish point
  
};