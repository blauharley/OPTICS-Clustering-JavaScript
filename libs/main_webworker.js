// main-webworker that coordinates epsilon-steps of each sub-webworker
// there are several sub-webworker that get start and end epsilon values from the main-webworker

importScripts('help_methods/calculateMaxEpsilon.js','help_methods/getBestResult.js', 'optics.js');

// calulated optimal parameters(epsilon,minPts) by sub-webworker
var calulatedOptimalParameters = [];
var subWorkers = [];
var subWorkersFinished = 0;

onmessage = function(event){
  
  var dataset = event.data.dataset;
  var indexNumber = event.data.indexNumber;
  var startMinPts = event.data.startMinPts;
  var endMinPts = event.data.endMinPts;
  
  var usedDist = new OPTICS(event.data.dataset).dist; 
  var maxEplisonDistance = calculateMaxEpsilon(dataset,usedDist);
  var maxAllowedEplisonDistance = (maxEplisonDistance/10) + (maxEplisonDistance/100); // this number is the threshold of all sub-webworker, (maxEplisonDistance/100) compensate start-value
  
  var subWorkerStep = maxAllowedEplisonDistance/10;
  
  for( var startEpsilonSteps = maxEplisonDistance/100; startEpsilonSteps <= maxAllowedEplisonDistance; startEpsilonSteps += subWorkerStep ){
    
    var endEpsilonSteps = startEpsilonSteps + subWorkerStep;
    
    initializeSubWebWorker(startEpsilonSteps, endEpsilonSteps, startMinPts, endMinPts, indexNumber, dataset, subWorkerStep);
    
  }
  
};


var initializeSubWebWorker = function(startEpsilon, endEpsilon, startMinPts, endMinPts, indexNumber, dataset, subWorkerStep){
  
  var subWorker = new Worker('sub_webworker.js');
  
  subWorker.onmessage = function(event){
    
    // calculated optimal epsilon and minPts-parameter for a given dataset
    calulatedOptimalParameters = calulatedOptimalParameters.concat(event.data); // event.date -> { e: Number, minPts: Number, count: Number }
    
    subWorkersFinished++;
    
    // for progress-bar
    postMessage({ progressLevel: (subWorkersFinished/subWorkers.length) });
    
    if( subWorkersFinished === subWorkers.length ){ // all sub-webworker have finished their calulations, now the results are going to be compared
      
      var bestResults = getBestResults(calulatedOptimalParameters);
      postMessage(bestResults); // main-webworker finished
      
    }
    
  };
  
  subWorker.postMessage({ 
    start: startEpsilon, 
    end: endEpsilon, 
    startMinPts: startMinPts, 
    endMinPts: endMinPts, 
    indexNumber: indexNumber, 
    dataset: dataset, 
    subWorkerStep: subWorkerStep 
  });
  
  subWorkers.push(subWorker);
  
};