import { patchConsoleMethods } from '../src';

describe('public api', () => {
  describe('patchConsoleMethods', () => {
    let logSpy;
    let errorSpy;

    beforeEach(() => {
      logSpy = jest.spyOn(global.console, 'log').mockImplementation(() => null);
      errorSpy = jest
        .spyOn(global.console, 'error')
        .mockImplementation(() => null);

      patchConsoleMethods(
        ['debug', 'log', 'info', 'warn', 'error'],
        [
          { matcher: 'is info', level: 'INFO' },
          { matcher: 'is warning', level: 'WARNING' },
          { matcher: 'is error', level: 'ERROR' },
        ],
        {
          filenameRegex: /\.test\.[jt]sx?/,
          getTestName: () => expect.getState().currentTestName,
          threshold: 'WARNING',
        },
      );
    });

    describe('below threshold', () => {
      it('does not log the message', () => {
        console.log('is info');
        expect(logSpy).not.toHaveBeenCalled();
      });
    });

    describe('at threshold', () => {
      it('logs the message', () => {
        console.log('is warning');
        expect(logSpy).toHaveBeenCalled();
      });
    });

    describe('above threshold', () => {
      it('logs the message', () => {
        console.error('is error');
        expect(errorSpy).toHaveBeenCalled();
      });
    });

    describe('no log matcher', () => {
      it('logs the message', () => {
        console.error('nothing matches this');
        expect(errorSpy).toHaveBeenCalled();
      });
    });

    describe('unserializable objects', () => {
      it('logs the message', () => {
        const parent = { child: null };
        const child = { parent };
        parent.child = child;
        console.log(parent);
        expect(logSpy).toHaveBeenCalled();
      });
    });
  });
});
