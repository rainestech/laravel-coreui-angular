import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Endpoints} from '../endpoints';
import {Channel, Comments, Tasks, TaskSort} from "../tasks/tasks.model";
import {FileStorage} from "../../../../../src/app/storage/storage.model";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiChannels = Endpoints.mainUrl + Endpoints.apiUrl + '/channels';
  private apiCalendar = Endpoints.mainUrl + Endpoints.apiUrl + '/calendar';
  private apiTasks = Endpoints.mainUrl + Endpoints.apiUrl + '/tasks';
  private apiComments = Endpoints.mainUrl + Endpoints.apiUrl + '/comments';
  private apiStorage = Endpoints.mainUrl + Endpoints.storageApi;

  constructor(private http: HttpClient) {
  }

  getMyChannels() {
    return this.http.get<Channel[]>(this.apiChannels + '/my').pipe(map(res => res));
  }

  getChannels() {
    return this.http.get<Channel[]>(this.apiChannels).pipe(map(res => res));
  }

  saveChannel(data: Channel) {
    return this.http.post<Channel>(this.apiChannels, data).pipe(map(res => res));
  }

  editChannel(data: Channel) {
    return this.http.put<Channel>(this.apiChannels, data).pipe(map(res => res));
  }

  deleteChannel(data: number) {
    return this.http.delete(this.apiChannels + '/remove/' + data).pipe(map(res => res));
  }

  // Task Endpoint
  getTaskByChannel(value: number) {
      return this.http.get<Tasks[]>(this.apiTasks + '/cid/' + value).pipe(map(res => res));
  }

  saveTask(data: Tasks) {
    return this.http.post<Tasks>(this.apiTasks, data).pipe(map(res => res));
  }

  saveTaskSort(data: TaskSort[]) {
    return this.http.post<TaskSort[]>(this.apiTasks + '/reorder', data).pipe(map(res => res));
  }

  updateTask(data: Tasks) {
    return this.http.put<Tasks>(this.apiTasks, data).pipe(map(res => res));
  }

  deleteTask(data: number) {
    return this.http.delete(this.apiTasks + '/remove/' + data).pipe(map(res => res));
  }

  // Comments API
  saveComments(data: Comments) {
    return this.http.post<Comments>(this.apiComments, data).pipe(map(res => res));
  }

  deleteComment(data: number) {
    return this.http.delete(this.apiComments + '/remove/' + data).pipe(map(res => res));
  }

  // calendar API
  getCalendar(channelId: number) {
    return this.http.get<any[]>(this.apiCalendar + '/cid/' + channelId).pipe(map(res => res));
  }

  saveCalendar(data: any) {
    return this.http.post<any>(this.apiCalendar, data).pipe(map(res => res));
  }

  editCalendar(data: any) {
    return this.http.put<any>(this.apiCalendar, data).pipe(map(res => res));
  }

  deleteCalendar(data: number) {
    return this.http.delete(this.apiCalendar + '/remove/' + data).pipe(map(res => res));
  }

  saveFile(data: FormData) {
    return this.http.post<any>(this.apiStorage, data).pipe(map(res => res))
  }
}
