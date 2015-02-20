function CherrioAsserter(){

}


CherrioAsserter.prototype.determineElementCriteriaResults = function (html, criterias) {
    var results = [];
    var $ = require('cheerio').load(html);
    for (var q = 0; q < criterias.length; q++ ) {
        var result = null;
        var criteria = criterias[q];
        var element;
        if(criteria['locator'].indexOf('#') == -1) {
            element = $(criteria['locator'])[0];
        } else {
            element = $.apply(this, criteria['locator'].split('#'))[0];
        }

        if (criteria['action'] === 'isPresent') {
            result = element !== undefined;
        } else if (criteria['action'] === 'isNotPresent') {
            result = element === undefined;
        } else if (element === undefined) {
            result = false;
        } else if (criteria['action'] == 'contains') {
            result = (element.children[0] && element.children[0].data &&
            element.children[0].data.indexOf(criteria['value']) >
            -1 );
        } else if (criteria['action'] == 'notContains') {
            result = (element.children[0] && element.children[0].data &&
            element.children[0].data.indexOf(criteria['value']) ==
            -1 );
        }
        criteria.assertWasSuccessful = result;
        results.push(criteria);
    }

    return results;
}

module.exports = CherrioAsserter