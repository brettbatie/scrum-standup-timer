/** @jsx React.DOM */

var React = require('react'),
  hotkey = require('react-hotkey'),
  ScrumStandupTimer,
  SPACEBAR_KEY_CODE = 32,
  COUNTDOWN_IN_MS = 60 * 1000,
  INTERVAL_INCREMENT = 100,
  QUESTIONS = [
    'What did you do yesterday?',
    'What will you do today?',
    'Are there any impediments in your way?'
  ];

module.exports = ScrumStandupTimer = React.createClass({
  mixins: [hotkey.Mixin('onHotKey')],

  propTypes: {
    airhorn: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      countdown: COUNTDOWN_IN_MS,
      alertState: 0,
      questionIndex: 0
    };
  },

  componentDidMount: function(){
    hotkey.activate();
    this.resetTimer();
  },

  resetTimer: function() {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick, INTERVAL_INCREMENT);
  },

  componentWillUnmount: function(){
    clearInterval(this.timer);
  },

  airhornAlert: function() {
    if (this.props.airhorn) {
      (new window.Audio('/resources/airhorn.mp3')).play();
    }
  },

  tick: function () {
    var countdown = this.state.countdown - INTERVAL_INCREMENT,
      alertState = this.state.alertState;

    if (countdown <= 0) {
      alertState = 3;
      clearInterval(this.timer);
      this.airhornAlert();
      countdown = 0;
    } else if (countdown <= 5000) {
      alertState = 2;
    } else if (countdown <= 10500) {
      alertState = 1;
    }

    this.setState({
      countdown: countdown,
      alertState: alertState
    });
  },

  onNext: function () {
    var index = (this.state.questionIndex + 1) % 3;
    this.resetTimer();
    this.setState({
      countdown: COUNTDOWN_IN_MS,
      alertState: 0,
      questionIndex: index
    });
  },

  onHotKey: function (e) {
    if (SPACEBAR_KEY_CODE === e.keyCode) this.onNext();
  },

  render: function () {
    return (
      <div className='ScrumStandupTimer'>
        <div className='question'>
            <div>What did you do yesterday?</div><div>What will you do today?</div><div>Are you blocked?</div>
        </div>

        <div className="bottom">
          <span className={'countdown alert_' + this.state.alertState}>
            {this._countdownInSeconds()}
          </span>

          <span className='next'>
            <button className='btn' onClick={this.onNext}>
              Continue
            </button>
          </span>
        </div>
      </div>
    );
  },

  _countdownInSeconds: function () {
    var countdown = this.state.countdown / 1000,
      showDecimal = this.state.alertState > 0 && this.state.alertState < 3;
    return showDecimal ? countdown.toFixed(1) : countdown.toFixed(0);
  }
});
