global.chai = require('chai');
global.sinon = require('sinon');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const fs = require('fs');
const html = fs.readFileSync(__dirname + '/fixtures/index-test.html', 'utf-8');
const jQuery = fs.readFileSync(__dirname + '/fixtures/jquery-3.2.1.min.js', 'utf-8');
const ticTacToe = fs.readFileSync(__dirname + '/../app/assets/javascripts/tictactoe.js', 'utf-8');

global.dom = new JSDOM(html, { runScripts: 'dangerously' });
dom.window.eval(jQuery);
dom.window.eval(ticTacToe);
dom.window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();