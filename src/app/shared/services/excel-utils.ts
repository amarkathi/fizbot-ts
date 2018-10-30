import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as AssistantV1 from '../models/assistant/v1';
import {MessageResponse} from '../models/assistant/v1';
import * as Excel from 'exceljs';

@Injectable()
export class ExcelUtils {

  readExcel() {

    /* read from a file*/
    const workbook = new Excel.Workbook();
  }

  writeExcel() {}

  readOneRow() {}
  writeOneRow() {}
}
