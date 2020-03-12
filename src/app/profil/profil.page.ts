import { PhotoProfilSelectedPage } from './../photo-profil-selected/photo-profil-selected.page';
import { NavController, ToastController, ModalController, NavParams } from '@ionic/angular';
import { monservice } from './../services/monserice';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
declare var $, moment
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  pages = true
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  personne: any
  slide
  image = 'https://i.picsum.photos/id/230/200/300.jpg'
  @ViewChild('loopSlider', {static: true}) loopSlider;
  interet: any;
  mode: any;
  suggetion: any;
  modal
  constructor(public router:ActivatedRoute, private service: monservice, private navCtrl: NavController, private route: Router, public toastController: ToastController, private imagePicker: ImagePicker, private moadalCtrl: ModalController) { }
  monstyle(al) {
    let style=  {
        'background-image': 'url('+al.photo+')', 
      'height': $('app-profil').height()/2 + 'px', 
      'background-size': 'cover',
      'background-position': 'center',
      'width': '100%'
     }
     // console.log('taille ', $('app-proposition').height())
     return style
  }
  async pickImage() {
    console.log('pick')
    let options = {
      maximumImagesCount: 1,
      outputType: 1,
      allow_video: false
    }
     //FAKE
      this.modal = await this.moadalCtrl.create({
      component: PhotoProfilSelectedPage,
      componentProps: {
        'image': this.image
      }
    })
    this.modal.onDidDismiss().then((e: any)=> {
        console.log('dismiss', e)
        var data = e.data.componentProps.image
        if(data == true) {
          this.loopSlider.lockSwipes(false)
          this.personne.album.push({id: this.personne.album.length+1,photo: this.image})
          this.loopSlider.update().then(e=> {
            var taille = this.loopSlider.length().then(e=> {
              console.log('taille ', e)
              this.loopSlider.slideTo(e)
            })
            
          })
          if(this.pages == false) {
            this.pages = true
          }
        }
    })
    return await this.modal.present();
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          console.log('Image base64: ' + results[i]);
          this.image = "data:image/png;base64,"+results[i]
      }
      this.moadalCtrl.create({
        component: PhotoProfilSelectedPage,
        componentProps: {
          'image': this.image
        }
      })
    }, (err) => { 
      console.log('erreur', err)
    })
  }
  ngOnInit() {
    this.personne = this.service.Allpersonnes.find(i=> {
      return i.id == this.service.utilisateur.id
    })
    console.log('personne ', this.personne, ' album ', this.personne.album)
    var i = this.personne.album.find(e=> {
      return e.photo == this.personne.images
    })
    console.log('iiii ', i)
    if(i == undefined) {
        var k =  this.personne.album.push({id: this.personne.album.length+1,photo: this.personne.images})
          this.personne.album = this.personne.album.sort((a, b)=> {
            if (a.id < b.id ) {
            return 1;
          }
          if (a.id > b.id ) {
            return -1;
          }
          return 0;
          })
      console.log('personne ', this.personne, 'taille album ', this.personne.album.length)
     this.loopSlider.lockSwipes(true)
    }
    if(this.personne.album.length > 1 ) {
        this.pages = true
        this.loopSlider.lockSwipes(false)
      }
      this.interet = this.personne.interets
      this.mode = this.personne.mode
      this.suggetion = this.personne.suggetion
  }
  goBack() {
    this.navCtrl.navigateBack('portail/users/proposition')
  }
  tap() {

  }
  getAge(date) {
    var age = moment(date).format('Y')
     return moment().format('Y') - age
  }
  getKms(km) {
    var kM = Math.round(km)
    if(kM <= 1) {
      return "< 1"
    }
    return kM
  }
}