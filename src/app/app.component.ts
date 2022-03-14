import { Call } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { Canvas, Circle, Line, Polygon } from 'fabric/fabric-impl';
import { BehaviorSubject } from 'rxjs';

type Pointer = [number, number]
type MyCircle = Circle & { lineB: Line, lineA: Line }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  pointers: (MyCircle | Circle)[] = []
  polygons: any[] = []
  canvas: Canvas | null = null

  itemsDrawn: BehaviorSubject<(Circle | Line)[]> = new BehaviorSubject<(Circle | Line)[]>([])

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas')

    this.canvas.on('mouse:dblclick', evt => {
      if (this.pointers.length > 2 && evt.target == this.pointers[0]) {
        const cF = this.pointers[0] as MyCircle
        const cL = this.pointers[this.pointers.length - 1] as MyCircle
        const line = this.makeLine([cL.left as number, cL!.top as number], [cF.left as number, cF.top as number])
        cF.lineB = cF.lineB ?? line
        cL.lineA = cL.lineA ?? line
        this.canvas?.add(line)
        this.createPoligon()
      } else {
        const left = evt.pointer!.x
        const top = evt.pointer!.y
        const circle = this.makeCircle(left, top)
        this.pointers.push(circle)
        this.drawnPath()
        this.canvas?.add(circle)
      }
    })

    this.canvas.on('object:moving', (e) => {
      const p = e.target as any;
      const { lineB, lineA } = p
      lineB && lineB.set({ 'x2': p.left + 3, 'y2': p.top + 3 })
      lineA && lineA.set({ 'x1': p.left + 3, 'y1': p.top + 3 })
      this.canvas?.renderAll()
    });
  }

  drawnPath(): void {

    if (this.pointers.length <= 1) {
      return
    }

    for (let i = 0; i < this.pointers.length; i++) {

      if (i == 0) {

        const cF = this.pointers[0] as MyCircle
        const ca = this.pointers[1] as MyCircle

        const lineA = ca.lineB || this.makeLine([cF.left as number, cF.top as number], [ca.left as number, ca.top as number])
        this.insertLine(cF, undefined, lineA)

      } else if (i == (this.pointers.length - 1)) {
        const cb = this.pointers[this.pointers.length - 2] as MyCircle
        const cL = this.pointers[this.pointers.length - 1] as MyCircle


        const lineB = cb.lineA || this.makeLine([cb.left as number, cb.top as number], [cL.left as number, cL.top as number])
        this.insertLine(cL, lineB)
      }
      if (i > 0 && i < (this.pointers.length - 1)) {
        const cb = this.pointers[i - 1] as MyCircle
        const cM = this.pointers[i] as MyCircle
        const ca = this.pointers[i + 1] as MyCircle

        const lineB = this.makeLine([cb.left as number, cb.top as number], [cM.left as number, cM.top as number])
        const lineA = this.makeLine([cM.left as number, cM.top as number], [ca.left as number, ca.top as number])

        this.insertLine(cM, lineB, lineA)
      }

    }

    console.log(this.pointers)

  }

  insertLine(circle: { lineB?: Line, lineA?: Line } & Circle, lineB?: Line, lineA?: Line) {

    if (lineB && !circle.lineB) {
      circle.lineB = lineB
      this.canvas?.add(lineB)
    }

    if (lineA && !circle.lineA) {
      circle.lineA = lineA
      this.canvas?.add(lineA)
    }

  }

  makeCircle(left: number, top: number, lineB?: number[], lineA?: number[]): Circle {
    const c: any = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 3,
      radius: 5,
      fill: 'red',
      stroke: 'red'
    });
    c.hasControls = c.hasBorders = false;

    c.lineB = lineB
    c.lineA = lineA

    return c;
  }

  makeLine(init: Pointer, end: Pointer): Line {
    const line = new fabric.Line([...init.map(e => e + 3), ...end.map(e => e + 3)], {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 3,
      selectable: false,
      evented: false
    })
    return line
  }

  createPoligon() {
    const points = this.pointers.map(el => ({ x: el.left as number, y: el.top as number}))
    const polygon = new fabric.Polygon(points, {
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 3,
      strokeDashArray: [10]
    })
    polygon.on('mouse:dblclick', evt => {
      debugger
      const poly = evt.target as Polygon
      (poly as any).edit = !(poly as any).edit
    })
    this.canvas?.add(polygon)
    this.pointers.forEach( el => {
      this.canvas?.remove((el as any).lineB)
      this.canvas?.remove((el as any).lineA)
      this.canvas?.remove(el)
    });
    this.pointers = []
    this.canvas?.renderAll()
    
  }


}
