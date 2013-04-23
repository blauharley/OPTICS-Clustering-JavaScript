describe("Optics", function() {

  describe("Point", function() {
    var p;

    it("should have default values after creation", function(){
      p = new Point();
      expect(p.processed).toBe(false);
      expect(p.reachability_distance).toBeUndefined();
      expect(p.attribute).toBeNull();
      expect(p.id).toBeNull();
      expect(p.color).toBeNull();
    });

  });

  describe("Queue", function() {
    var q;
    var p1, p2, p3;

    beforeEach(function() {
      q = new Queue();
      p1 = new Point();
      p2 = new Point();
      p3 = new Point();
      p1.id = 1;
      p2.id = 2;
      p3.id = 3;
      p1.reachability_distance = 1;
      p2.reachability_distance = 2;
      p3.reachability_distance = 3;
    });

    it("should be empty after creation", function() {
      expect(q.getElements().length).toEqual(0);
      expect(q.getElements()).toEqual([]);
    });

    it("should have one element afeter inserting 1", function() {
      q.insert(p1);
      expect(q.getElements().length).toEqual(1);
      expect(q.getElements()[0]).toEqual( p1 );
    });

    it("should insert point with smaller reachability_distance in the front", function() {
      q.insert(p2);
      q.insert(p1);
      expect(q.getElements().length).toEqual(2);
      expect(q.getElements()[0]).toEqual( p1 );
      expect(q.getElements()[1]).toEqual( p2 );
    });

    it("should insert point with higher reachability_distance in the back", function() {
      q.insert(p1);
      q.insert(p2);
      expect(q.getElements().length).toEqual(2);
      expect(q.getElements()[0]).toEqual( p1 );
      expect(q.getElements()[1]).toEqual( p2 );
    });

    it("should insert point with middle reachability_distance in the middle", function() {
      q.insert(p1);
      q.insert(p3);
      q.insert(p2);
      expect(q.getElements().length).toEqual(3);
      expect(q.getElements()[0]).toEqual( p1 );
      expect(q.getElements()[1]).toEqual( p2 );
      expect(q.getElements()[2]).toEqual( p3 );
    });
  }); // Queue

  describe("OPTICS", function() {
    var dataset, o;
    beforeEach(function() {
      dataset = [  { id: "eins", x: 1 }, { id: "zwei", x : 100 }]
      o = new OPTICS( dataset );
    });

    it("distance function should be working", function() {
      var result = o.dist( { x: 0, y: 0 }, { x: 3, y: 4 });
      expect(result).toEqual(5);
    });

    it("distance function should be working", function() {
      var result = o.dist( { x: 1, y: 9 }, { x: 29, y: 38 });
      expect(result).toEqual( Math.sqrt( (29-1)*(29-1) + (38-9)*(38-9) ) );
    });

    it("should find separate clusters if epsilon is too small", function() {
      // distance = 99, epsilon = 2 --> two clusters
      var result = o.start(2, 1);
      expect(result.length).toEqual(2);
      expect(result[0].reachability_distance).toBeUndefined();
      expect(result[1].reachability_distance).toBeUndefined();
    });

    it("should find separate clusters if minPoints is too large", function() {
      // only two points in dataset, minPoints = 3 --> two clusters
      var result = o.start(200, 3);
      expect(result.length).toEqual(2);
      expect(result[0].reachability_distance).toBeUndefined();
      expect(result[1].reachability_distance).toBeUndefined();
    });

    it("should find one cluster with right parameters", function() {
      // distance = 99, epsilon = 100 --> ok
      // only two points in dataset, minPoints = 1 --> ok
      var result = o.start(100, 1);
      expect(result.length).toEqual(2);
      expect(result[0].reachability_distance).toBeUndefined();
      expect(result[1].reachability_distance).toBe(99);
      expect(result[1].color).toBe(result[0].color);
    });


  }); // OPTICS
});
