export class Endpoints {
  static host = window.location.hostname;
  static appApi = '/api/v1';

  static apiUrl = '/api/v1';

  static get mainUrl() {
    if (this.host.includes('localhost')) {
      return 'http://localhost:8000';
    }
    return '';
  }
  static adminApi = '/api';

  static get storageApi() {
    return '/api/v1/fs';
  }

  static get fsDL() {
    return '/fs/dl';
  }

}
