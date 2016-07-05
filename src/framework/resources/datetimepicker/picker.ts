import $ = require('jquery');
import moment = require('moment');
import "./bootstrap-datetimepicker.css";

export class DateTimePickerOptions {
    public datepickerInput:string;
    public keepOpen = false;
    public inline:boolean;
    public timeZone = 'Etc/UTC';
    public useStrict;
    public format = 'YYYY-MM-DD HH:mm:ss';
    public extraFormats;
    public defaultDate: boolean | moment.Moment = false;
    public locale = "en";
    public widgetParent =  null;
    public stepping:number = 1;
    public keepInvalid:boolean;
    public disabledDates:any = false;
    public minDate: moment.Moment | number | Date | string | boolean = false;
    public maxDate: moment.Moment | number | Date | string | boolean = false;
    public useCurrent:string;
    public collapse = true;
    public enabledDates:any = false;
    public daysOfWeekDisabled: any = [];
    public disabledTimeIntervals = false;
    public disabledHours:any = false;
    public enabledHours:any = false;
    public parseInputDate: Function;
    public calendarWeeks = false;
    public viewMode = 'days';
    public widgetPositioning = {  horizontal: 'auto',  vertical: 'auto' };
    public ignoreReadonly = false;
    public focusOnShow = true;
    public debug = false;
    public toolbarPlacement =  'default';
    public dayViewHeaderFormat = 'MMMM YYYY';
    public showTodayButton = true;
    public showClear = false;
    public sideBySide = false;
    public showClose = false;
    public allowInputToggle = false;
    public icons = {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next: 'glyphicon glyphicon-chevron-right',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash',
            close: 'glyphicon glyphicon-remove'
    };
    
    public tooltips = {
        today: 'Go to today',
        clear: 'Clear selection',
        close: 'Close the picker',
        selectMonth: 'Select Month',
        prevMonth: 'Previous Month',
        nextMonth: 'Next Month',
        selectYear: 'Select Year',
        prevYear: 'Previous Year',
        nextYear: 'Next Year',
        selectDecade: 'Select Decade',
        prevDecade: 'Previous Decade',
        nextDecade: 'Next Decade',
        prevCentury: 'Previous Century',
        nextCentury: 'Next Century',
        pickHour: 'Pick Hour',
        incrementHour: 'Increment Hour',
        decrementHour: 'Decrement Hour',
        pickMinute: 'Pick Minute',
        incrementMinute: 'Increment Minute',
        decrementMinute: 'Decrement Minute',
        pickSecond: 'Pick Second',
        incrementSecond: 'Increment Second',
        decrementSecond: 'Decrement Second',
        togglePeriod: 'Toggle Period',
        selectTime: 'Select Time'
    };
    
    public keyBinds = {
        up: function (picker:DateTimePicker) {
            if (!picker.widget) {
                return;
            }
            var d  = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().subtract(7, 'd'));
            } else {
                picker.date(d.clone().add(<number>picker.stepping(), 'm'));
            }
        },
        down: function (picker:DateTimePicker) {
            if (!picker.widget) {
                picker.show();
                return;
            }
            var d = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().add(7, 'd'));
            } else {
                picker.date(d.clone().subtract(<number>picker.stepping(), 'm'));
            }
        },
        'control up': function (picker:DateTimePicker) {
            if (!picker.widget) {
                return;
            }
            var d = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().subtract(1, 'y'));
            } else {
                picker.date(d.clone().add(1, 'h'));
            }
        },
        'control down': function (picker:DateTimePicker) {
            if (!picker.widget) {
                return;
            }
            var d = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().add(1, 'y'));
            } else {
                picker.date(d.clone().subtract(1, 'h'));
            }
        },
        left: function (picker:DateTimePicker) {
            if (!picker.widget) {
                return;
            }
            var d = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().subtract(1, 'd'));
            }
        },
        right: function (picker:DateTimePicker) {
            if (!picker.widget) {
                return;
            }
            var d = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().add(1, 'd'));
            }
        },
        pageUp: function (picker:DateTimePicker) {
            if (!picker.widget) {
                return;
            }
            var d = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().subtract(1, 'M'));
            }
        },
        pageDown: function (picker:DateTimePicker) {
            if (!picker.widget) {
                return;
            }
            var d = <moment.Moment> (picker.date() || picker.getMoment());
            if (picker.widget.find('.datepicker').is(':visible')) {
                picker.date(d.clone().add(1, 'M'));
            }
        },
        enter: function (picker:DateTimePicker) {
            picker.hide();
        },
        escape: function (picker:DateTimePicker) {
            picker.hide();
        },
        'control space': function (picker:DateTimePicker) {
            if (picker.widget.find('.timepicker').is(':visible')) {
                picker.widget.find('.btn[data-action="togglePeriod"]').click();
            }
        },
        t: function (picker:DateTimePicker) {
            picker.date(this.getMoment());
        },
        'delete': function (picker:DateTimePicker) {
            picker.clear();
        }
    };

}

export class DateTimePicker {
    private _options:DateTimePickerOptions = new DateTimePickerOptions();
    private unset = true;
    private actualFormat = ""
    public input:JQuery;
    public component:JQuery;
    public _date:moment.Moment;
    public viewModes  = ['days', 'months', 'years', 'decades'];
    public verticalModes = ['top', 'bottom', 'auto'];
    public horizontalModes = ['left', 'right', 'auto'];
    public toolbarPlacements = ['default', 'top', 'bottom'];
    public viewDate:moment.Moment;
    public parseFormats: any[];
    public use24Hours:boolean = false;
    public minViewModeNumber:number = 0;
    public currentViewMode:number = 0;
    public widget:JQuery;
    private keyState = {};
    private keyMap = {
        'up': 38,   38: 'up',
        'down': 40, 40: 'down',
        'left': 37, 37: 'left',
        'right': 39, 39: 'right',
        'tab': 9, 9: 'tab',
        'escape': 27, 27: 'escape',
        'enter': 13, 13: 'enter',
        'pageUp': 33, 33: 'pageUp',
        'pageDown': 34, 34: 'pageDown',
        'shift': 16, 16: 'shift',
        'control': 17, 17: 'control',
        'space': 32, 32: 'space',
        't': 84, 84: 't',
        'delete': 46, 46: 'delete'
    };
    
    private datePickerModes = [
        { clsName: 'days', navFnc: 'M', navStep: 1  },
        { clsName: 'months', navFnc: 'y',  navStep: 1 },
        { clsName: 'years', navFnc: 'y', navStep: 10 },
        { clsName: 'decades', navFnc: 'y', navStep: 100 }
    ];
    
    constructor(private element: JQuery, options:DateTimePickerOptions) {
        if (element.is('input')) {
            this.input = element;
        } else {
            this.input = element.find(options.datepickerInput);
            if (this.input.length === 0) {
                this.input = element.find('input');
            } else if (!this.input.is('input')) {
                throw new Error('CSS class "' + options.datepickerInput + '" cannot be applied to non input element');
            }
        }

        if (element.hasClass('input-group')) {
            // in case there is more then one 'input-group-addon' Issue #48
            if (element.find('.datepickerbutton').length === 0) {
                this.component = element.find('.input-group-addon');
            } else {
                this.component = element.find('.datepickerbutton');
            }
        }
        
        if (!options.inline && !this.input.is('input')) {
            throw new Error('Could not initialize DateTimePicker without an input element');
        }

        // Set defaults for date here now instead of in var declaration
        this._date = this.getMoment();
        this.viewDate = this._date.clone();

        $.extend(true, options, this.dataToOptions());

        this.options(options);

        this.initFormatting();

        this.attachDatePickerElementEvents();

        if (this.input.prop('disabled')) {
            this.disable();
        }
        if (this.input.is('input') && this.input.val().trim().length !== 0) {
            this.setValue(this.parseInputDate(this.input.val().trim()));
        }
        else if (this._options.defaultDate && this.input.attr('placeholder') === undefined) {
            this.setValue(<moment.Moment>this._options.defaultDate);
        }
        if (options.inline) {
            this.show();
        }

    }

    public viewMode(viewMode?:string) :string|this {
        if (viewMode == undefined) {
            return this._options.viewMode;
        }

        if (typeof viewMode !== 'string') {
            throw new TypeError('viewMode() expects a string parameter');
        }

        if (this.viewModes.indexOf(viewMode) === -1) {
            throw new TypeError('viewMode() parameter must be one of (' + this.viewModes.join(', ') + ') value');
        }

        this._options.viewMode = viewMode;
        this.currentViewMode = Math.max(this.viewModes.indexOf(viewMode), this.minViewModeNumber);

        this.showMode();
        return this;
    }

    public clear () {
        this.setValue(null);
        return this;
    }

