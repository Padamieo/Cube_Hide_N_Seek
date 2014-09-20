var Square = function(x, y, width, height, eman) {
    var texOrigin = new Vec2(0, 0);
    var texEdge = new Vec2(1, 1);
    Entity.prototype.constructor.call(this, x, y, width, height, texOrigin, texEdge, eman);
}