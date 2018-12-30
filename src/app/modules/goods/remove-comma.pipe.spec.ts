import { RemoveCommaPipe } from './remove-comma.pipe';

describe('PricePipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveCommaPipe();
    expect(pipe).toBeTruthy();
  });
});
