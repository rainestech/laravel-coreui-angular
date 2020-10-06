import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  a = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen '];

  b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety'];

  transform(value: any, args?: any): any {
    if (value) {
      let kobo = value.toString().split('.')[1];
      if (kobo) {
        kobo = kobo.substring(0, 2);
      }
      kobo = Number(kobo);
      let num: any = Number(value.toString().split('.')[0]);
      if (num) {
        if ((num = num.toString()).length > 9) {
          return 'Amount not supported)';
        }
        const n = ('000000000' + num).substr(-9).match(/^(\d{1})(\d{2})(\d{1})(\d{2})(\d{1})(\d{2})$/);
        const k = ('00' + kobo).substr(-2).match(/^(\d{2})$/);
        if (!n) {
          return '';
        }
        // console.log(n);
        let str = '';
        str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'Hundred ' : '';
        str += (Number(n[2]) !== 0) ? ((str !== '') ? 'and ' : '') + (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'Million ' : ((str.includes('Hundred')) ? 'Million ' : '');
        str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'Hundred ' : '';
        str += (Number(n[4]) !== 0) ? ((str !== '') ? 'and ' : '') + (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'Thousand ' : ((str.includes('Hundred') && !str.includes('Million')) ? 'Thousand ' : '');
        str += (Number(n[5]) !== 0) ? (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' + this.a[n[5][1]]) + 'Hundred ' : '';
        str += (Number(n[6]) !== 0) ? ((str !== '') ? 'and ' : '') + (this.a[Number(n[6])] || this.b[n[6][0]] + ' ' + this.a[n[6][1]]) : '';
        if (!k) {
          str += 'Naira Only';
          return str.toUpperCase();
        }

        str += (Number(k[1]) !== 0) ? 'Naira, ' + (this.a[Number(k[1])] || this.b[k[1][0]] + ' ' + this.a[k[1][1]]) + 'Kobo' : '';
        return str.toUpperCase();
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
