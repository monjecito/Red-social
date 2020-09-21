import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: String;
  public user: User;
  public status: string;
  public identity;      //Objeto usuario identificado
  public token;         //Token generado por el usuario para la autenticación

  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private _userService: UserService
  ) {
    this.title = "Identificate";
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit(): void {
    console.log('Componente login');
  }

  onSubmit() {
    //Loguear al usuario y conseguir sus datos
    this._userService.signup(this.user).subscribe(
      Response => {
        this.identity=Response.user;
        console.log(this.identity);
        if(!this.identity|| !this.identity._id){
          this.status='error';
        }else{
          this.status='success';
          //Persistir datos del usuario

          //Conseguir el token
          this.getToken();
        }
          
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }

      }
    );
  }

//Devolver token perteneciente a dicho usuario logueado
  getToken(){
    this._userService.signup(this.user,'true').subscribe(
      Response => {
        this.token=Response.token;
        console.log(this.token);
        if(this.token.length<=0){
          this.status='error';
        }else{
          this.status='success';
          //Persistir token del usuario

          //Conseguir las estadísticas del usuario
          
        }
          
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
    }
  }