import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonBadge, IonAvatar, IonItem, IonList, IonLoading, IonInfiniteScroll, IonInfiniteScrollContent, IonSkeletonText, IonAlert, InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonBadge, IonAvatar, IonItem, IonList, IonLoading, IonInfiniteScroll, IonInfiniteScrollContent, IonSkeletonText, IonAlert, DatePipe, RouterModule],
})
export class HomePage implements OnInit{
  private movieService = inject(MovieService);

  private currentPage = 1;
  public movies: any[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public isLoading = true;
  public error = null;
  public dummyArray = new Array(5);

  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
      catchError((err) => {
        this.error = err;
        return [];
      })
    ).subscribe({
      next: res => {
        this.movies.push(...res.results);

        event?.target.complete();

        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      }
    })
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
}
