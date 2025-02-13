import zlib from 'zlib';

import { Compress } from '../../../../src/Compress';
import {
  getFiles,
  clear,
  GZIPPER_CONFIG_FOLDER,
  generatePaths,
} from '../../../utils';
import { LogLevel } from '../../../../src/logger/LogLevel.enum';
import { Logger } from '../../../../src/logger/Logger';
import { CompressOptions } from '../../../../src/interfaces';

describe('CLI Compress -> Brotli compression', () => {
  let testPath: string;
  let compressTestPath: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetModules();
    [testPath, compressTestPath] = await generatePaths();
    const processSpy = jest.spyOn(global.process, 'cwd');
    processSpy.mockImplementation(() => testPath);
  });

  afterEach(async () => {
    await clear(testPath, true);
    await clear(GZIPPER_CONFIG_FOLDER, true);
  });

  test('--brotli-param-mode, --brotli-quality, --brotli-size-hint should change brotli configuration', async () => {
    const options: CompressOptions = {
      brotli: true,
      brotliParamMode: 'text',
      brotliQuality: 10,
      brotliSizeHint: 5,
    };
    const compress = new Compress(compressTestPath, null, options);
    const logSpy = jest.spyOn(Logger, 'log');
    await compress.run();
    const files = await getFiles(compressTestPath, ['.br']);

    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      'Compression BROTLI | paramMode: 1, quality: 10, sizeHint: 5',
      LogLevel.INFO,
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      'Default output file format: [filename].[ext].[compressExt]',
      LogLevel.INFO,
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(/\[\d+\] Worker has started./),
      LogLevel.INFO,
    );
    expect(logSpy).toHaveBeenLastCalledWith(
      expect.stringMatching(
        new RegExp(`${files.length} files have been compressed. (.+)`),
      ),
      LogLevel.SUCCESS,
    );
    expect((compress as any).compressionInstances[0].ext).toBe('br');
    expect(
      Object.keys((compress as any).compressionInstances[0].compressionOptions)
        .length,
    ).toBe(3);
    expect(Object.keys((compress as any).options).length).toBe(4);
    expect(
      (compress as any).compressionInstances[0].compressionOptions[
        zlib.constants.BROTLI_PARAM_MODE
      ],
    ).toBe(zlib.constants.BROTLI_MODE_TEXT);
    expect(
      (compress as any).compressionInstances[0].compressionOptions[
        zlib.constants.BROTLI_PARAM_QUALITY
      ],
    ).toBe(10);
    expect(
      (compress as any).compressionInstances[0].compressionOptions[
        zlib.constants.BROTLI_PARAM_SIZE_HINT
      ],
    ).toBe(5);
  });

  test('--brotli-param-mode=default should change brotli configuration', async () => {
    const options: CompressOptions = {
      brotli: true,
      brotliParamMode: 'default',
    };
    if (typeof zlib.createBrotliCompress !== 'function') {
      return;
    }
    const compress = new Compress(compressTestPath, null, options);
    const logSpy = jest.spyOn(Logger, 'log');
    await compress.run();
    const files = await getFiles(compressTestPath, ['.br']);

    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      'Compression BROTLI | paramMode: 0',
      LogLevel.INFO,
    );
    expect(logSpy).toHaveBeenLastCalledWith(
      expect.stringMatching(
        new RegExp(`${files.length} files have been compressed. (.+)`),
      ),
      LogLevel.SUCCESS,
    );
    expect((compress as any).compressionInstances[0].ext).toBe('br');
    expect(
      Object.keys((compress as any).compressionInstances[0].compressionOptions)
        .length,
    ).toBe(1);
    expect(Object.keys((compress as any).options).length).toBe(2);
    expect(
      (compress as any).compressionInstances[0].compressionOptions[
        zlib.constants.BROTLI_PARAM_MODE
      ],
    ).toBe(zlib.constants.BROTLI_MODE_GENERIC);
  });

  test('wrong value for --brotli-param-mode should change brotli configuration to brotliParamMode=default', async () => {
    const options: CompressOptions = {
      brotli: true,
      brotliParamMode: 'amigos',
    };
    if (typeof zlib.createBrotliCompress !== 'function') {
      return;
    }
    const compress = new Compress(compressTestPath, null, options);
    const logSpy = jest.spyOn(Logger, 'log');
    await compress.run();
    const files = await getFiles(compressTestPath, ['.br']);

    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      'Compression BROTLI | paramMode: 0',
      LogLevel.INFO,
    );
    expect(logSpy).toHaveBeenLastCalledWith(
      expect.stringMatching(
        new RegExp(`${files.length} files have been compressed. (.+)`),
      ),
      LogLevel.SUCCESS,
    );
    expect((compress as any).compressionInstances[0].ext).toBe('br');
    expect(
      Object.keys((compress as any).compressionInstances[0].compressionOptions)
        .length,
    ).toBe(1);
    expect(Object.keys((compress as any).options).length).toBe(2);
    expect(
      (compress as any).compressionInstances[0].compressionOptions[
        zlib.constants.BROTLI_PARAM_MODE
      ],
    ).toBe(zlib.constants.BROTLI_MODE_GENERIC);
  });

  test('--brotli-param-mode=font should change brotli configuration', async () => {
    const options: CompressOptions = {
      brotli: true,
      brotliParamMode: 'font',
    };
    if (typeof zlib.createBrotliCompress !== 'function') {
      return;
    }
    const compress = new Compress(compressTestPath, null, options);
    const logSpy = jest.spyOn(Logger, 'log');
    await compress.run();
    const files = await getFiles(compressTestPath, ['.br']);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      'Compression BROTLI | paramMode: 2',
      LogLevel.INFO,
    );
    expect(logSpy).toHaveBeenLastCalledWith(
      expect.stringMatching(
        new RegExp(`${files.length} files have been compressed. (.+)`),
      ),
      LogLevel.SUCCESS,
    );
    expect((compress as any).compressionInstances[0].ext).toBe('br');
    expect(
      Object.keys((compress as any).compressionInstances[0].compressionOptions)
        .length,
    ).toBe(1);
    expect(Object.keys((compress as any).options).length).toBe(2);
    expect(
      (compress as any).compressionInstances[0].compressionOptions[
        zlib.constants.BROTLI_PARAM_MODE
      ],
    ).toBe(zlib.constants.BROTLI_MODE_FONT);
  });
});
