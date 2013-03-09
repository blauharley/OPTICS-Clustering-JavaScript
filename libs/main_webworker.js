// main-webworker that coordinates epsilon-steps of each sub-webworker

importScripts('help_methods.js');

// calulated optimal parameters(epsilon,minPts) by sub-webworker
var calulated_optimal_parameters = [];
var sub_workers = [];


onmessage = function(event){
  
  var dataset = event.data;
  
  var max_eplison_distance = calculateMaxEpsilon(dataset);
  var max_allowed_eplison_distance = max_eplison_distance/2; // this number is the threshold of all sub-webworker
  
  // start-step is max_eplison_distance/100 for first sub-webworker
  for( var start_epsilon_steps = max_eplison_distance/100; start_epsilon_steps < max_allowed_eplison_distance; start_epsilon_steps += (max_eplison_distance/10) ){
    
    var end_epsilon_steps = start_epsilon_steps + (max_eplison_distance/10);
    
    initializeSubWebWorker(start_epsilon_steps, end_epsilon_steps, dataset, max_eplison_distance);
    
  }
  
  
};


var initializeSubWebWorker = function(start_epsilon, end_epsilon, dataset, max_epsilon){
  
  var sub_worker = new Worker('sub_webworker.js');
  
  sub_worker.onmessage = function(event){
  
    // calculated optimal epsilon and minPts-parameter for a given dataset
    calulated_optimal_parameters.push(event.data); // event.date -> { e: Number, minPts: Number, ratio_undefined: Number, ratio_density: Number }
    
    if( calulated_optimal_parameters.length === sub_workers.length ){ // all sub-webworker have finished their calulations, now they are going to be compared
      
      var best_result = getBestResultByHighestRatios(calulated_optimal_parameters);
      postMessage(best_result); // finish point
    }  
  };
  
  sub_worker.postMessage({ start: start_epsilon, end: end_epsilon, dataset: dataset, max_epsilon: max_epsilon })
  
  sub_workers.push(sub_worker);
  
};