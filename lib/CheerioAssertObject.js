
function CheerioAssertObject (action,locator,value){
    this.action = action;
    this.locator = locator;
    this.value = value;
}

CheerioAssertObject.prototype.getAction = function(){
    return this.action
}

CheerioAssertObject.prototype.setAction = function(action){
    this.action = action;
}

CheerioAssertObject.prototype.getLocator = function(){
    return this.locator
}

CheerioAssertObject.prototype.setLocator = function(locator){
    this.locator = locator;
}

CheerioAssertObject.prototype.getValue = function(){
    return this.value
}

CheerioAssertObject.prototype.setValue = function(value){
    this.value = value;
}

module.exports = CheerioAssertObject;