    actions = {
        next: function () {
            var navFnc = this.datePickerModes[this.currentViewMode].navFnc;
            this.viewDate.add(this.datePickerModes[this.currentViewMode].navStep, navFnc);
            this.fillDate();
            this.viewUpdate(navFnc);
        },

        previous: function () {
            var navFnc = this.datePickerModes[this.currentViewMode].navFnc;
            this.viewDate.subtract(this.datePickerModes[this.currentViewMode].navStep, navFnc);
            this.fillDate();
            this.viewUpdate(navFnc);
        },

        pickerSwitch: function () {
            this.showMode(1);
        },

        selectMonth: function (e) {
            var month = $(e.target).closest('tbody').find('span').index($(e.target));
            this.viewDate.month(month);
            if (this.currentViewMode === this.minViewModeNumber) {
                this.setValue(this._date.clone().year(this.viewDate.year()).month(this.viewDate.month()));
                if (!this._options.inline) {
                    this.hide();
                }
            } else {
                this.showMode(-1);
                this.fillDate();
            }
            this.viewUpdate('M');
        },

        selectYear: function (e) {
            var year = parseInt($(e.target).text(), 10) || 0;
            this.viewDate.year(year);
            if (this.currentViewMode === this.minViewModeNumber) {
                this.setValue(this._date.clone().year(this.viewDate.year()));
                if (!this._options.inline) {
                    this.hide();
                }
            } else {
                this.showMode(-1);
                this.fillDate();
            }
            this.viewUpdate('YYYY');
        },

        selectDecade: function (e) {
            var year = parseInt($(e.target).data('selection'), 10) || 0;
            this.viewDate.year(year);
            if (this.currentViewMode === this.minViewModeNumber) {
                this.setValue(this._date.clone().year(this.viewDate.year()));
                if (!this._options.inline) {
                    this.hide();
                }
            } else {
                this.showMode(-1);
                this.fillDate();
            }
            this.viewUpdate('YYYY');
        },

        selectDay: function (e) {
            var day = this.viewDate.clone();
            if ($(e.target).is('.old')) {
                day.subtract(1, 'M');
            }
            if ($(e.target).is('.new')) {
                day.add(1, 'M');
            }
            this.setValue(day.date(parseInt($(e.target).text(), 10)));
            if (!this.hasTime() && !this._options.keepOpen && !this._options.inline) {
                this.hide();
            }
        },

        incrementHours: function () {
            var newDate = this._date.clone().add(1, 'h');
            if (this.isValid(newDate, 'h')) {
                this.setValue(newDate);
            }
        },

        incrementMinutes: function () {
            var newDate = this._date.clone().add(this._options.stepping, 'm');
            if (this.isValid(newDate, 'm')) {
                this.setValue(newDate);
            }
        },

        incrementSeconds: function () {
            var newDate = this._date.clone().add(1, 's');
            if (this.isValid(newDate, 's')) {
                this.setValue(newDate);
            }
        },

        decrementHours: function () {
            var newDate = this._date.clone().subtract(1, 'h');
            if (this.isValid(newDate, 'h')) {
                this.setValue(newDate);
            }
        },

        decrementMinutes: function () {
            var newDate = this._date.clone().subtract(this._options.stepping, 'm');
            if (this.isValid(newDate, 'm')) {
                this.setValue(newDate);
            }
        },

        decrementSeconds: function () {
            var newDate = this._date.clone().subtract(1, 's');
            if (this.isValid(newDate, 's')) {
                this.setValue(newDate);
            }
        },

        togglePeriod: function () {
            this.setValue(this._date.clone().add((this._date.hours() >= 12) ? -12 : 12, 'h'));
        },

        togglePicker: function (e) {
            var $this = $(e.target),
                $parent = $this.closest('ul'),
                expanded = $parent.find('.in'),
                closed = $parent.find('.collapse:not(.in)');

            if (expanded && expanded.length) {
                let collapseData = expanded.data('collapse');
                if (collapseData && collapseData.transitioning) {
                    return;
                }
                if (expanded.collapse) { // if collapse plugin is available through bootstrap.js then use it
                    expanded.collapse('hide');
                    closed.collapse('show');
                } else { // otherwise just toggle in class on the two views
                    expanded.removeClass('in');
                    closed.addClass('in');
                }
                if ($this.is('span')) {
                    $this.toggleClass(this._options.icons.time + ' ' + this._options.icons.date);
                } else {
                    $this.find('span').toggleClass(this._options.icons.time + ' ' + this._options.icons.date);
                }
            }
        },

        showPicker: function () {
            this.widget.find('.timepicker > div:not(.timepicker-picker)').hide();
            this.widget.find('.timepicker .timepicker-picker').show();
        },

        showHours: function () {
            this.widget.find('.timepicker .timepicker-picker').hide();
            this.widget.find('.timepicker .timepicker-hours').show();
        },

        showMinutes: function () {
            this.widget.find('.timepicker .timepicker-picker').hide();
            this.widget.find('.timepicker .timepicker-minutes').show();
        },

        showSeconds: function () {
            this.widget.find('.timepicker .timepicker-picker').hide();
            this.widget.find('.timepicker .timepicker-seconds').show();
        },

        selectHour: function (e) {
            var hour = parseInt($(e.target).text(), 10);

            if (!this.use24Hours) {
                if (this._date.hours() >= 12) {
                    if (hour !== 12) {
                        hour += 12;
                    }
                } else {
                    if (hour === 12) {
                        hour = 0;
                    }
                }
            }
            this.setValue(this._date.clone().hours(hour));
            this.actions.showPicker.call(this);
        },

        selectMinute: function (e) {
            this.setValue(this.date.clone().minutes(parseInt($(e.target).text(), 10)));
            this.actions.showPicker.call(this);
        },

        selectSecond: function (e) {
            this.setValue(this._date.clone().seconds(parseInt($(e.target).text(), 10)));
            this.actions.showPicker.call(this);
        },

        clear: this.clear,

        today: function () {
            var todaysDate = this.getMoment();
            if (this.isValid(todaysDate, 'd')) {
                this.setValue(todaysDate);
            }
        },

        close: this.hide
    }

    private boundPlace : Function;

    public show() {
        let useCurrentGranularity = {
                'year': (m) => {
                    return m.month(0).date(1).hours(0).seconds(0).minutes(0);
                },
                'month': (m) =>  {
                    return m.date(1).hours(0).seconds(0).minutes(0);
                },
                'day': (m) =>  {
                    return m.hours(0).seconds(0).minutes(0);
                },
                'hour': (m) =>  {
                    return m.seconds(0).minutes(0);
                },
                'minute': (m) =>  {
                    return m.seconds(0);
                }
            };

        if (this.input.prop('disabled') || (!this._options.ignoreReadonly && this.input.prop('readonly')) || this.widget) {
            return this;
        }
        
        if (this.input.val() !== undefined && this.input.val().trim().length !== 0) {
            this.setValue(this.parseInputDate(this.input.val().trim()));
        } else if (this._options.useCurrent && this.unset && ((this.input.is('input') && this.input.val().trim().length === 0) || this._options.inline)) {
            let currentMoment = this.getMoment();
            if (typeof this._options.useCurrent === 'string') {
                currentMoment = useCurrentGranularity[this._options.useCurrent](currentMoment);
            }
            this.setValue(currentMoment);
        }

        this.widget = this.getTemplate();

        this.fillDow();
        this.fillMonths();

        this.widget.find('.timepicker-hours').hide();
        this.widget.find('.timepicker-minutes').hide();
        this.widget.find('.timepicker-seconds').hide();

        this.update();
        this.showMode();
        this.boundPlace = () => this.place();
        $(window).on(<any>'resize', this.boundPlace);
        this.widget.on(<any>'click', '[data-action]', 
            (e:MouseEvent) => {this.doAction(e)
        });
        
        this.widget.on(<any>'mousedown', false);
         // this handles clicks on the widget
        // this.widget.on('mousedown', false);

        if (this.component && this.component.hasClass('btn')) {
            this.component.toggleClass('active');
        }
        this.widget.show();
        this.place();

        if (this._options.focusOnShow && !this.input.is(':focus')) {
            this.input.focus();
        }

        this.notifyEvent({
            type: 'dp.show'
        });
        
        return this;
    }
    
    private doAction(e?:MouseEvent) {
        if ($(e.currentTarget).is('.disabled')) {
            return false;
        }
        
        this.actions[$(e.currentTarget).data('action')].apply(this, arguments);
        e.preventDefault();
        return false;
    }
     
    private  showMode(dir?) {
        if (!this.widget) {
            return;
        }
        if (dir) {
            this.currentViewMode = Math.max(this.minViewModeNumber, Math.min(3, this.currentViewMode + dir));
        }
        
        this.widget.find('.datepicker > div').hide().filter('.datepicker-' + this.datePickerModes[this.currentViewMode].clsName).show();
    }
    
    private fillDow() {
        var row = $('<tr>'),
            currentDate = this.viewDate.clone().startOf('w').startOf('d');

        if (this._options.calendarWeeks === true) {
            row.append($('<th>').addClass('cw').text('#'));
        }

        while (currentDate.isBefore(this.viewDate.clone().endOf('w'))) {
            row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
            currentDate.add(1, 'd');
        }
        
        this.widget.find('.datepicker-days thead').append(row);
    }

