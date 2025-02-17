import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import { Block } from '../../models/parking/block';

@Injectable({
  providedIn: 'root',
})
export class BlocksService {
  constructor(private http: HttpClient) {}

  getBlocks() {
    return this.http.get<Response<Block[]>>('block');
  }

  addBlock(name: string) {
    return this.http.post<Response<any>>('block', { name });
  }

  deleteBlock(id: number) {
    return this.http.delete<Response<any>>(`block/${id}`);
  }

  addParkingSpace(blockId: number, typeId: number) {
    return this.http.post<Response<any>>('parking', {
      blockId,
      typeId,
    });
  }
}
