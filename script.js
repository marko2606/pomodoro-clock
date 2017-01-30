
var setIntervalTimer; // to startInterval for both timers
var clearIntervalTimer; // to clear interval for both timer
var selector = $('.js-setTimerWork');
function Timer(name, minutes, display) {
    this.name = name;
    this.minutes = Number(minutes.text());
    this.minutesSelector = minutes;
    this.display = display;
    this.seconds = 0;
    this.pause = false;
    this.isRunning = false; // true if running
    // put on prototype - pause the timer
    this.runPause = function() {
        // run if first time timer is activated
        if(firstClick) {
            setIntervalTimer = setInterval(this.startTimer.bind(this), 70);
        } else {
            if(this.isRunning === true) {
                if(this.pause) {
                    setIntervalTimer = setInterval(this.startTimer.bind(this), 70);
                    this.pause = false;
                    return;
                } else {
                    clearInterval(setIntervalTimer);
                    this.pause = true;
                    return;
                }
            }
        }
    };
    this.displaySeconds = function() {
        if(this.seconds < 10) {
            return '0' + this.seconds;
        } else {
            return this.seconds;
        }
    };
    // if minutes === 0 stop one timer and start another
    this.deductOneMinute = function() {
        var isFinished = false;
        // clear interval for this timer
        if(this.minutes === 0) {
            isFinished = true;
            clearIntervalTimer = clearInterval(setIntervalTimer);
            // check which timer is running and replace it with other
            if(this.name === 'work') {
                this.isRunning = false;
                breakTimer.isRunning = true;
                setIntervalTimer = setInterval(function() {breakTimer.startTimer()}, 70);
                this.minutes = Number($('.js-setTimerWork').text()); // reset minutes for next run.
            } else {
                workTimer.isRunning = true;
                breakTimer.isRunning = false;
                setIntervalTimer = setInterval(function() {workTimer.startTimer()}, 70);
                this.minutes = Number($('.js-setTimerBreak').text())
            }
        } else {
            this.minutes--;
        }
        return isFinished;
    };
    this.increaseMinutes = function() {
        // only change minutes if timer is on pause or if both timers are not running - reset seconds also
        if(workTimer.pause === true || breakTimer.pause === true || (workTimer.isRunning === false && breakTimer.isRunning === false)) {
            var a = Number(this.minutesSelector.text()) + 1;
            this.minutes = a;
            this.minutesSelector.text(a);
            this.seconds = 0;
            this.display.text(this.minutes + ':' + this.displaySeconds());
        } else {
            console.log('cant change time while timer is running!')
        }
    };
    this.decreaseMinutes = function() {
        // only change minutes if timer is on pause or if both timers are not running - reset seconds also
        if(workTimer.pause === true || breakTimer.pause === true || (workTimer.isRunning === false && breakTimer.isRunning === false)) {
            var a = Number(this.minutesSelector.text()) - 1;
            this.minutes = a;
            this.seconds = 0;
        if(this.minutes>0) {
            this.minutesSelector.text(a);
        }
    }
    this.display.text(this.minutes + ':' + this.displaySeconds());
    };
};
// creak work and break obj
var workTimer = new Timer('work',$('.js-setTimerWork'), $('.js-workTime'));
var breakTimer = new Timer('break', $('.js-setTimerBreak'), $('.js-breakTime'));

// create set Interval function for timer to start.
Timer.prototype.startTimer = function() {
    if(this.seconds === 0) {
        if(this.deductOneMinute()) {
            return;
        }
        this.seconds = 59;
        this.display.text(this.minutes + ':' + this.displaySeconds());
    }
        this.seconds--;
        this.display.text(this.minutes + ':' + this.displaySeconds());
};
// start work timer on click.
var firstClick = true;
$('.js-startTimer').click(function() {
    if(firstClick) {
        workTimer.isRunning = true;
        workTimer.runPause();
        firstClick = false;
    } else {
        workTimer.runPause();
        breakTimer.runPause();
    }
});
// reset timer fn
function resetTimer() {
        workTimer.seconds = 0;
        breakTimer.seconds = 0;
        workTimer.minutes = Number(workTimer.minutesSelector.text());
        breakTimer.minutes = Number(breakTimer.minutesSelector.text());
        workTimer.isRunning = false;
        breakTimer.isRunning = false;
        workTimer.pause = false;
        breakTimer.pause = false;
        workTimer.display.text(workTimer.minutes + ':' + workTimer.displaySeconds());
        breakTimer.display.text(breakTimer.minutes + ':' + breakTimer.displaySeconds());
        firstClick = true;
        clearInterval(setIntervalTimer);
    }
// reset timer 
$('.js-reset').click(function() {
    resetTimer();
    });


