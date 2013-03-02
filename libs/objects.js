﻿
// todo: one element is failing
Array.prototype.safeInsert = function(ele){
  var has_element = false;
  for(var index=0; index < this.length; index++){
    if(this[index].id === ele.id )
      has_element = true;
  }
  if(!has_element)
    this.push(ele);
};

// a point is a unspecified data of a data-set
function Point(){
  this.processed = false;
  this.reachability_distance = undefined;
  this.attribute = null;
  this.id = null
}


// priority queue that stores points according to their attributes, first element is the most important element
function Queue(){
  
  var _queue = [];
  
  this.remove = function(ele){
    
    var length = _queue.length;
    
    for(var index=0; index < length; index++){
      
      var otherEle = _queue[index];
      
      if( ele.id === otherEle.id ){
      
        var firstQueuePart = _queue.slice(0,index);
        var secondQueuePart = _queue.slice(index+1, _queue.length);
        
        _queue = firstQueuePart.concat(secondQueuePart);
        break;
      }
    }
    
    return this;
  };
 
  this.insert = function(ele){
    var indexToInsert = _queue.length;
    for(var index= _queue.length-1; index >= 0; index--){
      
      if( ele.reachability_distance < _queue[index].reachability_distance ){
        indexToInsert = index;
      }
      
    }
    
    insertAt(ele,indexToInsert);
  };
  
  this.forEach = function(func){
    _queue.forEach(func);
  };
  
  this.getElements = function(){ return _queue;};
  
  // private methods
  
  var insertAt = function(ele, index){
     
    if(_queue.length === index){
        _queue.push(ele);
        return;
    }
    else{
      var currentElement = _queue[index];
    
      if(_queue[index] === undefined)
        return false;
        
      _queue[index] = ele;
    
      var length = _queue.length+1;
      for(var pos=index+1; pos < length; pos++){
        var lastElement = _queue[pos];
        _queue[pos] = currentElement;
        currentElement = lastElement;
      }
    }
        
  };
}