    private getTimePickerMainTemplate() {
        var topRow = $('<tr>'),
            middleRow = $('<tr>'),
            bottomRow = $('<tr>');

        if (this.isEnabled('h')) {
            topRow.append($('<td>')
                .append($('<a>').attr({href: '#', tabindex: '-1', 'title': this._options.tooltips.incrementHour}).addClass('btn').attr('data-action', 'incrementHours')
                    .append($('<span>').addClass(this._options.icons.up))));
            middleRow.append($('<td>')
                .append($('<span>').addClass('timepicker-hour').attr({'data-time-component':'hours', 'title': this._options.tooltips.pickHour}).attr('data-action', 'showHours')));
            bottomRow.append($('<td>')
                .append($('<a>').attr({href: '#', tabindex: '-1', 'title': this._options.tooltips.decrementHour}).addClass('btn').attr('data-action', 'decrementHours')
                    .append($('<span>').addClass(this._options.icons.down))));
        }
        if (this.isEnabled('m')) {
            if (this.isEnabled('h')) {
                topRow.append($('<td>').addClass('separator'));
                middleRow.append($('<td>').addClass('separator').html(':'));
                bottomRow.append($('<td>').addClass('separator'));
            }
            topRow.append($('<td>')
                .append($('<a>').attr({href: '#', tabindex: '-1', 'title': this._options.tooltips.incrementMinute}).addClass('btn').attr('data-action', 'incrementMinutes')
                    .append($('<span>').addClass(this._options.icons.up))));
            middleRow.append($('<td>')
                .append($('<span>').addClass('timepicker-minute').attr({'data-time-component': 'minutes', 'title': this._options.tooltips.pickMinute}).attr('data-action', 'showMinutes')));
            bottomRow.append($('<td>')
                .append($('<a>').attr({href: '#', tabindex: '-1', 'title': this._options.tooltips.decrementMinute}).addClass('btn').attr('data-action', 'decrementMinutes')
                    .append($('<span>').addClass(this._options.icons.down))));
        }
        if (this.isEnabled('s')) {
            if (this.isEnabled('m')) {
                topRow.append($('<td>').addClass('separator'));
                middleRow.append($('<td>').addClass('separator').html(':'));
                bottomRow.append($('<td>').addClass('separator'));
            }
            topRow.append($('<td>')
                .append($('<a>').attr({href: '#', tabindex: '-1', 'title': this._options.tooltips.incrementSecond}).addClass('btn').attr('data-action', 'incrementSeconds')
                    .append($('<span>').addClass(this._options.icons.up))));
            middleRow.append($('<td>')
                .append($('<span>').addClass('timepicker-second').attr({'data-time-component': 'seconds', 'title': this._options.tooltips.pickSecond}).attr('data-action', 'showSeconds')));
            bottomRow.append($('<td>')
                .append($('<a>').attr({href: '#', tabindex: '-1', 'title': this._options.tooltips.decrementSecond}).addClass('btn').attr('data-action', 'decrementSeconds')
                    .append($('<span>').addClass(this._options.icons.down))));
        }

        if (!this.use24Hours) {
            topRow.append($('<td>').addClass('separator'));
            middleRow.append($('<td>')
                .append($('<button>').addClass('btn btn-primary').attr({'data-action': 'togglePeriod', tabindex: '-1', 'title': this._options.tooltips.togglePeriod})));
            bottomRow.append($('<td>').addClass('separator'));
        }

        return $('<div>').addClass('timepicker-picker')
            .append($('<table>').addClass('table-condensed')
                .append([topRow, middleRow, bottomRow]));
    }

    private getTimePickerTemplate() {
        var hoursView = $('<div>').addClass('timepicker-hours')
                .append($('<table>').addClass('table-condensed')),
            minutesView = $('<div>').addClass('timepicker-minutes')
                .append($('<table>').addClass('table-condensed')),
            secondsView = $('<div>').addClass('timepicker-seconds')
                .append($('<table>').addClass('table-condensed')),
            ret = [this.getTimePickerMainTemplate()];

        if (this.isEnabled('h')) {
            ret.push(hoursView);
        }
        if (this.isEnabled('m')) {
            ret.push(minutesView);
        }
        if (this.isEnabled('s')) {
            ret.push(secondsView);
        }

        return ret;
    }

    private getToolbar() {
        var row = [];
        if (this._options.showTodayButton) {
            row.push($('<td>').append($('<a>').attr({'data-action':'today', 'title': this._options.tooltips.today}).append($('<span>').addClass(this._options.icons.today))));
        }
        if (!this._options.sideBySide && this.hasDate() && this.hasTime()) {
            row.push($('<td>').append($('<a>').attr({'data-action':'togglePicker', 'title': this._options.tooltips.selectTime}).append($('<span>').addClass(this._options.icons.time))));
        }
        if (this._options.showClear) {
            row.push($('<td>').append($('<a>').attr({'data-action':'clear', 'title': this._options.tooltips.clear}).append($('<span>').addClass(this._options.icons.clear))));
        }
        if (this._options.showClose) {
            row.push($('<td>').append($('<a>').attr({'data-action':'close', 'title': this._options.tooltips.close}).append($('<span>').addClass(this._options.icons.close))));
        }
        return $('<table>').addClass('table-condensed').append($('<tbody>').append($('<tr>').append(row)));
    }
    
    private getDatePickerTemplate() {
        var headTemplate = $('<thead>')
                .append($('<tr>')
                    .append($('<th>').addClass('prev').attr('data-action', 'previous')
                        .append($('<span>').addClass(this._options.icons.previous))
                        )
                    .append($('<th>').addClass('picker-switch').attr('data-action', 'pickerSwitch').attr('colspan', (this._options.calendarWeeks ? '6' : '5')))
                    .append($('<th>').addClass('next').attr('data-action', 'next')
                        .append($('<span>').addClass(this._options.icons.next))
                        )
                    ),
            contTemplate = $('<tbody>')
                .append($('<tr>')
                    .append($('<td>').attr('colspan', (this._options.calendarWeeks ? '8' : '7')))
                    );

        return [
            $('<div>').addClass('datepicker-days')
                .append($('<table>').addClass('table-condensed')
                    .append(headTemplate)
                    .append($('<tbody>'))
                    ),
            $('<div>').addClass('datepicker-months')
                .append($('<table>').addClass('table-condensed')
                    .append(headTemplate.clone())
                    .append(contTemplate.clone())
                    ),
            $('<div>').addClass('datepicker-years')
                .append($('<table>').addClass('table-condensed')
                    .append(headTemplate.clone())
                    .append(contTemplate.clone())
                    ),
            $('<div>').addClass('datepicker-decades')
                .append($('<table>').addClass('table-condensed')
                    .append(headTemplate.clone())
                    .append(contTemplate.clone())
                    )
        ];
    }
    
    public hasTime () {
        return (this.isEnabled('h') || this.isEnabled('m') || this.isEnabled('s'));
    }

    public hasDate() {
        return (this.isEnabled('y') || this.isEnabled('M') || this.isEnabled('d'));
    }
    
    private fillMinutes() {
        var table = this.widget.find('.timepicker-minutes table'),
            currentMinute = this.viewDate.clone().startOf('h'),
            html = [],
            row = $('<tr>'),
            step = this._options.stepping === 1 ? 5 : this._options.stepping;

        while (this.viewDate.isSame(currentMinute, 'h')) {
            if (currentMinute.minute() % (step * 4) === 0) {
                row = $('<tr>');
                html.push(row);
            }
            row.append('<td data-action="selectMinute" class="minute' + (!this.isValid(currentMinute, 'm') ? ' disabled' : '') + '">' + currentMinute.format('mm') + '</td>');
            currentMinute.add(step, 'm');
        }
        table.empty().append(html);
    }

    private fillSeconds () {
        var table = this.widget.find('.timepicker-seconds table'),
            currentSecond = this.viewDate.clone().startOf('m'),
            html = [],
            row = $('<tr>');

        while (this.viewDate.isSame(currentSecond, 'm')) {
            if (currentSecond.second() % 20 === 0) {
                row = $('<tr>');
                html.push(row);
            }
            row.append('<td data-action="selectSecond" class="second' + (!this.isValid(currentSecond, 's') ? ' disabled' : '') + '">' + currentSecond.format('ss') + '</td>');
            currentSecond.add(5, 's');
        }

        table.empty().append(html);
    }
    
    private fillTime () {
        var toggle, newDate, timeComponents = this.widget.find('.timepicker span[data-time-component]');

        if (!this.use24Hours) {
            toggle = this.widget.find('.timepicker [data-action=togglePeriod]');
            newDate = this._date.clone().add((this._date.hours() >= 12) ? -12 : 12, 'h');

            toggle.text(this._date.format('A'));

            if (this.isValid(newDate, 'h')) {
                toggle.removeClass('disabled');
            } else {
                toggle.addClass('disabled');
            }
        }
        
        timeComponents.filter('[data-time-component=hours]').text(this._date.format(this.use24Hours ? 'HH' : 'hh'));
        timeComponents.filter('[data-time-component=minutes]').text(this._date.format('mm'));
        timeComponents.filter('[data-time-component=seconds]').text(this._date.format('ss'));

        this.fillHours();
        this.fillMinutes();
        this.fillSeconds();
    }

