const zod=require('zod');

const createBook = zod.object({
    name:zod.string(),
    available:zod.number(),
    author:zod.string(),
    publicationYear:zod.number(),
})

const emailSchema=zod.string().email();
const passwordSchema=zod.string().min(6);

module.exports={
    emailSchema,
    passwordSchema,
    createBook
};