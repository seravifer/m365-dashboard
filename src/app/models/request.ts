export enum Commands {
  MASTER_TO_M365 = 0x20,
  MASTER_TO_BATTERY = 0x22,
  READ = 0x01,
  WRITE = 0x03
}

export class Request {
  private msg: number[]

  private direction: number;
  private rw: number;
  private position: number;
  private payload: number[];
  private checksum: number;

  constructor() {
    this.direction = 0;
    this.rw = 0;
    this.position = 0;
    this.payload = null;
    this.checksum = 0;
  }

  setDirection(drct: Commands) {
    this.direction = drct;
    this.checksum += this.direction;
    return this;
  }

  setRW(readOrWrite: Commands) {
    this.rw = readOrWrite;
    this.checksum += this.rw;
    return this;
  }

  setPosition(pos: number) {
    this.position = pos;
    this.checksum += this.position;
    return this;
  }

  setPayloadList(bytesToSend: number[]) {
    this.payload = bytesToSend;
    this.checksum += this.payload.length + 2;
    for (let i of this.payload) {
      this.checksum += i;
    }
    return this;
  }

  setPayload(singleByteToSend: number) {
    this.payload = [];
    this.payload.push(singleByteToSend);
    this.checksum += 3;
    this.checksum += singleByteToSend;
    return this;
  }

  build() {
    this.setupHeaders();
    this.setupBody();
    this.calculateChecksum();
    return this.construct();
  }

  private setupHeaders() {
    this.msg = [];
    this.msg.push(0x55);
    this.msg.push(0xAA);
  }

  private setupBody() {
    this.msg.push(this.payload.length + 2);
    this.msg.push(this.direction);
    this.msg.push(this.rw);
    this.msg.push(this.position);
    for (let i of this.payload) {
      this.msg.push(i);
    }
  }

  private calculateChecksum() {
    this.checksum ^= 0xffff;
    this.msg.push((this.checksum & 0xff));
    this.msg.push(this.checksum >> 8);
  }

  construct() {
    let result = '';
    for (let i of this.msg) {
      result += (i >= 0) && (i <= 15) ? "0" + i : i;
    }
    return result;
  }
}