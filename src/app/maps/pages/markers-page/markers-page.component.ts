import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

//Creamos una interfaz para poder tener un array de colores y markers
interface MarkerAndColor {
  color: string;
  marker: Marker;
};

interface PlainMarker {
  color: string;
  lngLat: number[];
}
@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit, OnDestroy {

  //viewChild permite hacer referencia a un elemento del DOM
  @ViewChild('map')

  public divMap?: ElementRef;
  public zoomCurrent: number = 12;
  public map?: Map;
  public currentLgLat: LngLat = new LngLat(-98.2163323582127, 19.04920503471874);
  public currentMarkers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {
    if ( !this.divMap )  throw 'Elemento no encontrado';
    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLgLat, // starting position [lng, lat]
      zoom: this.zoomCurrent, // starting zoom
    });

    //Mandando a llamar el readLocalStorage
    this.readToLocalStorage(); //obtenendo los markers del localstorage


    //creando marker personalizado
    // const marketHmtl = document.createElement('div');
    // marketHmtl.innerHTML = 'Juanito';
    // marketHmtl.style.fontSize = '20px';
    // const marker = new Marker({
    //   color: 'tomato',
    //   // draggable: true
    //   element: marketHmtl
    // })
    //   .setLngLat(this.currentLgLat)
    //   .addTo(this.map);
  };

  ngOnDestroy(): void {
    this.map?.remove(); //esto es para evitar memory leaks y elimianar el mapa cuando se destruya el componente
  };

  //par de eventos para agregar los markers

  public createMarker(): void {
    if( !this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarker( lngLat ,color )
  };

  public addMarker(lng: LngLat, color: string): void {
    if( !this.map ) return;
    const marker = new Marker({ color, draggable: true }) //draggable hace que se pueda morver el marker
    .setLngLat( lng )
    .addTo(this.map)
    this.currentMarkers.push({ color, marker });

    this.saveToLocalStorage();

    marker.on("dragend",  () => this.saveToLocalStorage() ); //evento para guardar en el localstorage
    //flyto es para que el mapa se mueva a la posicion del marker y se le pasa un objeto con las coordenadas
    //guardamos el marker en el array de markers
  };

  public removeMarker(index: number) {
    this.currentMarkers[index].marker.remove(); //elimina el marker del mapa
    this.currentMarkers.splice(index, 1); //elimina el marker del array
  };

  public flyToMarker(marker:  Marker): void {
    this.map?.flyTo({
      center: marker.getLngLat(),

    });
  };

  public saveToLocalStorage(): void {
    const plainMarkers:  PlainMarker[] = this.currentMarkers.map(({color, marker}) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray() //regresa un array con los valores de longitud y latitud
      }
    });
    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ))
  };

  public readToLocalStorage(): void {
    const plainMarkersString =  localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString );
    plainMarkers.forEach( ({color, lngLat}) => {
      const [ lng, lat ] = lngLat; //destructuramos el array
      const coords = new LngLat( lng, lat ); //creamos un nuevo objeto de tipo LngLat
      this.addMarker( coords, color )
    }) //esto es para que se agreguen los markers al mapa
  };

}
