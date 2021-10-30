import { Component, ElementRef, OnInit, OnChanges, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit, OnChanges {

  constructor() { }
  hours;
  minutes;
  seconds;
  isAM = 'checked';
  isPM = false

  selectedHrs;
  selectedMins;
  selectedZone;

  timeSession

  @Input() initTime;

  @ViewChild('hours') hoursField: ElementRef;
  @ViewChild('mins') minutesField: ElementRef;
  @ViewChild('zone') zoneField: ElementRef;

  @Output() setTime = new EventEmitter();

  TU = {//  Time Units in milliseconds
    millisecond: 1,
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 24 * 3600000,
    week: 7 * 24 * 3600000,
    month: 28 * 24 * 3600000,
    year: 364 * 24 * 3600000
  };

  change(event) {
    console.log(event.target.value)
  }

  t4hrs;

  ngOnInit(): void {
    this.hours = new Date(this.initTime).getHours()
    this.selectedZone = (this.hours > 12) ? "PM" : "AM"
    this.hours = ((this.hours + 11) % 12) + 1

    this.minutes = new Date(this.initTime).getMinutes()
    this.seconds = new Date(this.initTime).getSeconds();

    this.selectedHrs = this.hours;
    this.selectedMins = this.minutes
    this.submitTime();

  }
  ngAfterViewInit() {
    this.zoneField.nativeElement.value = this.selectedZone;
    this.hoursField.nativeElement.value = (this.hours < 10) ? "0" + this.hours : this.hours
    this.minutesField.nativeElement.value = (this.minutes < 10) ? "0" + this.minutes : this.minutes;
    this.submitTime();
  }
  ngOnChanges(value){
    console.log(value);
  }

  submitTime() {
    let time = 0;
    if (this.selectedZone == "PM") {
      if (this.selectedHrs < 12) {
        time = this.selectedHrs + 12;
      } else {
        if (this.selectedHrs == 24) {
          time = 12
        }else{
          time = this.selectedHrs;
        }        
      }
    } else {
      if (this.selectedHrs == 12) {
        time = 0;
      }else{
        time = this.selectedHrs

      }
      
    }
    let newTime = (time * this.TU.hour) + (this.selectedMins * this.TU.minute)
    this.setTime.emit(newTime);

  }
  //((this.hours + 11) % 12) + 1
  pushHrs(e) {
    let field = this.hoursField.nativeElement
    this.hours = this.up(this.hours, 'hours', field.min, field.max)
    field.value = (this.hours < 10) ? "0" + this.hours : this.hours
    this.selectedHrs = this.hours
    this.submitTime();
  }
  downHrs(e) {
    let field = this.hoursField.nativeElement
    this.hours = this.down(this.hours, 'hours', field.min, field.max)
    field.value = (this.hours < 10) ? "0" + this.hours : this.hours;
    this.selectedHrs = this.hours
    this.submitTime();
  }
  pushMins(e) {
    let field = this.minutesField.nativeElement
    this.minutes = this.up(this.minutes, 'mins', field.min, field.max)
    field.value = (this.minutes < 10) ? "0" + this.minutes : this.minutes
    this.selectedMins = this.minutes
    this.submitTime();
  }
  downMins(e) {
    let field = this.minutesField.nativeElement
    this.minutes = this.down(this.minutes, 'mins', field.min, field.max)
    field.value = (this.minutes < 10) ? "0" + this.minutes : this.minutes
    this.selectedMins = this.minutes
    this.submitTime();
  }
  up(current, type, min, max) {
    if (current < parseInt(max, 10)) {
      current++;
    }
    return current;
  }
  down(current, type, min, max) {
    if (current > parseInt(min, 10)) {
      current--;
    }
    return current;
  }
  toggleMeridian(e) {
    let cuurentValue = this.zoneField.nativeElement.value;
    this.zoneField.nativeElement.value = (cuurentValue == "AM") ? "PM" : "AM"
    this.selectedZone = this.zoneField.nativeElement.value;
    if (this.zoneField.nativeElement.value == "AM") {
      this.selectedHrs = ((this.hours + 11) % 12) + 1
    }
    if (this.zoneField.nativeElement.value == "PM") {
      this.selectedHrs = this.hours + 12
    }
    this.submitTime();
  }
}