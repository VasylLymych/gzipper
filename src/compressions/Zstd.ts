import zstd from 'simple-zstd';

import { Compression } from './Compression';
import { CompressOptions, ZstdOptions } from '../interfaces';
import { CompressionExtensions, CompressionNames } from '../enums';

/**
 * Zstd compression
 */
export class ZstdCompression extends Compression<ZstdOptions> {
  readonly compressionName = CompressionNames.ZSTD;
  readonly ext = CompressionExtensions.ZSTD;
  /**
   * Creates an instance of ZstdCompression.
   */
  constructor(options: CompressOptions) {
    super(options);
  }

  /**
   * Returns zstd compression instance in closure.
   */
  getCompression(): () => zstd.ZSTDCompress {
    return (): zstd.ZSTDCompress =>
      zstd.ZSTDCompress(this.compressionOptions.level);
  }

  /**
   * Build zstd compression options object.
   */
  protected selectCompression(): void {
    const options: ZstdOptions = {};

    if (this.options.zstdLevel !== undefined) {
      options.level = this.options.zstdLevel;
    }

    this.compressionOptions = options;
  }
}