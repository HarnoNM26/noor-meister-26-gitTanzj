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
        Type.Literal('ee'),
        Type.Literal('lv'),
        Type.Literal('fi')
    ]))
})

export type PostSyncPricesParamsType = Static<typeof PostSyncPricesParamsSchema>
 