import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { map, forEach } from 'lodash';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { MatDialog } from '@angular/material';

import { BaseService } from './base.service';
import { SpinnerService } from './spinner.service';
import { SnackbarService } from './snackbar.service';

import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { IPost } from '../models/posts/IPost';
import { IPostResponse } from '../models/posts/IPostResponse';
import { IPostSearchRequest } from '../models/posts/IPostSearchRequest';

@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseService {
  constructor(
    private http: HttpClient,
    private router: Router, 
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private snackBar: SnackbarService
  ) {
    super();
  }

  postData: IPostResponse;
  postSubject: BehaviorSubject<IPostResponse> = new BehaviorSubject(this.postData);

  getPosts() {
    return this.postSubject.asObservable();
  }

  // api 
  GetAnnoucements(pageIndex: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageIndex', pageIndex.toString());
    params = params.append('pageSize', pageSize.toString());

    return this.http.get<{message: string, posts: any, totalPosts: number}>(`${this.api_base_url}/public/annoucement`, {params: params})
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
  }

  GetPosts(pageIndex: number, pageSize: number, search?: IPostSearchRequest) {
    let params = new HttpParams();
    params = params.append('pageIndex', pageIndex.toString());
    params = params.append('pageSize', pageSize.toString());
    
    if (search) {
      if (search.tags)
        params = params.append('searchInput', JSON.stringify(search.tags));
        
      if (search.date) {
        params = params.append('startDate', search.date.begin.toString());
        params = params.append('endDate', search.date.end.toString());
      }
    }

    this.spinner.show();
    this.http.get<{message: string, posts: any, totalPosts: number}>(`${this.api_base_url}/posts`, {params: params})
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
          this.spinner.hide();
        }, errpr => {
          this.spinner.hide();
        })
  }

  GetPostById(id: string): Observable<IPost> {
    return this.http.get<{message: string, post: any}>(`${this.api_base_url}/posts/${id}`)
    .pipe(
      rxMap((postData) => {
        return <IPost>{
          ...postData.post,
          id: postData.post._id
        };
      }))
  }

  AddPost(postData: IPost) {
    // console.log(postData);
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('tags', JSON.stringify(postData.tags));

    if (postData.documents) {
      forEach(postData.documents, i => formData.append('documents', i));
    }

    this.spinner.show();
    this.http.post<{message: string, post: any}>(`${this.api_base_url}/posts`, formData)
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
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          console.error('Failed to add post');
        });
  }

  UpdatePost(id: string, postData: IPost) {
    let request: any = null;
    if (postData.documents) {
      request = new FormData();
      request.append('title', postData.title);
      request.append('content', postData.content);
      request.append('tags', JSON.stringify(postData.tags));
      
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

    this.spinner.show();
    this.http.put<{message: string}>(`${this.api_base_url}/posts/${id}`, request)
    .subscribe(res => {
      this.router.navigate(['/post']);
      // console.log(res);
      this.spinner.hide();
    }, err => {
      console.error('Failed to update post');
      this.spinner.hide();
    });
  }

  DeletePost(id: string, pageIndex: number, pageSize: number) {
    const modalRef = this.dialog.open(ConfirmationDialogComponent);
    modalRef.componentInstance.title = "Delete Confirmation"
    modalRef.componentInstance.content = "Are you sure you want to delete this post?"
    modalRef.afterClosed().subscribe(x => {
      if (x) {
        this.http.delete<{message: string}>(`${this.api_base_url}/posts/${id}`)
        .subscribe(res => {
          this.snackBar.show('Post deleted successfully');
          // reload
          this.GetPosts(pageIndex, pageSize);
        }, err => {
          this.snackBar.show('Failed to delete post');
        });
      }
    }, error => {});
  }

  DownloadPostDocument(id?: string, data?: any) {
    if (data) {
      if (data instanceof File) {
        saveAs(data);
        return;
      }

      // retrieve from s3
      this.http.post<{response: any, message: string}>(`${this.api_base_url}/posts/${id}/document`, {key: data.key})
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
      this.http.post<{response: any, message: string}>(`${this.api_base_url}/posts/${id}/document`, null)
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

  PublishPost(id: string) {
    return this.http.post(`${this.api_base_url}/posts/${id}/publish`, null);
  }

  UnPublishPost(id: string) {
    return this.http.post(`${this.api_base_url}/posts/${id}/unpublish`, null);
  }
}