    private getTemplate() {
        var template = $('<div>').addClass('bootstrap-datetimepicker-widget dropdown-menu'),
            dateView = $('<div>').addClass('datepicker').append(this.getDatePickerTemplate()),
            timeView = $('<div>').addClass('timepicker').append(this.getTimePickerTemplate()),
            content = $('<ul>').addClass('list-unstyled'),
            toolbar = $('<li>').addClass('picker-switch' + (this._options.collapse ? ' accordion-toggle' : '')).append(this.getToolbar());

        if (this._options.inline) {
            template.removeClass('dropdown-menu');
        }

        if (this.use24Hours) {
            template.addClass('usetwentyfour');
        }
        if (this.isEnabled('s') && !this.use24Hours) {
            template.addClass('wider');
        }

        if (this._options.sideBySide && this.hasDate() && this.hasTime()) {
            template.addClass('timepicker-sbs');
            if (this._options.toolbarPlacement === 'top') {
                template.append(toolbar);
            }
            template.append(
                $('<div>').addClass('row')
                    .append(dateView.addClass('col-md-6'))
                    .append(timeView.addClass('col-md-6'))
            );
            if (this._options.toolbarPlacement === 'bottom') {
                template.append(toolbar);
            }
            return template;
        }

        if (this._options.toolbarPlacement === 'top') {
            content.append(toolbar);
        }
        if (this.hasDate()) {
            content.append($('<li>').addClass((this._options.collapse && this.hasTime() ? 'collapse in' : '')).append(dateView));
        }
        if (this._options.toolbarPlacement === 'default') {
            content.append(toolbar);
        }
        if (this.hasTime()) {
            content.append($('<li>').addClass((this._options.collapse && this.hasDate() ? 'collapse' : '')).append(timeView));
        }
        if (this._options.toolbarPlacement === 'bottom') {
            content.append(toolbar);
        }
        return template.append(content);
    }
    
    private fillMonths () {
        var spans = [], monthsShort = this.viewDate.clone().startOf('y').startOf('d');
        
        while (monthsShort.isSame(this.viewDate, 'y')) {
            spans.push($('<span>').attr('data-action', 'selectMonth').addClass('month').text(monthsShort.format('MMM')));
            monthsShort.add(1, 'M');
        }
        
        this.widget.find('.datepicker-months td').empty().append(spans);
    }

