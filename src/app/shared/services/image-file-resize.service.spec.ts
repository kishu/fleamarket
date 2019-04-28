import { TestBed } from '@angular/core/testing';

import { ImageFileResizeService } from './image-file-resize.service';

describe('ImageFileResizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageFileResizeService = TestBed.get(ImageFileResizeService);
    expect(service).toBeTruthy();
  });
});
