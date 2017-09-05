function Story(_name, _points, _assignee, _platform, _phase, _epic){
    
    this.name = _name
    this.points  = _points
    this.assignee  = _assignee
    this.platform  = _platform
    this.phase  = _phase
    this.epic  = _epic
    
    this.pos = createVector(random(width), random(height));
    
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = _points*1.5;
    this.maxspeed = 5;
    this.maxforce = 1;
    this.maxfleespeed =1;
    this.maxfleeforce =0.4;

    
 
    this.c = 255;
    this.target = createVector(width/2,height/2);

}


Story.prototype.behaviors = function() {
    var arrive = this.arrive(this.target);
    //var mouse = createVector(mouseX, mouseY);
    // var flee = this.flee(mouse);

    // var neighbour = this.nooverlap()
    //var flee = this.flee(neighbour);

    this.nooverlapbasic()

    //arrive.mult(1);
    //flee.mult(-1);
  
    this.applyForce(arrive);
    //this.applyForce(flee);
  }

  Story.prototype.nooverlapbasic = function(){

    for (var i = stories.length - 1; i >= 0; i--) {
        var other = stories[i]
        var d = this.pos.dist(other.pos);

        while (d < (this.r/2+other.r/2)  && this.name != other.name) {
            d = this.pos.dist(other.pos);
            this.pos.add(random(-this.r/2,other.r/2), random(this.r/2,-other.r/2));
            other.pos.add(random(this.r/2,-other.r/2), random(-this.r/2,other.r/2));
        }
    }
  }


  Story.prototype.nooverlap = function(){
    var record = Infinity;
    var closest = null;
    for (var i = stories.length - 1; i >= 0; i--) {
        var d = this.pos.dist(stories[i].pos);

        if (d < record && d < (this.r+stories[i].r) && this.name != stories[i].name) {
          record = d;
          closest = stories[i];
        }
    }

    if (closest != null) {
        return closest.pos;
    } else {
        return createVector(0, 0)
    }
  }

  
  Story.prototype.applyForce = function(f) {
    this.acc.add(f);
  }
  
  Story.prototype.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }
  
  Story.prototype.show = function() {
    colorMode(HSB);
    stroke(this.c,50,100,0.5);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  }
  
  
  Story.prototype.arrive = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxspeed;
    // if (d < 100) {
    //   speed = map(d, 0, 100, 0, this.maxspeed);
    // }
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    if (d > 75){
        return steer;
    } else {
        this.vel.mult(0);
        return createVector(0,0);
    }
  }
  
  Story.prototype.flee = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxfleespeed;
    if (d < 50) {
        speed = map(d,50,0, 0, this.maxfleespeed);
        //desired.setMag(this.maxspeed);
        desired.setMag(speed);
        desired.mult(-1);
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxfleeforce);
        return steer;
    } else {
        return createVector(0, 0);
    }
  }

  Story.prototype.intersects = function(other){
      var d = dist(this.pos.x, this.pos.y, other.pos.x. other.pos.y);
      if (d < this.r + other.r){
          return true;
      } else {
          return false;
      }
  }