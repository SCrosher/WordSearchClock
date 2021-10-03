import { Component, OnInit } from '@angular/core';
import letters from './letters.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  updateInterval: number = 1;
  currentDispalyedHour: number = 0;
  currentDisplayedMinute: number = 0;
  isPast30Minutes: boolean = false;
  model: ClockModel = {} as ClockModel;

  ngOnInit() {
    this.setDisplay(new Date());
    setInterval(() => { this.update() }, this.updateInterval * 1000);
    this.model = JSON.parse(JSON.stringify(letters));
  }

  update() {
    this.setDisplay(new Date());
  }

  setDisplay(now: Date){
    //Get current date and pull out current hour and most recent 5 minute interval
    var minutes = JSON.parse(JSON.stringify(now.getMinutes()));
    minutes = minutes - (minutes % 5);
    var hour = JSON.parse(JSON.stringify(now.getHours()));
    if (hour > 12) hour = hour - 12;
    //If minutes haven't changed no need to go further
    if (this.currentDisplayedMinute === minutes || (minutes > 30 && this.currentDisplayedMinute === 60 - minutes)) return;

    //Set display values
    if (minutes > 30) this.isPast30Minutes = true;
    else this.isPast30Minutes = false;
    this.currentDispalyedHour = this.isPast30Minutes ? hour + 1 : hour;
    this.currentDisplayedMinute = this.isPast30Minutes ? 60 - minutes : minutes;

    console.log("Past 30 Minutes: ", this.isPast30Minutes);
    console.log("Current Displayed Minute: ", this.currentDisplayedMinute);
    console.log("Current Displayed Hour: ", this.currentDispalyedHour);
  }

  getIlumitatedClass(letter: ClockLetter){
    var className = 'letter illuminated';
    if (letter.alwaysDisplay) return className;

    if (letter.displayPast30Minutes && this.isPast30Minutes) return className;

    if (letter.displayPast30Minutes === false && !this.isPast30Minutes) return className;

    if (letter.displayForHour === this.currentDispalyedHour) return className;

    if (letter.displayForMinute === this.currentDisplayedMinute) return className;

    return 'letter';
  }

}

declare interface ClockModel {
  rows: LetterRow[];
}

declare interface LetterRow {
  letters: ClockLetter[];
}

declare interface ClockLetter {
  letter: string;
  alwaysDisplay?: boolean;
  displayPast30Minutes?: boolean;
  displayForHour?: number;
  displayForMinute?: number;
}