    private updateMonths () {
        var monthsView = this.widget.find('.datepicker-months'),
            monthsViewHeader = monthsView.find('th'),
            months = monthsView.find('tbody').find('span');

        monthsViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevYear);
        monthsViewHeader.eq(1).attr('title', this._options.tooltips.selectYear);
        monthsViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextYear);

        monthsView.find('.disabled').removeClass('disabled');

        if (!this.isValid(this.viewDate.clone().subtract(1, 'y'), 'y')) {
            monthsViewHeader.eq(0).addClass('disabled');
        }

        monthsViewHeader.eq(1).text(this.viewDate.year());

        if (!this.isValid(this.viewDate.clone().add(1, 'y'), 'y')) {
            monthsViewHeader.eq(2).addClass('disabled');
        }

        months.removeClass('active');
        if (this._date.isSame(this.viewDate, 'y') && !this.unset) {
            months.eq(this._date.month()).addClass('active');
        }

        months.each((index) => {
            if (!this.isValid(this.viewDate.clone().month(index), 'M')) {
                $(this).addClass('disabled');
            }
        });
    }

    private updateYears() {
        var yearsView = this.widget.find('.datepicker-years'),
            yearsViewHeader = yearsView.find('th'),
            startYear = this.viewDate.clone().subtract(5, 'y'),
            endYear = this.viewDate.clone().add(6, 'y'),
            html = '';

        yearsViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevDecade);
        yearsViewHeader.eq(1).attr('title', this._options.tooltips.selectDecade);
        yearsViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextDecade);

        yearsView.find('.disabled').removeClass('disabled');

        if (this._options.minDate && (<moment.Moment>this._options.minDate).isAfter(startYear, 'y')) {
            yearsViewHeader.eq(0).addClass('disabled');
        }

        yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());

        if (this._options.maxDate && (<moment.Moment>this._options.maxDate).isBefore(endYear, 'y')) {
            yearsViewHeader.eq(2).addClass('disabled');
        }

        while (!startYear.isAfter(endYear, 'y')) {
            html += '<span data-action="selectYear" class="year' + (startYear.isSame(this._date, 'y') && !this.unset ? ' active' : '') + (!this.isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
            startYear.add(1, 'y');
        }

        yearsView.find('td').html(html);
    }

    private updateDecades() {
        var decadesView = this.widget.find('.datepicker-decades'),
            decadesViewHeader = decadesView.find('th'),
            startDecade = moment({y: this.viewDate.year() - (this.viewDate.year() % 100) - 1}),
            endDecade = startDecade.clone().add(100, 'y'),
            startedAt = startDecade.clone(),
            html = '';

        decadesViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevCentury);
        decadesViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextCentury);

        decadesView.find('.disabled').removeClass('disabled');

        if (startDecade.isSame(moment({y: 1900})) || (this._options.minDate && (<moment.Moment>this._options.minDate).isAfter(startDecade, 'y'))) {
            decadesViewHeader.eq(0).addClass('disabled');
        }

        decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());

        if (startDecade.isSame(moment({y: 2000})) || (this._options.maxDate && (<moment.Moment>this._options.maxDate).isBefore(endDecade, 'y'))) {
            decadesViewHeader.eq(2).addClass('disabled');
        }

        while (!startDecade.isAfter(endDecade, 'y')) {
            html += '<span data-action="selectDecade" class="decade' + (startDecade.isSame(this._date, 'y') ? ' active' : '') +
                (!this.isValid(startDecade, 'y') ? ' disabled' : '') + '" data-selection="' + (startDecade.year() + 6) + '">' + (startDecade.year() + 1) + ' - ' + (startDecade.year() + 12) + '</span>';
            startDecade.add(12, 'y');
        }
        html += '<span></span><span></span><span></span>'; //push the dangling block over, at least this way it's even

        decadesView.find('td').html(html);
        decadesViewHeader.eq(1).text((startedAt.year() + 1) + '-' + (startDecade.year()));
    }
    
    private fillDate() {
        var daysView = this.widget.find('.datepicker-days'),
            daysViewHeader = daysView.find('th'),
            currentDate,
            html = [],
            row,
            clsName,
            i;

        if (!this.hasDate()) {
            return;
        }

        daysViewHeader.eq(0).find('span').attr('title', this._options.tooltips.prevMonth);
        daysViewHeader.eq(1).attr('title', this._options.tooltips.selectMonth);
        daysViewHeader.eq(2).find('span').attr('title', this._options.tooltips.nextMonth);

        daysView.find('.disabled').removeClass('disabled');
        daysViewHeader.eq(1).text(this.viewDate.format(this._options.dayViewHeaderFormat));

        if (!this.isValid(this.viewDate.clone().subtract(1, 'M'), 'M')) {
            daysViewHeader.eq(0).addClass('disabled');
        }
        if (!this.isValid(this.viewDate.clone().add(1, 'M'), 'M')) {
            daysViewHeader.eq(2).addClass('disabled');
        }

        currentDate = this.viewDate.clone().startOf('M').startOf('w').startOf('d');

        for (i = 0; i < 42; i++) { //always display 42 days (should show 6 weeks)
            if (currentDate.weekday() === 0) {
                row = $('<tr>');
                if (this._options.calendarWeeks) {
                    row.append('<td class="cw">' + currentDate.week() + '</td>');
                }
                html.push(row);
            }
            clsName = '';
            if (currentDate.isBefore(this.viewDate, 'M')) {
                clsName += ' old';
            }
            if (currentDate.isAfter(this.viewDate, 'M')) {
                clsName += ' new';
            }
            if (currentDate.isSame(this._date, 'd') && !this.unset) {
                clsName += ' active';
            }
            if (!this.isValid(currentDate, 'd')) {
                clsName += ' disabled';
            }
            if (currentDate.isSame(this.getMoment(), 'd')) {
                clsName += ' today';
            }
            if (currentDate.day() === 0 || currentDate.day() === 6) {
                clsName += ' weekend';
            }
            row.append('<td data-action="selectDay" data-day="' + currentDate.format('L') + '" class="day' + clsName + '">' + currentDate.date() + '</td>');
            currentDate.add(1, 'd');
        }

        daysView.find('tbody').empty().append(html);

        this.updateMonths();

        this.updateYears();

        this.updateDecades();
    }

    private fillHours() {
        var table = this.widget.find('.timepicker-hours table'),
            currentHour = this.viewDate.clone().startOf('d'),
            html = [],
            row = $('<tr>');

        if (this.viewDate.hour() > 11 && !this.use24Hours) {
            currentHour.hour(12);
        }
        while (currentHour.isSame(this.viewDate, 'd') && (this.use24Hours || (this.viewDate.hour() < 12 && currentHour.hour() < 12) || this.viewDate.hour() > 11)) {
            if (currentHour.hour() % 4 === 0) {
                row = $('<tr>');
                html.push(row);
            }
            row.append('<td data-action="selectHour" class="hour' + (!this.isValid(currentHour, 'h') ? ' disabled' : '') + '">' + currentHour.format(this.use24Hours ? 'HH' : 'hh') + '</td>');
            currentHour.add(1, 'h');
        }
        table.empty().append(html);
    }
    
    private update() {
        if (!this.widget) {
            return;
        }
        this.fillDate();
        this.fillTime();
    }
    
    private parseInputDate (inputDate:string|Date) {
        var date:moment.Moment = undefined;
        if (this._options.parseInputDate === undefined) {
            if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                date = moment(inputDate);
            } else {
                date = this.getMoment(inputDate);
            }
        } else {
            date = this._options.parseInputDate(inputDate);
        }
        
        date.locale(this._options.locale);
        
        return date;
    }
    
    private viewUpdate(e) {
        if (e === 'y') {
            e = 'YYYY';
        }
        
        this.notifyEvent({
            type: 'dp.update',
            change: e,
            viewDate: this.viewDate.clone()
        });
    }
    
    private setValue(targetMoment?:moment.Moment) {
        var oldDate = this.unset ? null : this._date;

        // case of calling setValue(null or false)
        if (!targetMoment) {
            this.unset = true;
            this.input.val('');
            this.element.data('date', '');
            this.notifyEvent({
                type: 'dp.change',
                date: false,
                oldDate: oldDate
            });
            this.update();
            return;
        }
        
        
        

        targetMoment = targetMoment.clone().locale(this._options.locale);

        if (this._options.stepping !== 1) {
            targetMoment.minutes((Math.round(targetMoment.minutes() / this._options.stepping) * this._options.stepping) % 60).seconds(0);
        }

        if (this.isValid(targetMoment)) {
            this._date = targetMoment;
            this.viewDate = this._date.clone();
            this.input.val(this._date.format(this.actualFormat));
            this.element.data('date', this._date.format(this.actualFormat));
            this.unset = false;
            this.update();
            this.notifyEvent({
                type: 'dp.change',
                date: this._date.clone(),
                oldDate: oldDate
            });
            
        } else {
            if (!this._options.keepInvalid) {
                this.input.val(this.unset ? '' : this._date.format(this.actualFormat));
            }
            this.notifyEvent({
                type: 'dp.error',
                date: targetMoment
            });
        }
    }
    
    private isInDisabledDates(testDate:moment.Moment) {
        return this._options.disabledDates[testDate.format('YYYY-MM-DD')] === true;
    }
    
    private isInEnabledDates(testDate) {
        return this._options.enabledDates[testDate.format('YYYY-MM-DD')] === true;
    }

    private isInDisabledHours(testDate) {
        return this._options.disabledHours[testDate.format('H')] === true;
    }

    private isInEnabledHours(testDate) {
        return this._options.enabledHours[testDate.format('H')] === true;
    }
    
    private isValid(targetMoment:moment.Moment, granularity?:string) {
        if (!targetMoment.isValid()) {
            return false;
        }
        if (this._options.disabledDates && granularity === 'd' && this.isInDisabledDates(targetMoment)) {
            return false;
        }
        if (this._options.enabledDates && granularity === 'd' && !this.isInEnabledDates(targetMoment)) {
            return false;
        }
        if (this._options.minDate && targetMoment.isBefore(<string|Date|moment.Moment>this._options.minDate, granularity)) {
            return false;
        }
        if (this._options.maxDate && targetMoment.isAfter(<string|Date|moment.Moment>this._options.maxDate, granularity)) {
            return false;
        }
        if (this._options.daysOfWeekDisabled && granularity === 'd' && this._options.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
            return false;
        }
        if (this._options.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && this.isInDisabledHours(targetMoment)) {
            return false;
        }
        if (this._options.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && !this.isInEnabledHours(targetMoment)) {
            return false;
        }
        if (this._options.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
            var found = false;
            $.each(this._options.disabledTimeIntervals, function () {
                if (targetMoment.isBetween(this[0], this[1])) {
                    found = true;
                    return false;
                }
            });
            if (found) {
                return false;
            }
        }
        return true;
    }
    
    public hide() {
        var transitioning = false;
        if (!this.widget) {
            return this;
        }
        // Ignore event if in the middle of a picker transition
        this.widget.find('.collapse').each(function () {
            var collapseData = $(this).data('collapse');
            if (collapseData && collapseData.transitioning) {
                transitioning = true;
                return false;
            }
            return true;
        });
        if (transitioning) {
            return this;
        }
        if (this.component && this.component.hasClass('btn')) {
            this.component.toggleClass('active');
        }
        this.widget.hide();

        $(window).off(<any>'resize', <any>this.boundPlace);
        this.widget.off('click', '[data-action]');
        // this.widget.off('mousedown', false);

        this.widget.remove();
        this.widget = null;

        this.notifyEvent({
            type: 'dp.hide',
            date: this._date.clone()
        });

        this.input.blur();

        return this;
    }
    
    private place() {
        var position = (this.component || this.element).position(),
            offset = (this.component || this.element).offset(),
            vertical = this._options.widgetPositioning.vertical,
            horizontal = this._options.widgetPositioning.horizontal,
            parent;

        if (this._options.widgetParent) {
            parent = this._options.widgetParent.append(this.widget);
        } else if (this.element.is('input')) {
            parent = this.element.after(this.widget).parent();
        } else if (this._options.inline) {
            parent = this.element.append(this.widget);
            return;
        } else {
            parent = this.element;
            this.element.children().first().after(this.widget);
        }

        // Top and bottom logic
        if (vertical === 'auto') {
            if (offset.top + this.widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                this.widget.height() + this.element.outerHeight() < offset.top) {
                vertical = 'top';
            } else {
                vertical = 'bottom';
            }
        }

        // Left and right logic
        if (horizontal === 'auto') {
            if (parent.width() < offset.left + this.widget.outerWidth() / 2 &&
                offset.left + this.widget.outerWidth() > $(window).width()) {
                horizontal = 'right';
            } else {
                horizontal = 'left';
            }
        }

        if (vertical === 'top') {
            this.widget.addClass('top').removeClass('bottom');
        } else {
            this.widget.addClass('bottom').removeClass('top');
        }

        if (horizontal === 'right') {
            this.widget.addClass('pull-right');
        } else {
            this.widget.removeClass('pull-right');
        }

        // find the first parent element that has a relative css positioning
        if (parent.css('position') !== 'relative') {
            parent = parent.parents().filter(function () {
                return $(this).css('position') === 'relative';
            }).first();
        }

        if (parent.length === 0) {
            throw new Error('datetimepicker component should be placed within a relative positioned container');
        }

        this.widget.css({
            top: vertical === 'top' ? 'auto' : position.top + this.element.outerHeight(),
            bottom: vertical === 'top' ? position.top + this.element.outerHeight() : 'auto',
            left: horizontal === 'left' ? (parent === this.element ? 0 : position.left) : 'auto',
            right: horizontal === 'left' ? 'auto' : parent.outerWidth() - this.element.outerWidth() - (parent === this.element ? 0 : position.left)
        });
    }

    private notifyEvent(e:any) {
        if (e.type === 'dp.change' && ((e.date && e.date.isSame(e.oldDate)) || (!e.date && !e.oldDate))) {
            return;
        }
        
        this.element.trigger(e);
    }
    
    public disable() {
        this.hide();
        if (this.component && this.component.hasClass('btn')) {
            this.component.addClass('disabled');
        }
        this.input.prop('disabled', true);
        return this;
    }
    
    public enable() {
        ///<summary>Enables the input element, the component is attached to, by removing disabled attribute from it.</summary>
        if (this.component && this.component.hasClass('btn')) {
            this.component.removeClass('disabled');
        }
        this.input.prop('disabled', false);
        return this;
    }
    
    public ignoreReadonly(ignoreReadonly?:boolean) : this|boolean {
        if (ignoreReadonly == undefined) {
            return this._options.ignoreReadonly;
        }
        if (typeof ignoreReadonly !== 'boolean') {
            throw new TypeError('ignoreReadonly () expects a boolean parameter');
        }
        this._options.ignoreReadonly = ignoreReadonly;
        return this;
    }
    
    private dataToOptions() {
        var eData,
            dataOptions = {};

        if (this.element.is('input') || this._options.inline) {
            eData = this.element.data();
        } else {
            eData = this.element.find('input').data();
        }

        if (eData.dateOptions && eData.dateOptions instanceof Object) {
            dataOptions = $.extend(true, dataOptions, eData.dateOptions);
        }

        $.each(this.options, (key) => {
            var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1);
            if (eData[attributeName] !== undefined) {
                dataOptions[key] = eData[attributeName];
            }
        });
        return dataOptions;
    }
    
    private change(e:Event) {
        var val = $(e.target).val().trim(),
        parsedDate = val ? this.parseInputDate(val) : null;
        this.setValue(parsedDate);
        e.stopImmediatePropagation();
        return false;
    }
    
    private keydown(e:KeyboardEvent) {
        var handler = null,
            index,
            index2;
            
       let pressedKeys = [];
       let pressedModifiers = {},
            currentKey = e.which,
            keyBindKeys,
            allModifiersPressed,
            pressed = 'p';

        this.keyState[currentKey] = pressed;

        for (index in this.keyState) {
            if (this.keyState.hasOwnProperty(index) && this.keyState[index] === pressed) {
                pressedKeys.push(index);
                if (parseInt(index, 10) !== currentKey) {
                    pressedModifiers[index] = true;
                }
            }
        }

        for (index in this._options.keyBinds) {
            if (this._options.keyBinds.hasOwnProperty(index) && typeof (this._options.keyBinds[index]) === 'function') {
                keyBindKeys = index.split(' ');
                if (keyBindKeys.length === pressedKeys.length && this.keyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
                    allModifiersPressed = true;
                    for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
                        if (!(this.keyMap[keyBindKeys[index2]] in pressedModifiers)) {
                            allModifiersPressed = false;
                            break;
                        }
                    }
                    if (allModifiersPressed) {
                        handler = this._options.keyBinds[index];
                        break;
                    }
                }
            }
        }

        if (handler) {
            handler.call(this, this.widget);
            e.stopPropagation();
            e.preventDefault();
        }
    }

    private keyup (e:KeyboardEvent) {
        this.keyState[e.which] = 'r';
        e.stopPropagation();
        e.preventDefault();
    }
    
    public stepping(stepping?:any) : number | DateTimePicker{
        if (!stepping) {
            return this._options.stepping;
        }

        stepping = parseInt(stepping, 10);
        
        if (isNaN(stepping) || stepping < 1) {
            stepping = 1;
        }
        this._options.stepping = stepping;
        return this;
    }
    
    public toggle() {
        return (this.widget ? this.hide() : this.show());
    }
    
    private attachDatePickerElementEvents() {
        this.input.on({
            'change': (e:Event) => this.change(e),
            'blur': this._options.debug ? '' : () => this.hide(),
            'keydown': (e:KeyboardEvent) => this.keydown(e),
            'keyup': (e:KeyboardEvent) => this.keyup(e),
            'focus': this._options.allowInputToggle ? () => this.show() : ''
        });

        if (this.element.is('input')) {
            this.input.on({
                'focus': () => this.show()
            });
        } else if (this.component) {
            this.component.on('click', () => this.toggle());
            // this.component.on('mousedown', false);
        }
    }
    
    private detachDatePickerElementEvents() {
       this.input.off("change");
       this.input.off("blur");
       this.input.off("keydown");
       this.input.off("keyup");
       this.input.off("focus");

        if (this.element.is('input')) {
            this.element.off("focus");
        } else if (this.component) {
            this.component.off('click');
            this.component.off('mousedown');
        }
    }
    
    public indexGivenDates (givenDatesArray:any[]) {
        var givenDatesIndexed = {};
        
        givenDatesArray.forEach((x) => {
            var dDate = this.parseInputDate(x);
            if (dDate.isValid()) {
                givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
            }
        });
        
        return (Object.keys(givenDatesIndexed).length) ? givenDatesIndexed : false;
    }
    
    public indexGivenHours(givenHoursArray:any[]) {
        var givenHoursIndexed = {};
        
        givenHoursArray.forEach((x) => {
            givenHoursIndexed[x] = true;
        });
        
        return (Object.keys(givenHoursIndexed).length) ? givenHoursIndexed : false;
    }
    
    
    private initFormatting() {
        let format = this._options.format || 'L LT';

        this.actualFormat = format.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,  (formatInput) => {
            var item:any = this._date; // fix this
            var newinput = item.localeData().longDateFormat(formatInput) || formatInput;
            return newinput.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,  (formatInput2) => { //temp fix for #740
                return item.localeData().longDateFormat(formatInput2) || formatInput2;
            });
        });


        this.parseFormats = this._options.extraFormats ? this._options.extraFormats.slice() : [];
        if (this.parseFormats.indexOf(format) < 0 && this.parseFormats.indexOf(this.actualFormat) < 0) {
            this.parseFormats.push(this.actualFormat);
        }

        this.use24Hours = (this.actualFormat.toLowerCase().indexOf('a') < 1 && this.actualFormat.replace(/\[.*?\]/g, '').indexOf('h') < 1);

        if (this.isEnabled('y')) {
            this.minViewModeNumber = 2;
        }
        if (this.isEnabled('M')) {
            this.minViewModeNumber = 1;
        }
        if (this.isEnabled('d')) {
            this.minViewModeNumber = 0;
        }

        this.currentViewMode = Math.max(this.minViewModeNumber, this.currentViewMode);

        if (!this.unset) {
            this.setValue(this._date);
        }
    }
    
    public date (newDate? : string| moment.Moment |Date) : moment.Moment | DateTimePicker {
        if (newDate === undefined) {
            if (this.unset) {
                return null;
            }
            
            return this._date.clone();
        }

        if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
            throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
        }

        this.setValue(newDate === null ? null : this.parseInputDate(<string | Date >newDate));
        
        return this;
    }
    
    public destroy() {
        ///<summary>Destroys the widget and removes all attached event listeners</summary>
        this.hide();
        this.detachDatePickerElementEvents();
        this.element.removeData('DateTimePicker');
        this.element.removeData('date');
    }
    
    public format(newFormat?:any) : string|boolean|this {
        ///<summary>test su</summary>
        ///<param name="newFormat">info about para</param>
        ///<returns type="string|boolean">returns foo</returns>
        if (newFormat == undefined) {
            return this._options.format;
        }

        if ((typeof newFormat !== 'string') && ((typeof newFormat !== 'boolean') || (newFormat !== false))) {
            throw new TypeError('format() expects a sting or boolean:false parameter ' + newFormat);
        }

        this._options.format = newFormat;
        if (this.actualFormat) {
            this.initFormatting(); // reinit formatting
        }
        return this;
    }
    
    public timeZone(newZone?:any) :string|this {
        if (newZone == undefined) {
            return this._options.timeZone;
        }

        this._options.timeZone = newZone;

        return this;
    }
    
    public dayViewHeaderFormat(newFormat?:string): string|this {
        if (newFormat == undefined) {
            return this._options.dayViewHeaderFormat;
        }

        if (typeof newFormat !== 'string') {
            throw new TypeError('dayViewHeaderFormat() expects a string parameter');
        }

        this._options.dayViewHeaderFormat = newFormat;
        return this;
    }
    
    public extraFormats(formats?:any[]|boolean) {
        if (arguments.length === 0) {
            return this._options.extraFormats;
        }

        if (formats !== false && !(formats instanceof Array)) {
            throw new TypeError('extraFormats() expects an array or false parameter');
        }

        this._options.extraFormats = formats;
        if (this.parseFormats) {
            this.initFormatting(); // reinit formatting
        }
        return this;
    }
    
    private isEnabled(granularity) {
        if (typeof granularity !== 'string' || granularity.length > 1) {
            throw new TypeError('isEnabled expects a single character string parameter');
        }
        switch (granularity) {
            case 'y':
                return this.actualFormat.indexOf('Y') !== -1;
            case 'M':
                return this.actualFormat.indexOf('M') !== -1;
            case 'd':
                return this.actualFormat.toLowerCase().indexOf('d') !== -1;
            case 'h':
            case 'H':
                return this.actualFormat.toLowerCase().indexOf('h') !== -1;
            case 'm':
                return this.actualFormat.indexOf('m') !== -1;
            case 's':
                return this.actualFormat.indexOf('s') !== -1;
            default:
                return false;
        }
    }
    
    public getMoment(d?) :moment.Moment {
        var tzEnabled = moment["tz"] !== undefined 
                        && this._options.timeZone !== undefined 
                        && this._options.timeZone !== null 
                        && this._options.timeZone !== '';

        
        if (d === undefined || d === null) {
            if (tzEnabled) {
                return moment()["tz"](this._options.timeZone).startOf('d');
            } else {
                return moment().startOf('d');
            }
        } else {
            if (tzEnabled) {
                let currentZoneOffset = moment()["tz"](this._options.timeZone).utcOffset();
                let incomingZoneOffset = moment(d, this.parseFormats, this._options.useStrict).utcOffset();
                if (incomingZoneOffset !== currentZoneOffset) {
                    let timeZoneIndicator = moment()["tz"](this._options.timeZone).format('Z');
                    let dateWithTimeZoneInfo = moment(d, this.parseFormats, this._options.useStrict).format('YYYY-MM-DD[T]HH:mm:ss') + timeZoneIndicator;
                    return  moment(dateWithTimeZoneInfo, this.parseFormats, this._options.useStrict)["tz"](this._options.timeZone);
                } else {
                    return moment(d, this.parseFormats, this._options.useStrict)["tz"](this._options.timeZone);
                }
            } else {
                return moment(d, this.parseFormats, this._options.useStrict);
            }
        }
    }
    
    public options(newOptions?) : DateTimePickerOptions | DateTimePicker {
        if (!newOptions) {
            return $.extend(true, {}, this._options);
        }

        if (!(newOptions instanceof Object)) {
            throw new TypeError('options() options parameter should be an object');
        }
        $.extend(true, this._options, newOptions);
        $.each(this._options, (key, value) => {
            if (this[key] !== undefined) {
                this[key](value);
            } else {
                throw new TypeError('option ' + key + ' is not recognized!');
            }
        });
        
        return this;
    }
    
    public disabledDates(dates?:Array<string|Date|moment.Moment>) {
        if (dates == undefined) {
            return (this._options.disabledDates ? $.extend({}, this._options.disabledDates) : this._options.disabledDates);
        }

        if (!dates) {
            this._options.disabledDates = false;
            this.update();
            return this;
        }
        
        if (!(dates instanceof Array)) {
            throw new TypeError('disabledDates() expects an array parameter');
        }
        
        this._options.disabledDates = this.indexGivenDates(dates);
        this._options.enabledDates = false;
        this.update();
        return this;
    }
    
    public enabledDates(dates?:Array<string|Date|moment.Moment>) {
        if (dates == undefined) {
            return (this._options.enabledDates ? $.extend({}, this._options.enabledDates) : this._options.enabledDates);
        }

        if (!dates) {
            this._options.enabledDates = false;
            this.update();
            return this;
        }
        if (!(dates instanceof Array)) {
            throw new TypeError('enabledDates() expects an array parameter');
        }
        this._options.enabledDates = this.indexGivenDates(dates);
        this._options.disabledDates = false;
        this.update();
        return this;
    }
    
    public daysOfWeekDisabled(daysOfWeekDisabled?:any[]) {
        if (arguments.length === 0) {
            return this._options.daysOfWeekDisabled.splice(0);
        }

        if ((typeof daysOfWeekDisabled === 'boolean') && !daysOfWeekDisabled) {
            this._options.daysOfWeekDisabled = false;
            this.update();
            return this;
        }

        if (!(daysOfWeekDisabled instanceof Array)) {
            throw new TypeError('daysOfWeekDisabled() expects an array parameter');
        }
        this._options.daysOfWeekDisabled = daysOfWeekDisabled.reduce((previousValue, currentValue) => {
            currentValue = parseInt(currentValue, 10);
            if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
                return previousValue;
            }
            if (previousValue.indexOf(currentValue) === -1) {
                previousValue.push(currentValue);
            }
            return previousValue;
        }, []).sort();
        if (this._options.useCurrent && !this._options.keepInvalid) {
            var tries = 0;
            while (!this.isValid(this._date, 'd')) {
                this._date.add(1, 'd');
                if (tries === 7) {
                    throw 'Tried 7 times to find a valid date';
                }
                tries++;
            }
            this.setValue(this._date);
        }
        this.update();
        return this;
    }
    
    public maxDate(maxDate?:boolean|string|Date|moment.Moment) : number|boolean|this|Date|moment.Moment|string {
        if (arguments.length === 0) {
            return this._options.maxDate ? (<moment.Moment>this._options.maxDate).clone() : this._options.maxDate;
        }

        if ((typeof maxDate === 'boolean') && maxDate === false) {
            this._options.maxDate = false;
            this.update();
            return this;
        }

        if (typeof maxDate === 'string') {
            if (maxDate === 'now' || maxDate === 'moment') {
                maxDate = this.getMoment();
            }
        }

        var parsedDate = this.parseInputDate(<string|Date>maxDate);

        if (!parsedDate.isValid()) {
            throw new TypeError('maxDate() Could not parse date parameter: ' + maxDate);
        }
        if (this._options.minDate && parsedDate.isBefore(<string|Date|moment.Moment>this._options.minDate)) {
            throw new TypeError('maxDate() date parameter is before options.minDate: ' + parsedDate.format(this.actualFormat));
        }
        this._options.maxDate = parsedDate;
        if (this._options.useCurrent && !this._options.keepInvalid && this._date.isAfter(<string|Date|moment.Moment>maxDate)) {
            this.setValue(<moment.Moment>this._options.maxDate);
        }
        if (this.viewDate.isAfter(parsedDate)) {
            this.viewDate = parsedDate.clone().subtract(this._options.stepping, 'm');
        }
        this.update();
        return this;
    }
    
    public minDate(minDate?:boolean|string|Date|moment.Moment) : number|boolean|this|Date|moment.Moment|string {
        if (arguments.length === 0) {
            return this._options.minDate ? (<moment.Moment>this._options.minDate).clone() : this._options.minDate;
        }

        if ((typeof minDate === 'boolean') && minDate === false) {
            this._options.minDate = false;
            this.update();
            return this;
        }

        if (typeof minDate === 'string') {
            if (minDate === 'now' || minDate === 'moment') {
                minDate = this.getMoment();
            }
        }

        var parsedDate = this.parseInputDate(<string|Date>minDate);

        if (!parsedDate.isValid()) {
            throw new TypeError('minDate() Could not parse date parameter: ' + minDate);
        }
        if (this._options.minDate && parsedDate.isBefore(<string|Date|moment.Moment>this._options.minDate)) {
            throw new TypeError('minDate() date parameter is before options.minDate: ' + parsedDate.format(this.actualFormat));
        }
        this._options.minDate = parsedDate;
        if (this._options.useCurrent && !this._options.keepInvalid && this._date.isBefore(<string|Date|moment.Moment>minDate)) {
            this.setValue(<moment.Moment>this._options.minDate);
        }
        if (this.viewDate.isBefore(parsedDate)) {
            this.viewDate = parsedDate.clone().subtract(this._options.stepping, 'm');
        }
        this.update();
        return this;
    }
    
    public defaultDate(defaultDate?:boolean|string|Date|moment.Moment): number|boolean|this|Date|moment.Moment|string {
        if (arguments.length === 0) {
            return this._options.defaultDate ? (<moment.Moment>this._options.defaultDate).clone() : this._options.defaultDate;
        }
        if (!defaultDate) {
            this._options.defaultDate = false;
            return this;
        }

        if (typeof defaultDate === 'string') {
            if (defaultDate === 'now' || defaultDate === 'moment') {
                defaultDate = this.getMoment();
            }
        }

        var parsedDate = this.parseInputDate(<string|Date>defaultDate);
        if (!parsedDate.isValid()) {
            throw new TypeError('defaultDate() Could not parse date parameter: ' + defaultDate);
        }
        if (!this.isValid(parsedDate)) {
            throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
        }

        this._options.defaultDate = parsedDate;

        if ((this._options.defaultDate && this._options.inline) || this.input.val().trim() === '') {
            this.setValue(<moment.Moment>this._options.defaultDate);
        }
        return this;
    }
    
    public locale(locale)  : this|string {
        if (arguments.length === 0) {
            return this._options.locale;
        }

        if (!moment.localeData(locale)) {
            throw new TypeError('locale() locale ' + locale + ' is not loaded from moment locales!');
        }

        this._options.locale = locale;
        this._date.locale(this._options.locale);
        this.viewDate.locale(this._options.locale);

        if (this.actualFormat) {
            this.initFormatting(); // reinit formatting
        }
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public useCurrent(useCurrent) : string|this {
        var useCurrentOptions = ['year', 'month', 'day', 'hour', 'minute'];
        if (arguments.length === 0) {
            return this._options.useCurrent;
        }

        if ((typeof useCurrent !== 'boolean') && (typeof useCurrent !== 'string')) {
            throw new TypeError('useCurrent() expects a boolean or string parameter');
        }
        if (typeof useCurrent === 'string' && useCurrentOptions.indexOf(useCurrent.toLowerCase()) === -1) {
            throw new TypeError('useCurrent() expects a string parameter of ' + useCurrentOptions.join(', '));
        }
        
        this._options.useCurrent = useCurrent;
        return this;
    }

    public collapse(collapse) : boolean|this {
        if (arguments.length === 0) {
            return this._options.collapse;
        }

        if (typeof collapse !== 'boolean') {
            throw new TypeError('collapse() expects a boolean parameter');
        }
        if (this._options.collapse === collapse) {
            return this;
        }
        this._options.collapse = collapse;
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public icons(icons) {
        if (arguments.length === 0) {
            return $.extend({}, this._options.icons);
        }

        if (!(icons instanceof Object)) {
            throw new TypeError('icons() expects parameter to be an Object');
        }
        $.extend(this._options.icons, icons);
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public tooltips(tooltips) {
        if (arguments.length === 0) {
            return $.extend({}, this._options.tooltips);
        }

        if (!(tooltips instanceof Object)) {
            throw new TypeError('tooltips() expects parameter to be an Object');
        }
        $.extend(this._options.tooltips, tooltips);
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public useStrict(useStrict) {
        if (arguments.length === 0) {
            return this._options.useStrict;
        }

        if (typeof useStrict !== 'boolean') {
            throw new TypeError('useStrict() expects a boolean parameter');
        }
        this._options.useStrict = useStrict;
        return this;
    }

    public sideBySide(sideBySide) : this|boolean {
        if (arguments.length === 0) {
            return this._options.sideBySide;
        }

        if (typeof sideBySide !== 'boolean') {
            throw new TypeError('sideBySide() expects a boolean parameter');
        }
        this._options.sideBySide = sideBySide;
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public toolbarPlacement(toolbarPlacement) : string|this{
        if (arguments.length === 0) {
            return this._options.toolbarPlacement;
        }

        if (typeof toolbarPlacement !== 'string') {
            throw new TypeError('toolbarPlacement() expects a string parameter');
        }
        if (this.toolbarPlacements.indexOf(toolbarPlacement) === -1) {
            throw new TypeError('toolbarPlacement() parameter must be one of (' + this.toolbarPlacements.join(', ') + ') value');
        }
        this._options.toolbarPlacement = toolbarPlacement;

        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public widgetPositioning(widgetPositioning) {
        if (arguments.length === 0) {
            return $.extend({}, this._options.widgetPositioning);
        }

        if (({}).toString.call(widgetPositioning) !== '[object Object]') {
            throw new TypeError('widgetPositioning() expects an object variable');
        }
        if (widgetPositioning.horizontal) {
            if (typeof widgetPositioning.horizontal !== 'string') {
                throw new TypeError('widgetPositioning() horizontal variable must be a string');
            }
            widgetPositioning.horizontal = widgetPositioning.horizontal.toLowerCase();
            if (this.horizontalModes.indexOf(widgetPositioning.horizontal) === -1) {
                throw new TypeError('widgetPositioning() expects horizontal parameter to be one of (' + this.horizontalModes.join(', ') + ')');
            }
            this._options.widgetPositioning.horizontal = widgetPositioning.horizontal;
        }
        if (widgetPositioning.vertical) {
            if (typeof widgetPositioning.vertical !== 'string') {
                throw new TypeError('widgetPositioning() vertical variable must be a string');
            }
            widgetPositioning.vertical = widgetPositioning.vertical.toLowerCase();
            if (this.verticalModes.indexOf(widgetPositioning.vertical) === -1) {
                throw new TypeError('widgetPositioning() expects vertical parameter to be one of (' + this.verticalModes.join(', ') + ')');
            }
            this._options.widgetPositioning.vertical = widgetPositioning.vertical;
        }
        this.update();
        return this;
    }

    public calendarWeeks(calendarWeeks) : boolean|this {
        if (arguments.length === 0) {
            return this._options.calendarWeeks;
        }

        if (typeof calendarWeeks !== 'boolean') {
            throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
        }

        this._options.calendarWeeks = calendarWeeks;
        this.update();
        return this;
    }

    public showTodayButton(showTodayButton): boolean|this {
        if (arguments.length === 0) {
            return this._options.showTodayButton;
        }

        if (typeof showTodayButton !== 'boolean') {
            throw new TypeError('showTodayButton() expects a boolean parameter');
        }

        this._options.showTodayButton = showTodayButton;
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public showClear(showClear): boolean|this {
        if (arguments.length === 0) {
            return this._options.showClear;
        }

        if (typeof showClear !== 'boolean') {
            throw new TypeError('showClear() expects a boolean parameter');
        }

        this._options.showClear = showClear;
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public widgetParent(widgetParent) {
        if (arguments.length === 0) {
            return this._options.widgetParent;
        }

        if (typeof widgetParent === 'string') {
            widgetParent = $(widgetParent);
        }

        if (widgetParent !== null && (typeof widgetParent !== 'string' && !(widgetParent instanceof $))) {
            throw new TypeError('widgetParent() expects a string or a jQuery object parameter');
        }

        this._options.widgetParent = widgetParent;
        if (this.widget) {
            this.hide();
            this.show();
        }
        return this;
    }

    public keepOpen (keepOpen?:boolean) : boolean|this {
        if (arguments.length === 0) {
            return this._options.keepOpen;
        }

        if (typeof keepOpen !== 'boolean') {
            throw new TypeError('keepOpen() expects a boolean parameter');
        }

        this._options.keepOpen = keepOpen;
        return this;
    }

    public focusOnShow(focusOnShow?:boolean): boolean|this {
        if (arguments.length === 0) {
            return this._options.focusOnShow;
        }

        if (typeof focusOnShow !== 'boolean') {
            throw new TypeError('focusOnShow() expects a boolean parameter');
        }

        this._options.focusOnShow = focusOnShow;
        return this;
    }

    public inline(inline) :boolean|this {
        if (arguments.length === 0) {
            return this._options.inline;
        }

        if (typeof inline !== 'boolean') {
            throw new TypeError('inline() expects a boolean parameter');
        }

        this._options.inline = inline;
        return this;
    }

    public keyBinds(keyBinds) {
        this._options.keyBinds = keyBinds;
        return this;
    }

    public debug(debug) {
        if (typeof debug !== 'boolean') {
            throw new TypeError('debug() expects a boolean parameter');
        }

        this._options.debug = debug;
        return this;
    }

    public allowInputToggle(allowInputToggle?:boolean) : boolean|this {
        if (arguments.length === 0) {
            return this._options.allowInputToggle;
        }

        if (typeof allowInputToggle !== 'boolean') {
            throw new TypeError('allowInputToggle() expects a boolean parameter');
        }

        this._options.allowInputToggle = allowInputToggle;
        return this;
    }

    public showClose(showClose?:boolean):boolean|this {
        if (arguments.length === 0) {
            return this._options.showClose;
        }

        if (typeof showClose !== 'boolean') {
            throw new TypeError('showClose() expects a boolean parameter');
        }

        this._options.showClose = showClose;
        return this;
    }

    public keepInvalid(keepInvalid?:boolean):boolean|this {
        if (arguments.length === 0) {
            return this._options.keepInvalid;
        }

        if (typeof keepInvalid !== 'boolean') {
            throw new TypeError('keepInvalid() expects a boolean parameter');
        }
        this._options.keepInvalid = keepInvalid;
        return this;
    }

    public datepickerInput(datepickerInput?:string) : string|this {
        if (arguments.length === 0) {
            return this._options.datepickerInput;
        }

        if (typeof datepickerInput !== 'string') {
            throw new TypeError('datepickerInput() expects a string parameter');
        }

        this._options.datepickerInput = datepickerInput;
        return this;
    }

    public disabledTimeIntervals(disabledTimeIntervals) {
        if (arguments.length === 0) {
            return (this._options.disabledTimeIntervals ? $.extend({}, this._options.disabledTimeIntervals) : this._options.disabledTimeIntervals);
        }

        if (!disabledTimeIntervals) {
            this._options.disabledTimeIntervals = false;
            this.update();
            return this;
        }
        if (!(disabledTimeIntervals instanceof Array)) {
            throw new TypeError('disabledTimeIntervals() expects an array parameter');
        }
        this._options.disabledTimeIntervals = disabledTimeIntervals;
        this.update();
        return this;
    }

    public disabledHours(hours) {
        if (arguments.length === 0) {
            return (this._options.disabledHours ? $.extend({}, this._options.disabledHours) : this._options.disabledHours);
        }

        if (!hours) {
            this._options.disabledHours = false;
            this.update();
            return this;
        }
        if (!(hours instanceof Array)) {
            throw new TypeError('disabledHours() expects an array parameter');
        }
        this._options.disabledHours = this.indexGivenHours(hours);
        this._options.enabledHours = false;
        if (this._options.useCurrent && !this._options.keepInvalid) {
            var tries = 0;
            while (!this.isValid(this._date, 'h')) {
                this._date.add(1, 'h');
                if (tries === 24) {
                    throw 'Tried 24 times to find a valid date';
                }
                tries++;
            }
            this.setValue(this._date);
        }
        this.update();
        return this;
    }

    public enabledHours(hours) {
        if (arguments.length === 0) {
            return (this._options.enabledHours ? $.extend({}, this._options.enabledHours) : this._options.enabledHours);
        }

        if (!hours) {
            this._options.enabledHours = false;
            this.update();
            return this;
        }
        if (!(hours instanceof Array)) {
            throw new TypeError('enabledHours() expects an array parameter');
        }
        this._options.enabledHours = this.indexGivenHours(hours);
        this._options.disabledHours = false;
        if (this._options.useCurrent && !this._options.keepInvalid) {
            var tries = 0;
            while (!this.isValid(this._date, 'h')) {
                this._date.add(1, 'h');
                if (tries === 24) {
                    throw 'Tried 24 times to find a valid date';
                }
                tries++;
            }
            this.setValue(this._date);
        }
        this.update();
        return this;
    }        
}
