// JSDom is used to allow the tests to run right from the command line (no browsers needed)
var jsdom = require('jsdom');
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator  = window.navigator;
// Also apply a requestAnimationFrame polyfill
require('raf').polyfill()


var React = require('react');
var sinon = require('sinon');
var expect = require('chai').expect;
var TestUtils = require('react-addons-test-utils');
var ScrollUp = require('../index')

// describe makes a test group
describe('<ScrollUp/> states', function () {
  // This will be run before each test to reset the scroll position
  beforeEach(function () {
    window.pageYOffset = 0
  })

  // and each `it` function describes an individual test
  it('is hidden when first rendered', function () {
    var renderedComponent = TestUtils.renderIntoDocument(
      <ScrollUp showUnder={100}>
        <span>UP</span>
      </ScrollUp>
    );

    expect(renderedComponent.state.show).to.be.false
  });

  it('is shown if the page is scrolled past the `showUnder` point', function () {
    var renderedComponent = TestUtils.renderIntoDocument(
      <ScrollUp showUnder={100}>
        <span>UP</span>
      </ScrollUp>
    );

    // Set the scroll position to 200 and trigger the event manually
    window.pageYOffset = 200
    renderedComponent.handleScroll()

    expect(renderedComponent.state.show).to.be.true
  });

});



// describe makes a test group
describe('<ScrollUp/> move 1', function () {

  var scrollToSpy
  var renderedComponent

  before(function () {
    window.pageYOffset = 0
    renderedComponent = TestUtils.renderIntoDocument(
      <ScrollUp showUnder={100}>
        <span>UP</span>
      </ScrollUp>
    );

    // "stub" the window.scrollTo function (because we want to see how it's called)
    scrollToSpy = sinon.stub(window, 'scrollTo', function (x, y) {
      window.pageXOffset = x
      window.pageYOffset = y
      renderedComponent.handleScroll() // And make sure to trigger the handleScroll for each call
    })
  })

  after(function () {
      scrollToSpy.restore()
  })

  it('scrolls back up to the top when clicked', function (done) {
    // Ensure topPosition is set correctly
    expect(renderedComponent.props.topPosition).to.equal(0)

    // Set the scroll position to 200 and trigger the event manually
    window.pageYOffset = 200
    renderedComponent.handleScroll()

    // Now activate the click function
    renderedComponent.handleClick()

    // Give it a bit to scroll back up
    setTimeout(function () {
        expect(scrollToSpy.lastCall.args[1]).to.within(-0.1, 0.1)
        expect(renderedComponent.state.show).to.be.false
        done()
    }, 500)
  });

});



// describe makes a test group
describe('<ScrollUp/> move 2', function () {

  var scrollToSpy
  var renderedComponent

  before(function () {
    window.pageYOffset = 0
    renderedComponent = TestUtils.renderIntoDocument(
      <ScrollUp showUnder={100} topPosition={100}>
        <span>UP</span>
      </ScrollUp>
    );

    // "stub" the window.scrollTo function (because we want to see how it's called)
    scrollToSpy = sinon.stub(window, 'scrollTo', function (x, y) {
      window.pageXOffset = x
      window.pageYOffset = y
      renderedComponent.handleScroll() // And make sure to trigger the handleScroll for each call
    })
  })

  after(function () {
      scrollToSpy.restore()
  })

  it('scrolls to `topPosition` when clicked', function (done) {
    // Ensure topPosition is set correctly
    expect(renderedComponent.props.topPosition).to.equal(100)

    // Set the scroll position to 200 and trigger the event manually
    window.pageYOffset = 200
    renderedComponent.handleScroll()

    // Now activate the click function
    renderedComponent.handleClick()

    // Give it a bit to scroll back up
    setTimeout(function () {
        expect(scrollToSpy.lastCall.args[1]).to.be.within(95, 105)
        expect(renderedComponent.state.show).to.be.false
        done()
    }, 500)
  })

});
