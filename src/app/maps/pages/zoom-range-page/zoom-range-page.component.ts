import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy{

  //viewChild permite hacer referencia a un elemento del DOM
  @ViewChild('map')
  public divMap?: ElementRef;
  public zoomCurrent: number = 7;
  public map?: Map;
  public currentLgLat: LngLat = new LngLat(-98.2163323582127, 19.04920503471874);

  //Listener para el cambio de zoom
  public mapListeners() {
    if( !this.map ) throw 'Mapa no encontrado';
    this.map.on('zoom', (event) => {
      this.zoomCurrent = this.map!.getZoom(); //siver para obtener el zoom actual
    });

    this.map.on('zoomend', (event) => {
      if( this.map!.getZoom() < 15 ) return ;
      this.map!.zoomTo(15);
    });

    this.map.on('move',  () => {
      this.currentLgLat = this.map!.getCenter();
      const { lng, lat } = this.currentLgLat;

      console.log(this.currentLgLat);
    })
  }

  ngAfterViewInit(): void {

    if ( !this.divMap )  throw 'Elemento no encontrado';

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLgLat, // starting position [lng, lat]
      zoom: this.zoomCurrent, // starting zoom
    });
    this.mapListeners();
  };

  ngOnDestroy(): void {
    this.map?.remove(); //esto es para evitar memory leaks y elimianar el mapa cuando se destruya el componente
  }

  public zoomIn() {
    this.map?.zoomIn();
  }
  public zoomOut() {
    this.map?.zoomOut();
  };

  public zoomChange( value: string ) {
    this.zoomCurrent = Number(value);
    this.map?.zoomTo( this.zoomCurrent );
  }
}
