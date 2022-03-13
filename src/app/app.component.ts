import { Call } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { Canvas, Circle, Line } from 'fabric/fabric-impl';
import { BehaviorSubject } from 'rxjs';

type Pointer = [number, number]


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  pointers: any[] = []
  canvas: Canvas | null = null

  itemsDrawn: BehaviorSubject<(Circle | Line)[]> = new BehaviorSubject<(Circle | Line)[]>([])

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas')

    this.canvas.on('mouse:dblclick', evt => {
      const left = evt.pointer!.x
      const top = evt.pointer!.y

      const circle = this.makeCircle(left, top)

      this.pointers.push(circle)

      this.canvas?.add(circle)

    })

    
    // this.board.on('object:moving', (e) => {
    //   const p = e.target as any;
    //   const [after, before] = p.lines
    //   before && before.set({ 'x1': p.left + 5, 'y1': p.top + 5 })
    //   after && after.set({ 'x2': p.left + 5, 'y2': p.top + 5 })
    //   this.board?.renderAll()
    // });
  }

  

  makeCircle(left: number, top: number): Circle {
    const c: any = new fabric.Circle({
      left: left - 3,
      top: top - 3,
      strokeWidth: 3,
      radius: 5,
      fill: 'red',
      stroke: 'red'
    });
    c.hasControls = c.hasBorders = false;
    return c;
  }

  makeLine(init: Pointer, end: Pointer): Line {
    const line = new fabric.Line([...init, ...end], {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 3,
      selectable: false,
      evented: false
    })
    return line
  }


}
