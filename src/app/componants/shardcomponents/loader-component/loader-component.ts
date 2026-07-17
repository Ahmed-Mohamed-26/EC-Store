import { Component } from '@angular/core';
import { LoaderService } from '../../../services/loader-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loader-component',
  imports: [ AsyncPipe],
  templateUrl: './loader-component.html',
  styleUrl: './loader-component.css',
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}

}
