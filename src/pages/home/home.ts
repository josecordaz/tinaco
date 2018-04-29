import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  server_ip: String  = "192.168.1.72"
  status_server: String = ""
  icon_server_status: String = ""
  color_server_status: String = ""
  
  status_reading_level: String = ""
  icon_level_status: String = ""
  color_level_status: String = ""

  water_level: Number = 0

  constructor(public navCtrl: NavController, private http: HttpClient) {
    // this.http.get('http://192.168.1.72:8000/con').subscribe(data => {
    //   alert(data)
    //   console.log('data',data);
    // });
  }

  connect(){
    this.status_server = "Conectando...";
    this.water_level = 0;
    this.icon_server_status = "";
    this.color_server_status = "";
    this.status_reading_level = ""
    this.icon_level_status = "";
    this.http.get('http://'+this.server_ip+':8000/con').subscribe(data => {
      if( data['status'] != undefined ){
        // setTimeout(()=>{
          this.color_server_status = "secondary"
          this.icon_server_status = "md-checkmark"
          this.readWaterLevel()
        // },2000)
      } else {
        this.icon_server_status = "md-close"
        this.color_server_status = "danger"
      }
    }, err => {
      alert("err:"+JSON.stringify(err))
    });
    
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
}
