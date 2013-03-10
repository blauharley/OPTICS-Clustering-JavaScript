// main-webworker that coordinates epsilon-steps of each sub-webworker
// there are five sub-webworker that get start and end epsilon values from the main-webworker

importScripts('help_methods.js');

// calulated optimal parameters(epsilon,minPts) by sub-webworker
var calulated_optimal_parameters = [];
var sub_workers = [];

var dataset = null;


onmessage = function(event){
  
  dataset = event.data;
  
  var max_eplison_distance = calculateMaxEpsilon(dataset);
  var max_allowed_eplison_distance = (max_eplison_distance/10) + (max_eplison_distance/100); // this number is the threshold of all sub-webworker, (max_eplison_distance/100) compensate start-value
  
  var sub_worker_step = max_allowed_eplison_distance/10;
  
  for( var start_epsilon_steps = max_eplison_distance/100; start_epsilon_steps <= max_allowed_eplison_distance; start_epsilon_steps += sub_worker_step ){
    
    var end_epsilon_steps = start_epsilon_steps + sub_worker_step;
    
    initializeSubWebWorker(start_epsilon_steps, end_epsilon_steps, dataset, max_eplison_distance, sub_worker_step);
    
  }
  
};


var initializeSubWebWorker = function(start_epsilon, end_epsilon, dataset, max_epsilon, sub_worker_step){
  
  var sub_worker = new Worker('sub_webworker.js');
  
  sub_worker.onmessage = function(event){
    
    // calculated optimal epsilon and minPts-parameter for a given dataset
    calulated_optimal_parameters.push(event.data); // event.date -> { e: Number, minPts: Number, ratio_undefined: Number, ratio_density: Number }
    
    if( calulated_optimal_parameters.length === sub_workers.length ){ // all sub-webworker have finished their calulations, now they are going to be compared
      
      var best_result = getBestResultByHighestRatios(calulated_optimal_parameters, dataset.length);
      postMessage(best_result); // main-webworker finish point
      
    }  
  };
  
  sub_worker.postMessage({ start: start_epsilon, end: end_epsilon, dataset: dataset, max_epsilon: max_epsilon, sub_worker_step: sub_worker_step });
  
  sub_workers.push(sub_worker);
  
};