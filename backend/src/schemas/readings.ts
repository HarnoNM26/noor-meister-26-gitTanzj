import { Type, Static } from '@sinclair/typebox';

export const GetReadingsParamsSchema = Type.Object({
    start: Type.Optional(Type.String()),
    end: Type.Optional(Type.String()),
    location: Type.Optional(Type.String())
})

export type GetReadingsParamsSchemaType = Static<typeof GetReadingsParamsSchema>;
