import { Logger, NotFoundException } from '@nestjs/common';
import { Model, Types, UpdateQuery, SaveOptions, Connection } from 'mongoose';
import { Document } from 'mongoose';

/**
 * Populate option type: supports simple string, array, or object with path + select.
 */
export type PopulateOption =
  | string
  | string[]
  | { path: string; select?: string }[];

/**
 * Abstract Repository class for Mongoose models.
 * Provides generic CRUD operations.
 */
export abstract class AbstractRepository<TDocument extends Document> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  /**
   * Creates a new document.
   * @param document Data to create.
   * @param options Save options.
   * @returns The created document.
   */
  create = async (
    document: Partial<TDocument>,
    options?: SaveOptions,
  ): Promise<TDocument> => {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save(options)) as unknown as TDocument;
  };

  /**
   * Finds a single document matching the filter.
   * @param filterQuery Filter criteria.
   * @param options Query options (projection, population).
   * @returns The found document.
   * @throws NotFoundException if not found.
   */
  findOne = async (
    filterQuery: Record<string, any>,
    options?: { populate?: PopulateOption },
  ): Promise<TDocument> => {
    const query = this.model.findOne(filterQuery, {}, { lean: true });

    if (options?.populate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      query.populate(options.populate as any);
    }

    const document = await query.exec();

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  };

  /**
   * Finds a document and updates it.
   * @param filterQuery Filter criteria.
   * @param update Update operations.
   * @returns The updated document.
   */
  findOneAndUpdate = async (
    filterQuery: Record<string, any>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> => {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  };

  upsert = async (
    filterQuery: Record<string, any>,
    document: Partial<TDocument>,
  ) => {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  };

  /**
   * Finds multiple documents.
   * @param filterQuery Filter criteria.
   * @param options Sorting, skipping, limiting, and population options.
   * @returns List of documents.
   */
  find = async (
    filterQuery: Record<string, any>,
    options?: {
      sort?: any;
      skip?: number;
      limit?: number;
      populate?: PopulateOption;
    },
  ): Promise<TDocument[]> => {
    const query = this.model.find(filterQuery, {}, { lean: true, ...options });

    if (options?.populate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      query.populate(options.populate as any);
    }

    return query.exec() as unknown as Promise<TDocument[]>;
  };

  delete = async (filterQuery: Record<string, any>): Promise<TDocument> => {
    const document = await this.model.findOneAndDelete(filterQuery, {
      lean: true,
    });
    if (!document) {
      throw new NotFoundException('Document not found.');
    }
    return document as unknown as TDocument;
  };

  startTransaction = async () => {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  };
}
