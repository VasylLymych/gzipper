import { filter } from './filter.decorator';
import { LogLevel } from './LogLevel.enum';

/**
 * Custom logger.
 */
export class Logger {
  static verbose: boolean;

  /**
   * Set verbose mode.
   */
  static setVerboseMode(verbose: boolean): void {
    Logger.verbose = verbose;
  }

  /**
   * Log message.
   */
  @filter()
  static log<T>(message: T, level: LogLevel = LogLevel.DEBUG): void {
    return Logger.logger(message, level);
  }

  /**
   * Colorize messages depends on the level and return a wrapper.
   */
  private static logger<T>(message: T, level: LogLevel): void {
    let colorfulMessage: string;
    const prefix = 'gzipper';

    switch (level) {
      case LogLevel.INFO:
        colorfulMessage = `\x1b[30;46m${prefix}:\x1b[0m\x1b[36m %s\x1b[0m`;
        break;

      case LogLevel.ERROR:
        colorfulMessage = `\x1b[30;41m${prefix}:\x1b[0m\x1b[31m %s\x1b[0m`;
        break;

      case LogLevel.WARNING:
        colorfulMessage = `\x1b[30;43m${prefix}:\x1b[0m\x1b[33m %s\x1b[0m`;
        break;

      case LogLevel.SUCCESS:
        colorfulMessage = `\x1b[30;42m${prefix}:\x1b[0m\x1b[32m %s\x1b[0m`;
        break;

      case LogLevel.DEBUG:
      default:
        colorfulMessage = `${prefix}: %s`;
        break;
    }

    console.log(colorfulMessage, message);
  }
}
