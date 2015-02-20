#!/usr/bin/env node



var yarg = require('yargs')
    .usage('Usage: $0 -t [num] -c [test file path]')
    .describe('t', "number of concurrent threads executing tests")
    .describe('c', "test config")
    .demand(['c'])
    .argv
    , filePath = yarg.c
    , thread = yarg.t
    , jf = require('jsonfile')
    , util = require('util')
    , request = require('request')
    , cao = require('./lib/CheerioAssertObject')
    , cto = require('./lib/CheerioTestObject')
    ;

//parse test confid.

jf.readFile(filePath, function(err, obj) {
    if(!err) {
        loadTests(obj)
    } else{
        console.error(err);
        process.exit(1);
    }
})

//load HTML and pass it along with checks to cheerio class

function loadTests(testJson){

    var baseUrl = testJson.config.baseUrl
        , checks = testJson.checks
        , path
        , k
        , i
        , asserts
        , assertArr
        , testArr = []
        , url
        ;

    if ( checks.length < 1 ) {
        console.error("Fatal : No checks found");
        process.exit(1);
    }


    var synchForLoop = function(k) {

        if (k < checks.length ) {
            asserts = checks[k].asserts;
            assertArr = [];
            for (i = 0; i < asserts.length; i++) {
                assertArr.push(new cao(asserts[i].action, asserts[i].locator, asserts[i].value))
            }


            url = baseUrl + checks[k].path;

            console.log(url);

            request(url, function (error, response, body) {
                if (!error) {
                    testArr.push(new cto(body,assertArr))
                    k = k + 1;
                    synchForLoop(k)
                } else {
                    //console.error("Response Code :" + response.statusCode)
                    console.error("Error :" + error)
                }
            })
        } else {
            runTests(testArr);
        }
    }

    synchForLoop(0);


}





function runTests(testArr){
    var k
        ,results = []
        , synchTestLoop = function(k) {

        if (k < testArr.length ) {
            results.push(determineElementCriteriaResults(testArr[k].html,testArr[k].asserts));
            k = k + 1;
            synchTestLoop(k);

        } else {
            console.log(results);
        }
    }

    synchTestLoop(0);



}


function determineElementCriteriaResults (html, criterias) {

    //console.log(criterias);
    var results = [];
    var $ = require('cheerio').load(html);
    for (var q = 0; q < criterias.length; q++ ) {
        var result = null;
        var criteria = criterias[q];

        //if(criteria['locator'].indexOf('#') == -1) {
        var elements = $(criteria['locator'])
        var element = elements[0];
        //} else {
        //    element = $.apply(this, criteria['locator'].split('#'))[0];
        //}

        console.log("Elements Length : " + elements.length)

        if (criteria['action'] === 'isPresent') {
            result = elements.length > 0;
        } else if (criteria['action'] === 'isNotPresent') {
            result = elements.length == 0;
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
        console.log("result :" + criteria)
        results.push(criteria);
    }

    return results;
}

