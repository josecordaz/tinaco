import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { Observable} from 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  server_ip: String  = "192.168.1.85"
  
  status_reading_level: String = ""
  icon_level_status: String = ""
  color_level_status: String = ""

  water_level: Number = 0

  bomb_state : boolean = false

  bomb_button_status_str : string = "Encender"

  obs;

  bomb_state_icon: string = ""
  bomb_state_color: string = ""

  constructor(public navCtrl: NavController, private http: HttpClient) {
    this.obs = Observable
    .interval(2000)
  }

  connect(){
    this.water_level = 0;
    this.status_reading_level = ""
    this.icon_level_status = "";
    // this.http.get('http://'+this.server_ip+':8000/con').subscribe(data => {
    //   if( data['status'] != undefined ){
    this.obs.subscribe(value => this.readWaterLevel());
    this.obs.subscribe(value => this.readBombStatus());
    // }
    // }, err => {
    //   alert("err:"+JSON.stringify(err))
    // });
  }

  readWaterLevel(){
    this.status_reading_level = "Midiendo niveles..."
    this.http.get('http://'+this.server_ip+':8000/level').subscribe(data => {
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
    });
  }

  readBombStatus(){
    this.status_reading_level = "Midiendo niveles..."
    this.http.get('http://'+this.server_ip+':8000/b_status').subscribe(data => {
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
    });
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
