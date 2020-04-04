import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  HostListener
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  // title = 'video-web-player-angular';

  name = '';
  playerSrc: SafeResourceUrl | string = '';
  trackSrc: SafeResourceUrl | string = '';

  @ViewChild('videoFileInput')
  videoFileInput: ElementRef;

  @ViewChild('subtitleFileInput')
  subtitleFileInput: ElementRef;

  @ViewChild('videoTag')
  videoTag: ElementRef;

  @ViewChild('subtitleTag')
  subtitleTag: ElementRef;

  videoFile: File | null = null;
  subtitleFile: File | null = null;

  progress = 0.0;

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.saveProgressToLocalStorage();
  }

  saveProgressToLocalStorage() {
    localStorage.setItem(this.name, this.videoTag?.nativeElement?.currentTime);
  }

  retrieveProgressFromLocalStorage() {
    this.progress = +localStorage.getItem(this.name) || 0;
  }

  onClickVideoFileInputButton(): void {
    if (this.videoTag) {
      console.log(this.videoTag);
      console.log(this.videoTag.nativeElement.currentTime);
    }
    this.videoFileInput.nativeElement.click();
  }

  onChangeVideoFileInput(): void {
    const videoFiles: { [key: string]: File } = this.videoFileInput
      .nativeElement.files;
    this.videoFile = videoFiles[0];
    if (!this.videoFile) {
      return;
    }
    if (this.videoTag) {
      this.saveProgressToLocalStorage();
    }
    this.name = this.videoFile.name;
    this.retrieveProgressFromLocalStorage();
    this.playerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(this.videoFile) + '#t=' + this.progress
    );
    if (this.videoTag) {
      this.videoTag.nativeElement.load();
    }
  }

  onClickSubtitleFileInputButton(): void {
    if (this.subtitleTag) {
      console.log(this.subtitleTag);
      console.log(this.subtitleTag.nativeElement.currentTime);
    }
    this.subtitleFileInput.nativeElement.click();
  }

  onChangeSubtitleFileInput(): void {
    const subtitleFiles: { [key: string]: File } = this.subtitleFileInput
      .nativeElement.files;
    this.subtitleFile = subtitleFiles[0];
    if (!this.subtitleFile) {
      return;
    }
    this.name = this.subtitleFile.name;
    this.trackSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(this.subtitleFile)
    );
    if (this.subtitleTag) {
      this.subtitleTag.nativeElement.load();
    }
  }
}
