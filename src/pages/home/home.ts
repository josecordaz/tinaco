import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../app/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  TOKEN_KEY = 'token';
  
  server_ip: string  = ""
  server_port: string = "8082"
  
  status_reading_level: string = ""
  icon_level_status: string = ""
  color_level_status: string = ""

  water_level: Number = 0

  bomb_state : boolean = false

  bomb_button_status_str : string = "Encender"

  bomb_state_icon: string = ""
  bomb_state_color: string = ""

  s1: any
  s2: any

  status_loading : boolean = true

  constructor(public navCtrl: NavController, private http: HttpClient,private authService: AuthService) {}

  connect(){
    this.water_level = 0;
    this.status_reading_level = ""
    this.icon_level_status = "";

    this.authService.setApiURL(this.server_ip)


    if (this.s1) {
      this.s1.unsubscribe();
    }
    this.status_reading_level = "Midiendo niveles..."
    this.status_loading = false
    this.s1 = this.http.get(this.authService.API_URL+'/level').subscribe(data=>this.readWaterLevel(data),err=>{
      alert("Error Leyendo Niveles"+JSON.stringify(err))
    })

    if (this.s2) {
      this.s2.unsubscribe();
    }
    this.s2 = this.http.get(this.authService.API_URL+'/b_status').subscribe(data=>this.readBombStatus(data),err=>{
      alert("Error Leyendo Bomba"+JSON.stringify(err))
    })
    
  }

  readWaterLevel(data){
      this.status_loading = true
      if( data['level'] != undefined ){
        console.log('level',data['level'])
        this.water_level = data['level'];
        this.color_level_status = "secondary";
        this.icon_level_status = "md-checkmark";
        document.getElementById("level-water").style['min-height'] = ((data['level']/100) * 474) +"px"
      } else {
        this.icon_level_status = "md-close"
        this.color_level_status = "danger"
      }
  }

  readBombStatus(data){
      if( data['status'] != undefined ){
        this.bomb_state = data['status'];
        this.bomb_state_icon = "md-checkmark"
        this.bomb_state_color = "secondary"
        this.bomb_button_status_str = "Apagar"
      } else {
        this.bomb_state = false;
        this.bomb_state_icon = "md-close"
        this.bomb_state_color = "danger"
        this.bomb_button_status_str = "Encender"
      }
  }

  changeBombStatus(){
    if ( !this.bomb_state ){
      this.http.get(this.authService.API_URL+'/b_on').subscribe(data => {
        this.readBombStatus(data)
      },err=>{
        alert("Error Encendiendo Bomba"+JSON.stringify(err))
      })
    } else {
      this.http.get(this.authService.API_URL+'/b_off').subscribe(data => {
        this.readBombStatus(data)
      },err=>{
        alert("Error Apagando Bomba"+JSON.stringify(err))
      })
    }
    
  }

  login(){
    console.log(this.server_ip)
    // alert(document.URL)
    this.authService.login("admin@gmail.com","admin123").subscribe(
      (res: any) => {
          this.status_loading = true
          this.changeBombStatus()
          localStorage.setItem(this.TOKEN_KEY, res.token);
      },err => {
        alert("Error Login"+JSON.stringify(err))
      }
  );
  }

}
