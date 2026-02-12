import { Type, Static } from '@sinclair/typebox';

export const GetReadingsParamsSchema = Type.Object({
    start: Type.Optional(Type.String()),
    end: Type.Optional(Type.String()),
    location: Type.Optional(Type.String())
})

export type GetReadingsParamsSchemaType = Static<typeof GetReadingsParamsSchema>;

export const PostSyncPricesParamsSchema = Type.Object({
    start: Type.Optional(Type.String()),
    end: Type.Optional(Type.String()),
    location: Type.Optional(Type.Union([
        Type.Literal('EE'),
        Type.Literal('LV'),
        Type.Literal('FI')
    ]))
})

export type PostSyncPricesParamsType = Static<typeof PostSyncPricesParamsSchema>

export const DeleteReadingsQuerySchema = Type.Object({
    source: Type.Union([
        Type.Literal('UPLOAD'),
        Type.Literal('API')
    ])
})

export type DeleteReadingsQueryType = Static<typeof DeleteReadingsQuerySchema>;
 