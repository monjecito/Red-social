import { Component, OnInit,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import * as $ from 'jquery';


@Component({
  selector: 'publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {
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

  //Propiedad recibida desde fuera del componente
  @Input() user:string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = 'Publicaciones';
    this.url = GLOBAL.url;
    this.page = 1;
  }

  ngOnInit(): void {
    console.log('Componente de publicaciones funcionando');
    this.getPublications(this.user,this.page);

  }

  getPublications(user,page, adding = false) {
    this._publicationService.getPublicationsUser(this.token,user, page).subscribe(
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
  //Mostrar más publicaciones
  viewMore() {
    console.log(this.publications.length);
    console.log(this.total - this.itemsPerPage);
    if (this.publications.length == this.total) {
      this.noMore = true;
    } else {
      this.page += 1;
    }

    this.getPublications(this.user,this.page, true);
  }
}
