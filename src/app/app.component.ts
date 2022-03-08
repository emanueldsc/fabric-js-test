import { NodeWithI18n } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { Canvas, Circle, Line } from 'fabric/fabric-impl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'fabric-js-test'

  img: any = null
  angle: number = 0
  canvas: Canvas | undefined

  vertices: Circle[] = []

  constructor() { }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas')
    this.canvas.on('mouse:dblclick', (evt) => {

      const x = evt.pointer?.x as number
      const y = evt.pointer?.y as number

      const circle = this.makeCircle(x, y)

      this.makePath(circle)

      this.canvas?.add(circle)

    })

  }

  makeCircle(left: number, top: number, preLine?: any): any {
    const circle = new fabric.Circle({
      left,
      top,
      fill: 'red',
      strokeWidth: 5,
      stroke: '#F00',
      radius: 5
    })
    circle.hasControls = false
    circle.hasBorders = false;
    (circle as any).preLine = preLine
    return circle
  }

  makeLine(lastCircle: Circle, newCircle: Circle): Line {
    const coords = [lastCircle.left, lastCircle.top, newCircle.left, newCircle.top] as number[]
    return new fabric.Line(coords, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 1,
      selectable: false,
      evented: false,
    })
  }

  makePath(circle: Circle): void {
    this.vertices.push(circle)

    for (let i = 0; i < this.vertices.length - 1; i++) {
      const line = this.makeLine(this.vertices[i], this.vertices[i + 1])
      this.canvas?.add(line)
    }

  }

}
