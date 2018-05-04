import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { Observable} from 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  server_ip: String  = "192.168.1.72"
  
  status_reading_level: String = ""
  icon_level_status: String = ""
  color_level_status: String = ""

  water_level: Number = 0

  bomb_state : boolean = false

  bomb_button_status_str : string = "Encender"

  obs;

  bomb_state_icon: string = ""
  bomb_state_color: string = ""

  s1: any
  s2: any

  status_loading : boolean = true

  constructor(public navCtrl: NavController, private http: HttpClient) {
    this.obs = Observable
    .interval(2000)
  }

  connect(){
    this.water_level = 0;
    this.status_reading_level = ""
    this.icon_level_status = "";


    if (this.s1) {
      this.s1.unsubscribe();
    }
    this.status_reading_level = "Midiendo niveles..."
    // this.s1 = this.obs.switchMap((val)=> this.http.get('http://'+this.server_ip+':8000/level')).subscribe(data=>this.readWaterLevel(data))
    this.status_loading = false
    this.s1 = this.http.get('http://'+this.server_ip+':8000/level').subscribe(data=>this.readWaterLevel(data))

    if (this.s2) {
      this.s2.unsubscribe();
    }
    // this.status_reading_level = "Midiendo niveles..."
    // this.s1 = this.obs.switchMap((val)=> this.http.get('http://'+this.server_ip+':8000/b_status')).subscribe(data=>this.readBombStatus(data))
    this.s1 = this.http.get('http://'+this.server_ip+':8000/b_status').subscribe(data=>this.readBombStatus(data))

    

    // this.http.get('http://'+this.server_ip+':8000/con').subscribe(data => {
    //   if( data['status'] != undefined ){
    // if (this.s1) {
    //   this.s1 = null
    // }
    // this.obs.map(val => this.readWaterLevel()).last(val).subscribe(value => );
    
    // this.obs.last.subscribe(value => this.readBombStatus());
    // }
    // }, err => {
    //   alert("err:"+JSON.stringify(err))
    // });
  }

  readWaterLevel(data){
      this.status_loading = true
      if( data['level'] != undefined ){
        console.log('level',data['level'])
        this.water_level = data['level'];
        this.color_level_status = "secondary";
        this.icon_level_status = "md-checkmark";
        // level / 100 * 474
        document.getElementById("level-water").style['min-height'] = ((data['level']/100) * 474) +"px"
        console.log((data['level']/100) * 474)
      } else {
        this.icon_level_status = "md-close"
        this.color_level_status = "danger"
      }
  }

  readBombStatus(data){
    // this.status_reading_level = "Midiendo niveles..."
    // this.http.get('http://'+this.server_ip+':8000/b_status').subscribe(data => {
      if( data['status'] != undefined ){

        console.log("status true")

        this.bomb_state = data['status'];

        this.bomb_state_icon = "md-checkmark"
        this.bomb_state_color = "secondary"

        this.bomb_button_status_str = "Apagar"

      } else {
        console.log("status false")

        this.bomb_state = false;

        this.bomb_state_icon = "md-close"
        this.bomb_state_color = "danger"

        this.bomb_button_status_str = "Encender"

      }
    // });
  }

  changeBombStatus(){
    if ( !this.bomb_state ){
      this.http.get('http://'+this.server_ip+':8000/b_on').subscribe(data => {
        // this.bomb_button_status_str = "Apagar"
        // this.bomb_state_color = "danger"
      })
    } else {
      this.http.get('http://'+this.server_ip+':8000/b_off').subscribe(data => {
        // this.bomb_button_status_str = "Encender"
        // this.bomb_state_color = "secondary"
      })
    }
    
  }
}
