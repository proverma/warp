/**
 * Created by pranavv on 2/20/15.
 */

function CheerioTestObject(html, asserts) {
    this.html = html;
    this.asserts = asserts;
}

CheerioTestObject.prototype.getHtml = function (){
    return this.html;
}

CheerioTestObject.prototype.setHtml = function (html){
    this.html = htmlß;
}

CheerioTestObject.prototype.getAsserts = function (){
    return this.asserts;
}

CheerioTestObject.prototype.setAsserts = function (asserts){
    this.asserts = asserts
}

module.exports = CheerioTestObject;