import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { map, remove, findIndex, forEach } from 'lodash';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

import { IPost } from '../models/IPost';
import { IPostResponse } from '../models/IPostResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  postData: IPostResponse;
  postSubject: BehaviorSubject<IPostResponse> = new BehaviorSubject(this.postData);

  getPosts() {
    return this.postSubject.asObservable();
  }

  // api 
  GetPosts(pageIndex: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageIndex', pageIndex.toString());
    params = params.append('pageSize', pageSize.toString());
    this.http.get<{message: string, posts: any, totalPosts: number}>('http://localhost:3000/api/posts', {params: params})
        .pipe(rxMap((postData) => {
          return <IPostResponse> {
            totalPosts: postData.totalPosts,
            posts: map(postData.posts, p => {
              return {
                ...p,
                id: p._id
              }
            })
          };
        }))
        .subscribe(res => {
          this.postData = res;
          this.postSubject.next(this.postData);
        })
  }

  GetPostById(id: string): Observable<IPost> {
    return this.http.get<{message: string, post: any}>(`http://localhost:3000/api/posts/${id}`)
    .pipe(
      rxMap((postData) => {
        return <IPost>{
          ...postData.post,
          id: postData.post._id
        };
      }))
  }

  AddPost(postData: IPost) {
    console.log(postData);
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);

    if (postData.documents) {
      forEach(postData.documents, i => formData.append('documents', i));
    }

    this.http.post<{message: string, post: any}>('http://localhost:3000/api/posts', formData)
        .pipe(
          rxMap((postData) => {
            return <IPost> {
              ...postData.post,
              id: postData.post._id
            }
          })
        )
        .subscribe(res => {
          this.postData.totalPosts += 1;
          this.postData.posts.push(res);
          this.postSubject.next(this.postData);
          this.router.navigate(['post']);
        }, error => {
          console.error('Failed to add post');
        });
  }

  UpdatePost(id: string, postData: IPost) {
    let request: any = null;
    if (postData.documents) {
      request = new FormData();
      request.append('title', postData.title);
      request.append('content', postData.content);
      forEach(postData.documents, i => {
        if (i instanceof File)
          request.append('documents', i);
        else 
          request.append('documents', JSON.stringify(i));
      });
    }
    else {
      request = postData;
    }


    this.http.put<{message: string}>(`http://localhost:3000/api/posts/${id}`, request)
    .subscribe(res => {
      this.router.navigate(['/post']);
      console.log(res);
    }, err => {
      console.error('Failed to update post');
    });
  }

  DeletePost(id: string, pageIndex: number, pageSize: number) {
    this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${id}`)
    .subscribe(res => {
      // reload
      this.GetPosts(pageIndex, pageSize);
    }, err => {
      console.error('Failed to delete post');
    });
  }

  DownloadPostDocument(id?: string, data?: any) {
    if (data) {
      if (data instanceof File) {
        saveAs(data);
        return;
      }

      // retrieve from s3
      this.http.post<{response: any, message: string}>(`http://localhost:3000/api/posts/${id}/document`, {key: data.key})
      .subscribe(success => {
        console.log(success);
        if (success && success.response) {
          const blob = new Blob( [new Uint8Array(success.response.Body.data)] , { type: success.response.Metadata.mime});
          saveAs(blob, success.response.Metadata.originalname);
        }
      }, err => {
        console.error(err.message);
      });
    }
    else {
      // download all documents
      this.http.post<{response: any, message: string}>(`http://localhost:3000/api/posts/${id}/document`, null)
      .subscribe(success => {
        if (success && success.response) {
          var zip = new JSZip();
          var folder = zip.folder(`post_${id}`);
          forEach(success.response, x => {
            folder.file(x.Metadata.originalname, x.Body.data)
          });
          
          zip.generateAsync({type:"blob"})
          .then(function(content) {
            saveAs(content, `post_${id}.zip`);
          });        
        }
      }, err => {
        console.error(err.message);
      });
    }
  }
}
