import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { Canvas, Circle, Line } from 'fabric/fabric-impl';

type Connector = [number, number, number, number]

class Pointer {
  constructor(
    public left: number,
    public top: number,
  ) { }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  path: (Pointer | Connector)[] = []
  board: Canvas | undefined

  ngOnInit(): void {
    this.board = new fabric.Canvas('canvas')

    this.board.on('mouse:dblclick', evt => {
      const left = evt.pointer!.x
      const top = evt.pointer!.y
      const pointer = new Pointer(left, top)
      
      if(this.path.length == 0) {
        this.path.push(pointer)
        this.board!.add(this.makeCircle(pointer))
      } else {
        const lastPointer: Pointer = this.path[this.path.length-1] as Pointer
        const connector: Connector = [lastPointer.left, lastPointer.top, pointer.left, pointer.top]
        this.path.push(connector)
        this.path.push(pointer)

        this.board!.add(this.makeLine(connector))
        this.board!.add(this.makeCircle(pointer))
      }

    })

    this.board.on('object:moving', evt => {
      console.log(evt.target)
    })

  }

  makeCircle(pointer: Pointer): Circle {
    const circ = new fabric.Circle({
      left: pointer.left,
      top: pointer.top,
      radius: 10,
      fill: 'transparent',
      stroke: '#666'
    })
    circ.hasControls = false
    circ.hasBorders = false
    return circ
  }

  makeLine(connector: Connector): Line {
    const line = new fabric.Line(connector, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 3,
      selectable: false,
      evented: false
    })
    return line
  }


}
