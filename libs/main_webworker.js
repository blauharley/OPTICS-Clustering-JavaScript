// main-webworker that coordinates epsilon-steps of each sub-webworker
// there are several sub-webworker that get start and end epsilon values from the main-webworker

importScripts('help_methods.js');

// calulated optimal parameters(epsilon,minPts) by sub-webworker
var calulated_optimal_parameters = [];
var sub_workers = [];


onmessage = function(event){
  
  var dataset = event.data.dataset;
  var indexNumber = event.data.indexNumber;
  var startMinPts = event.data.startMinPts;
  var endMinPts = event.data.endMinPts;
  
  var max_eplison_distance = calculateMaxEpsilon(dataset);
  var max_allowed_eplison_distance = (max_eplison_distance/10) + (max_eplison_distance/100); // this number is the threshold of all sub-webworker, (max_eplison_distance/100) compensate start-value
  
  var sub_worker_step = max_allowed_eplison_distance/10;
  
  for( var start_epsilon_steps = max_eplison_distance/100; start_epsilon_steps <= max_allowed_eplison_distance; start_epsilon_steps += sub_worker_step ){
    
    var end_epsilon_steps = start_epsilon_steps + sub_worker_step;
    
    initializeSubWebWorker(start_epsilon_steps, end_epsilon_steps, startMinPts, endMinPts, indexNumber, dataset, sub_worker_step);
    
  }
  
};


var initializeSubWebWorker = function(start_epsilon, end_epsilon, startMinPts, endMinPts, indexNumber, dataset, sub_worker_step){
  
  var sub_worker = new Worker('sub_webworker.js');
  
  sub_worker.onmessage = function(event){
    
    /*if(event.data.test){
      postMessage(event.data);
      return;
    }*/
    // calculated optimal epsilon and minPts-parameter for a given dataset
    calulated_optimal_parameters.push(event.data); // event.date -> { e: Number, minPts: Number, ratio_undefined: Number, ratio_density: Number }
    
    // for progress-bar
    postMessage({ progress_level: (calulated_optimal_parameters.length/sub_workers.length) });
    
    if( calulated_optimal_parameters.length === sub_workers.length ){ // all sub-webworker have finished their calulations, now the results are going to be compared
      
      var best_result = getBestResult(calulated_optimal_parameters);
      postMessage(best_result); // main-webworker finish point
      
    }
    
  };
  
  sub_worker.postMessage({ 
    start: start_epsilon, 
    end: end_epsilon, 
    startMinPts: startMinPts, 
    endMinPts: endMinPts, 
    indexNumber: indexNumber, 
    dataset: dataset, 
    sub_worker_step: sub_worker_step 
  });
  
  sub_workers.push(sub_worker);
  
};