// the optics clustering algo that combines the most important methods for processing data into clusters
// dataset should lok like this: [ { id: 'identifier', a: Number, b: Number ... OR  x: Number, y: Number ... }, {...} ]
function OPTICSClustering(dataset){
  
  var unsorted_list = [];
  var sorted_list = null;
  var priority_queue = null; 
  var core_distance = 0;
  
  // public methods
  
  this.start = function(epsilon, minPts){ // actual clustering-algo
    
    init(dataset);
    
    sorted_list = [];
  
    unsorted_list.forEach(function(point,index){
      
      if( !point.processed ){
      
        var neighbors = getNeighbors(point, epsilon);
        point.processed = true;
        
        sorted_list.safeInsert(point);
        
        priority_queue = new Queue();
        
        if( calculateCoreDistance(point, epsilon, minPts) !== undefined ){
          
          updateQueue(neighbors, point, priority_queue, epsilon, minPts);
          //console.log( priority_queue.getElements() );
          
          for(var p = 0; p < priority_queue.getElements().length; p++){
            
            var queued_point = priority_queue.getElements()[p];
            var neighbors = getNeighbors(queued_point, epsilon);
            queued_point.processed = true;
            
            sorted_list.safeInsert(queued_point);
            
            //console.log('calculateCoreDistance',calculateCoreDistance(queued_point, epsilon, minPts));
            if( calculateCoreDistance(queued_point, epsilon, minPts) !== undefined ){
              updateQueue(neighbors, queued_point, priority_queue, epsilon, minPts);
            }
            
          }
        }
        
      }
      
    });
    
    return sorted_list;
    
  };
  
  // dataset should lok like this: [ { id: 'identifier', a: Number, b: Number ... OR  x: Number, y: Number ... }, {...} ]
  this.getVisualization = function(dataset, epsilon, minPts){
    
    var output = document.createElement('canvas');
    
    output.height = '1000';
    output.width = '1000';//dataset.length * 5;
    
    var ctx = output.getContext ('2d');

    ctx.fillStyle = '#C3C3C3';
    //ctx.fillRect ( 0 , 0 , output.width, output.height );
    ctx.fill();

    ctx.beginPath ();
    ctx.fillStyle = '#0000ff';
    ctx.strokeStyle = '#ffff00';
    
    ctx.font = '5pt Arial';
    ctx.lineWidth = 8;
    
    ctx.fillText( ('Epsilon: ' + epsilon), 10,10 );
    ctx.fillText( ('MinPts: ' + minPts), 10,25 );
    
    var xStartPoint = 120,
        yStartPoint = Number(output.height) - 60;
    
    dataset.forEach(function(point,index){
      
      ctx.moveTo(xStartPoint, yStartPoint);
      
      if(point.reachability_distance)
        ctx.lineTo(xStartPoint, (yStartPoint - (point.reachability_distance * 10)) );
      else
        ctx.lineTo(xStartPoint, 0);
      
      
      ctx.save();
      ctx.translate(xStartPoint, (Number(output.height) - 5));
      ctx.rotate( (Math.PI/180)*-90 );
      ctx.fillText( point.id.toString(), 0, 3 );
      ctx.restore();
      
      xStartPoint += 10;
      
    });
    
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    
    drawArrows(ctx, 115, yStartPoint, Number(output.width), Number(output.height), dataset.length, 100);
    document.body.appendChild(output);
    
  };
  
  // private methods
  
  var dist = function(pointA, pointB){ // pytharoras
    
    var multiplied_axises = [];
    for(var axis in pointA){
      if( !isNaN( Number(pointA[axis]) ) ) // axis must have got metric value
        multiplied_axises.push( ((pointA[axis] - pointB[axis]) * (pointA[axis] - pointB[axis])) );
    }
    
    var sum = 0;
    multiplied_axises.forEach(function(val,index){
      sum += val;
    });
    
    return Math.sqrt(sum);
  };
  
  var getNeighbors = function(point, epsilon){
    
    var neughbors = [];
    unsorted_list.forEach(function(otherPoint,index){
      if( point !== otherPoint && dist(point.attribute, otherPoint.attribute) < epsilon ){
        neughbors.push(otherPoint);
      }
    });
    //console.log('point', point);
    //console.log('neughbors', neughbors);
    return neughbors;
    
  };
  
  var updateQueue = function(neighbors, point, queue, epsilon, minPts){
    core_distance = calculateCoreDistance(point, epsilon, minPts);
    
    neighbors.forEach(function(otherPoint,index){
    
      if(!otherPoint.processed){
  
        var new_reachable_distance = Math.max(core_distance, dist(point.attribute, otherPoint.attribute) );
        
        if(otherPoint.reachability_distance === undefined){
          otherPoint.reachability_distance = new_reachable_distance;
          queue.insert(otherPoint);
        }
        else{
          if( new_reachable_distance < otherPoint.reachability_distance){
            otherPoint.reachability_distance = new_reachable_distance;
            queue.remove({ id: otherPoint.id });
            queue.insert(otherPoint);
          }
        }
        
      }
    });
    
  };
  
  var calculateCoreDistance = function(point, epsilon, minPts){
    var neighbors = getNeighbors(point,epsilon);
    var min_distance = undefined;
    if( neighbors.length >= minPts ){ // core-point should have got at least minPts-Points
      
      var tmp_distance = epsilon;
      neighbors.forEach(function(otherPoint,index){
        if( dist(point.attribute, otherPoint.attribute) < tmp_distance )
          tmp_distance = dist(point.attribute, otherPoint.attribute);
      });
      min_distance = tmp_distance;
      
    }
    return min_distance;
  };
  
  var drawArrows = function(ctx, start_x, start_y, x_axis_width, y_axis_height, x_units, y_units){
    
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    
    ctx.moveTo(start_x, start_y);
    ctx.lineTo( start_x + x_axis_width, start_y);
    
    var nextPosX = start_x;
    
    for(var u=0; u < x_units; u++){
      
      ctx.moveTo(nextPosX, start_y + 5);
      ctx.lineTo(nextPosX, start_y - 5 );
      ctx.fillText( u.toString(), nextPosX-2, (start_y + 10));
      
      nextPosX = start_x + ((x_axis_width / x_units) * (u + 1));
    }
    
    
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(start_x, 0);
    
    var nextPosY = start_y;
    
    for(var u=0; u < y_units; u++){
      
      ctx.moveTo(start_x - 5, nextPosY);
      ctx.lineTo(start_x + 5, nextPosY);
      ctx.fillText( u.toString(), start_x-15, nextPosY );
      
      nextPosY = start_y - ((y_axis_height / y_units) * (u + 1));
    }
    
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    
  };
  
  var init = function(dataset){
    
    if(dataset.constructor !== Array){
      console.log('dataset must be of type array: ', typeof dataset, dataset);
      return;
    }
    
    for(var p = 0; p < dataset.length; p++){
    
      var point = new Point();
      point.attribute = dataset[p];
      point.id = dataset[p].id ? dataset[p].id : 'undefined';
      
      unsorted_list.push(point);
    }
    
  };
}