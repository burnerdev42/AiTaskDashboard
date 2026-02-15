import {
  CorrelationMiddleware,
  RequestWithTraceId,
} from './correlation.middleware';
import { Request, Response } from 'express';

describe('CorrelationMiddleware', () => {
  let middleware: CorrelationMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    middleware = new CorrelationMiddleware();
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      setHeader: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should generate a new traceId when none exists', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      const req = mockRequest as RequestWithTraceId;
      expect(req.traceId).toBeDefined();
      expect(typeof req.traceId).toBe('string');
      expect(req.traceId.length).toBeGreaterThan(0);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        req.traceId,
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-trace-id',
        req.traceId,
      );
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should use existing x-correlation-id header', () => {
      const existingTraceId = 'existing-trace-id-123';
      mockRequest.headers = {
        'x-correlation-id': existingTraceId,
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      const req = mockRequest as RequestWithTraceId;
      expect(req.traceId).toBe(existingTraceId);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'x-correlation-id',
        existingTraceId,
      );
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should use existing x-trace-id header', () => {
      const existingTraceId = 'trace-id-456';
      mockRequest.headers = {
        'x-trace-id': existingTraceId,
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      const req = mockRequest as RequestWithTraceId;
      expect(req.traceId).toBe(existingTraceId);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should use existing x-request-id header', () => {
      const existingRequestId = 'request-id-789';
      mockRequest.headers = {
        'x-request-id': existingRequestId,
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      const req = mockRequest as RequestWithTraceId;
      expect(req.traceId).toBe(existingRequestId);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should set id property on request for backward compatibility', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      const req = mockRequest as Request & { id: string };
      expect(req.id).toBeDefined();
      expect(req.id).toBe((mockRequest as RequestWithTraceId).traceId);
    });

    it('should prioritize x-correlation-id over other headers', () => {
      mockRequest.headers = {
        'x-correlation-id': 'correlation-id',
        'x-trace-id': 'trace-id',
        'x-request-id': 'request-id',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      const req = mockRequest as RequestWithTraceId;
      expect(req.traceId).toBe('correlation-id');
    });
  });
});
