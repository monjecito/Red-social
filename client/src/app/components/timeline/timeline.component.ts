import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import * as $ from 'jquery';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public title: string;
  public url: string;
  public status: string;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public publications: Publication[];
  public showImage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = 'TIMELINE';
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit(): void {
    console.log('Componente timeline funcionando');
    this.getPublications(this.page);

  }

  getPublications(page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if (!adding) {
            this.publications = response.publications;
          } else {
            var arrayA = this.publications;
            var arrayB = response.publications;               //Añadir elementos al array de publicaciones para mostrar más
            this.publications = arrayA.concat(arrayB);

           $("html,body").animate({scrollTop:$('body').prop("scrollHeight")},800);
          }




          if (page > this.pages) {
            //this._router.navigate(['/home']);
          }

        } else {
          this.status = 'error';
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (!errorMessage) {
          this.status = 'error';
        }
      }
    );
  }
  public noMore = false;
  //Mostrar más publicaciones mientras existan
  viewMore() {
    this.page += 1;

    if (this.page == this.pages) {
      this.noMore = true;
    } 

    this.getPublications(this.page, true);
  }

  //Refrescar las publicaciones una vez creadas llamando al evento emitido en el componente Sidebar
  refresh(event=null){
    this.getPublications(1);
  }

  //Mostrar la imagen de cada publicación que corresponda
  showThisImage(id){
    this.showImage=id;
    console.log(id);
  }

  //Ocultar la imagen de la publicación
  hideThisImage(id){
    this.showImage=null;
  }

  deletePublication(id){
    this._publicationService.deletePublication(this.token,id).subscribe(
      response=>{
        this.refresh();
      },
      error=>{
        console.log(<any>error);
      }
    );
  }
  
}
