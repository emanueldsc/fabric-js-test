import { Call } from '@angular/compiler';
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
    const line1 = this.makeLine([250, 125, 250, 175])
    const line2 = this.makeLine([250, 175, 250, 250])
    const line3 = this.makeLine([250, 250, 300, 350])
    const line4 = this.makeLine([300, 350, 200, 350])
    const line5 = this.makeLine([200, 350, 175, 225])
    const line6 = this.makeLine([175, 225, 325, 225])

    this.board.add(
      line1,
      line2,
      line3,
      line4,
      line5,
      line6
    )

    this.board.add(
      this.makeCircle(line1.get('x1') as number, line1.get('y1') as number, line1),
      this.makeCircle(line2.get('x1') as number, line2.get('y1') as number, line1, line2),
      this.makeCircle(line3.get('x1') as number, line3.get('y1') as number, line2, line3),
      this.makeCircle(line4.get('x1') as number, line4.get('y1') as number, line3, line4),
      this.makeCircle(line5.get('x1') as number, line5.get('y1') as number, line4, line5),
      this.makeCircle(line6.get('x1') as number, line6.get('y1') as number, line5, line6),
      this.makeCircle(line6.get('x2') as number, line6.get('y2') as number, line6),
    )

    this.board.on('object:moving', (e) => {
      const p = e.target as any;
      const [after, before] = p.lines
      after && after.set({'x2': p.left, 'y2': p.top})
      before && before.set({'x1': p.left, 'y1': p.top})
      this.board?.renderAll()
    });
  }

  makeCircle(left: number, top: number, ...lines: any[]): Circle {
    const c: any = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 12,
      fill: '#fff',
      stroke: '#666'
    });
    c.hasControls = c.hasBorders = false;

    c.lines = lines

    return c;
  }

  makeLine(connector: Connector): Line {
    const line = new fabric.Line(connector, {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 5,
      selectable: false,
      evented: false
    })
    return line
  }


}
